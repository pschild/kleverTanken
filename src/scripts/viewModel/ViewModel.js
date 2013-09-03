define(
	['underscore', 'mixin/EventsMixin', 'mixin/ExtendMixin'],
	function(_, EventsMixin, ExtendMixin) {
		'use strict';

		function ViewModel(options) {
			this.initialize_(options);
		}

		_.extend(ViewModel.prototype, EventsMixin, {

			mainView: undefined,

			initialize_: function(options) {
				this.doInitialize(options);
				if (!this.mainView) {
					throw new Error('mainView is not set.');
				}
			},

			/* overwrite this in your specific ViewModel */
			doInitialize: function(options) {
				this.mainView = undefined;
			},

			populate: function(data) {
				this.doPopulate(data);
			},

			/* overwrite this in your specific ViewModel */
			doPopulate: function(data) {
			},

			destroy: function() {
				this.mainView.destroy();
				this.doDestroy();
			},

			/* overwrite this in your specific ViewModel */
			doDestroy: function() {
			},

			getMainView: function() {
				return this.mainView;
			}
		});

		ViewModel.extend = ExtendMixin;

		return ViewModel;
	}
);