var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	replace = require('replace'),
	rjs = require('gulp-requirejs'),
	realUncss = require('uncss');

/* using uncss (see https://github.com/giakki/uncss) in order to delete all unused css-rules and classes from the css file. Minifying the css file afterwards. */
gulp.task('uncssAndMinify', ['compileSassToCss'], function() {
	var fs = require('fs');

	var files = [
		'src/index.html',
		'src/resources/templates/toolbar.html',
		'src/resources/templates/imprint.html',
		'src/resources/templates/gasstationChooser.html',

		'src/resources/templates/entryCreator/entryForm.html',
		'src/resources/templates/entryCreator/fuelsortPriceRow.html',

		'src/resources/templates/entryDetail/detailInformation.html',
		'src/resources/templates/entryDetail/entryDetail.html',

		'src/resources/templates/entryList/entryItem.html',
		'src/resources/templates/entryList/entryList.html',

		'src/resources/templates/entryMap/entryMap.html',
		'src/resources/templates/entryMap/infoWindow.html',

		'src/resources/templates/menu/desktopMenu.html',
		'src/resources/templates/menu/menu.html',

		'src/resources/templates/statistic/statistic.html',
		'src/resources/templates/statistic/statisticResults.html',

		'http://localhost/_dev/javascript/requireJs/kleverTanken/src/index.html',
		'http://localhost/_dev/javascript/requireJs/kleverTanken/src/index.html#entryMap',
		'http://localhost/_dev/javascript/requireJs/kleverTanken/src/index.html#entryDetail',
		'http://localhost/_dev/javascript/requireJs/kleverTanken/src/index.html#entryDetail/123',
		'http://localhost/_dev/javascript/requireJs/kleverTanken/src/index.html#entryCreator',
		'http://localhost/_dev/javascript/requireJs/kleverTanken/src/index.html#statistics',
		'http://localhost/_dev/javascript/requireJs/kleverTanken/src/index.html#imprint'
	];

	var options = {
		ignore: [/menu/, /dw/, /android/, /alertify/],
		timeout: 10000
	};

	realUncss(files, options, function(error, output) {
		fs.writeFile('src/resources/css/app-uncss.css', output, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('app-uncss.css saved successfully!');
			}
		});

		gulp.src('src/resources/css/app-uncss.css')
			.pipe(minifycss({
				keepSpecialComments: 0
			}))
			.pipe(rename({suffix: '-min'}))
			.pipe(gulp.dest('target/resources/css'));
	});
});

/* compile SCSS to CSS */
gulp.task('compileSassToCss', function() {
	return gulp.src('src/resources/sass/app.scss')
		.pipe(sass({style: 'expanded'}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('src/resources/css'));
});

// Watch Files For Changes
gulp.task('watchScss', function() {
	gulp.watch('src/resources/sass/**/*.scss', ['compileSassToCss']);
});

/* check scripts BEFORE minifying */
gulp.task('scripts', function() {
	return gulp.src([
			'src/scripts/collection/*.js',
			'src/scripts/mixin/*.js',
			'src/scripts/view/*.js',
			'src/scripts/viewModel/*.js',
			'src/scripts/*.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

/* optimize images */
gulp.task('images', function() {
	return gulp.src('src/resources/images/**/*')
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('target/resources/images'));
});

/* delete target folder, cleaning up */
gulp.task('clean', function() {
	return gulp.src('target', {read: false})
		.pipe(clean());
});

/* replace paths and files in index.html to load the optimized files */
// https://npmjs.org/package/replace
gulp.task('replace', ['copy'], function() {
	replace({
		regex: "<link href=\"resources/css/app.css\"",
		replacement: "<link href=\"resources/css/app-uncss-min.css\"",
		paths: ['target/index.html']
	});

	replace({
		regex: "<!--<script",
		replacement: "<script",
		paths: ['target/index.html']
	});
	replace({
		regex: "script>-->",
		replacement: "script>",
		paths: ['target/index.html']
	});
});

/* run r.js to concat all js files to one single js file */
// https://npmjs.org/package/gulp-requirejs
gulp.task('rjs', function() {
	return rjs({
		baseUrl: 'src/scripts',
		mainConfigFile: 'src/scripts/main.js',
		name: 'main',
		out: 'scripts/main.js'
	})
		.pipe(uglify())
		.pipe(gulp.dest('target'));
});

/* copy important resources like the main index.html */
gulp.task('copy', function() {
	return gulp.src(
		[
			'src/index.html',
			'src/data/**/*',
			'!src/data/php/connection.php',
			'src/resources/fonts/*',
			'src/scripts/lib/require_*min.js'
		],
		{base: './src/'}
	).pipe(gulp.dest('target'));
});

/* default task */
gulp.task('target', ['clean'], function() {
	gulp.start('scripts', 'rjs', 'uncssAndMinify', 'images', 'copy', 'replace');
});