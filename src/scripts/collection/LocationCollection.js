define(
	['jquery', 'underscore', 'collection/Collection', 'Config'],
	function($, _, Collection, config) {
		'use strict';

		var LocationCollection = Collection.extend({
			load: function(options) {
				var that = this;

				var successCallback = options.success || $.noop;
				var errorCallback = options.error || $.noop;
				var scope = options.scope || this;

				$.ajax({
					url: config.baseUrl + 'location.php/location',
					type: 'GET',
					dataType: 'json',
					success: function(response) {
						that.setData(response);
						successCallback.call(scope, response);
					},
					error: function(response) {
						that.showDefaultErrorMessage_(response);
						errorCallback.call(scope, response);
					}
				});
			}
		});
		
		return new LocationCollection();
	}
);