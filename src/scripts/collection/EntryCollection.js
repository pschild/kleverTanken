define(
	['jquery', 'underscore', 'collection/Collection', 'mixin/DatetimeMixin', 'Config'],
	function($, _, Collection, datetimeMixin, config) {
		'use strict';

		var EntriesCollection = Collection.extend({
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

				var entryId = options.data.entryId;
				if (!entryId) {
					console.error('No entryId given.');
					return;
				}
				console.warn('TODO: entryData[0] nix gut...');
				var newModel = options.data.entryData[0] || {};

				var that = this;
				$.ajax({
					url: 'data/php/entry.php/entry/' + entryId,
					data: JSON.stringify(newModel),
					type: 'PUT',
					dataType: 'json',
					contentType: 'application/json',
					success: function(response) {
						if (!that.findWhere('id', entryId)) {
							console.warn('TODO: that.addData([newModel]); nix gut...');
							that.addData([newModel]);
						} else {
							that.updateWhere(entryId, newModel);
						}

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