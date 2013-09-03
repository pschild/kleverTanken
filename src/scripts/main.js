require.config({
	baseUrl: 'scripts',

	paths: {
		jquery: 'lib/jquery-1.9.1.min',
		underscore: 'lib/underscore-min',
		text: 'lib/text-2.0.7',
		
		templates: '../resources/templates'
	},
	
	shim: {
		underscore: {
			exports: '_'
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