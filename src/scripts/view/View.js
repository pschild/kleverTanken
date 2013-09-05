define(
	['jquery', 'underscore', 'mixin/ExtendMixin', 'mixin/EventsMixin'],
	function($, _, ExtendMixin, EventsMixin) {
		'use strict';

		function View(options) {
			this.initialize_(options);
		}

		_.extend(View.prototype, EventsMixin, {
			$element: undefined,

			initialize_: function(options) {
				this.doInitialize(options);
			},

			/* overwrite this in your specific View */
			doInitialize: function(options) {
			},

			render: function() {
				this.doRender();
			},

			/* overwrite this in your specific View */
			doRender: function() {
			},

			bind: function() {
				this.doBind();
			},

			/* overwrite this in your specific View */
			doBind: function() {
			},

			show: function() {
				/*
				this.$element.fadeOut();
				this.render();
				this.$element.fadeIn();
				*/
				console.info('TODO: hier könnte man noch animationen einbauen (s.o.)');
				this.render();
				this.bind();
			},

			populate: function(data) {
				this.doPopulate(data || {});
			},

			/* overwrite this in your specific View */
			doPopulate: function(data) {
			},

			destroy: function() {
				this.unbind();
				this.reset();
				this.doDestroy();
			},

			/* overwrite this in your specific View */
			doDestroy: function() {
			},

			reset: function() {
				this.doReset();
			},

			/* overwrite this in your specific View */
			doReset: function() {
			},

			unbind: function() {
				this.doUnbind();
			},

			/* overwrite this in your specific View */
			doUnbind: function() {
			}
		});

		View.extend = ExtendMixin;
		
		return View;
	}
);