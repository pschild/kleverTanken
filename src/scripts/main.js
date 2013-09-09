require.config({
	baseUrl: 'scripts',

	paths: {
		jquery: 'lib/jquery-1.9.1.min',
		underscore: 'lib/underscore-min',
		text: 'lib/text-2.0.7',

		/* jQuery-Plugins */
		'mobiscroll.core': 'lib/mobiscroll/mobiscroll.core',
		'mobiscroll.datetime': 'lib/mobiscroll/mobiscroll.datetime',
		'mobiscroll.i18n.de': 'lib/mobiscroll/i18n/mobiscroll.i18n.de',
		'jquery-fast-click': 'lib/jquery-fast-click',
		nprogress: 'lib/nprogress',
		alertify: 'lib/alertify',
		chartJs: 'lib/Chart',

		templates: '../resources/templates'
	},
	
	shim: {
		underscore: {
			exports: '_'
		},

		'mobiscroll.core': {
			deps: ['jquery'],
			exports: '$'
		},
		'mobiscroll.datetime': {
			deps: ['mobiscroll.core'],
			exports: '$'
		},
		'mobiscroll.i18n.de': {
			deps: ['mobiscroll.core'],
			exports: '$'
		},
		'jquery-fast-click': {
			deps: ['jquery'],
			exports: '$'
		},
		alertify: {
			deps: ['jquery'],
			exports: '$'
		}
	},
	
	/* Prevent requirejs script caching */
	urlArgs: 'v=' + (new Date()).getTime()
});

require(
	['jquery', 'Application'],
	function($, Application) {
		'use strict';
		
		$(function() {
			var application = new Application();
			application.bootstrap();
		});
	}
);