define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/menu.html'
	],
	function($, _, View, menuTemplate) {
		'use strict';

		var MenuView = View.extend({
			$element: $('#menu-container'),

			doBind: function() {
				$('.menu-toggle').fastClick(this.getToggleMenuClickHandler_());
				$('.menu-mask').fastClick(this.getMenuMaskClickHandler_());
				$('#menu a').fastClick(this.getMenuItemClickHandler_());
			},

			doUnbind: function() {
				$('.menu-toggle').unbind();
				$('#menu a').unbind();
			},

			doRender: function() {
				this.$element.html(
					_.template(menuTemplate)
				);
			},

			getToggleMenuClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('menutoggle');
				}
			},

			getMenuMaskClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('menumaskclick');
				}
			},

			getMenuItemClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('menuitemclick');
				}
			}
		});
		
		return MenuView;
	}
);