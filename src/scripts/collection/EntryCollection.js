define(
	['jquery', 'underscore', 'collection/Collection', 'Config'],
	function($, _, Collection, config) {
		'use strict';

		var EntriesCollection = Collection.extend({
			addData: function(models) {
				Collection.prototype.addData.call(this, models);

				this.sortBy(function(item) {
					return -new Date(item.datetime);
				});
			},

			load: function(options) {
				var that = this;

				var successCallback = options.success || $.noop;
				var errorCallback = options.error || $.noop;
				var scope = options.scope || this;
				var page = options.page || 1;

				$.ajax({
					url: config.baseUrl + 'entry.php/entry',
					data: {
						entriesPerPage: config.entriesPerPage,
						page: page
					},
					type: 'GET',
					dataType: 'json',
					success: function(response) {
						that.addData(response);
						successCallback.call(scope, response);
					},
					error: function(response) {
						console.error('Collection could not be loaded: ', response);
						errorCallback.call(scope, response);
					}
				});
			},

			save: function(options) {
				var that = this;

				var successCallback = options.success || $.noop;
				var errorCallback = options.error || $.noop;
				var scope = options.scope || this;
				var models = options.data || {};

				$.ajax({
					url: 'data/php/entry.php/entry',
					data: JSON.stringify(models),
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json',
					success: function(response) {
						that.addData(response);
						successCallback.call(scope, response);
					},
					error: function(response) {
						console.error('Data could not be saved: ', response);
						errorCallback.call(scope, response);
					}
				});
			},

			update: function(options) {
				var successCallback = options.success || $.noop;
				var errorCallback = options.error || $.noop;
				var scope = options.scope || this;
				var model = options.data || {};

				$.ajax({
					url: 'data/php/entry.php/entry/' + model.id,
					data: JSON.stringify(model),
					type: 'PUT',
					dataType: 'json',
					contentType: 'application/json',
					success: function(response) {
						successCallback.call(scope, response);
					},
					error: function(response) {
						console.error('Data could not be updated: ', response);
						errorCallback.call(scope, response);
					}
				});
			},

			remove: function(options) {
				var that = this;

				var successCallback = options.success || $.noop;
				var errorCallback = options.error || $.noop;
				var scope = options.scope || this;
				var data = options.data || {};

				$.ajax({
					url: 'data/php/entry.php/entry/' + data.entryId,
					type: 'DELETE',
					dataType: 'json',
					contentType: 'application/json',
					success: function(response) {
						that.data_ = _.reject(that.data_, function(item) {
							return item.id == data.entryId;
						});
						successCallback.call(scope, response);
					},
					error: function(response) {
						console.error('Data could not be deleted: ', response);
						errorCallback.call(scope, response);
					}
				});
			}
		});
		
		return new EntriesCollection();
	}
);