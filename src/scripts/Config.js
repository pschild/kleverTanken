define(
	[],
	function() {
		'use strict';
		
		function Config() {

		}

		_.extend(Config.prototype, {
			/**
			 * Base URL for collections.
			 */
			baseUrl: 'data/php/',

			/**
			 * Determines how many entries will be loaded per page.
			 */
			entriesPerPage: 10
		});
		
		return new Config();
	}
);