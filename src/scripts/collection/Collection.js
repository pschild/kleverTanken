define(
	['jquery', 'underscore', 'mixin/ExtendMixin', 'alertify'],
	function($, _, ExtendMixin, alertify) {
		'use strict';
		
		function Collection() {
			this.data_ = [];
			this.cachedModel_ = null;
		}

		_.extend(Collection.prototype, {
			load: function(options) {
			},

			save: function(options) {
			},

			update: function(options) {
			},

			remove: function(options) {
			},

			setData: function(models) {
				if (models.length && models.length === 1) {
					models = [models];
				}
				this.data_ = models;
			},

			addData: function(models) {
				var that = this;
				_.each(models, function(model) {
					that.data_.push(model);
				});
			},

			getData: function() {
				return this.data_;
			},

			setCachedModel: function(model) {
				this.cachedModel_ = model;
			},

			getCachedModel: function() {
				return this.cachedModel_;
			},

			updateWhere: function(searchKey, data) {
				var model = this.findWhere('id', searchKey);
				if (model) {
					_.extend(model, data);
					return model;
				}
			},

			findWhere: function(searchKey, searchValue, findAll) {
				if (!this.getData() || this.getData().length === 0) {
					return undefined;
				}

				var results = [];
				_.each(this.getData(), function(model) {
					_.each(model, function(value, property) {
						if (property === searchKey && value == searchValue) {
							results.push(model);
						}
					});
				});

				if (!findAll) {
					return results[0];
				}

				return results;
			},

			sortBy: function(sortFn) {
				this.data_ = _.sortBy(
					this.data_,
					sortFn
				);
			},

			showDefaultErrorMessage_: function(response) {
				alertify.error('<b>[' + response.status + ' ' + response.statusText + ']</b> Uuups...da ist was schief gelaufen. Bitte versuche es erneut.');
			}
		});

		Collection.extend = ExtendMixin;
		
		return Collection;
	}
);