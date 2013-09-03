define(
	['jquery', 'underscore', 'mixin/ExtendMixin'],
	function($, _, ExtendMixin) {
		'use strict';
		
		function Collection() {
			this.data_ = [];
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
			}
		});

		Collection.extend = ExtendMixin;
		
		return Collection;
	}
);