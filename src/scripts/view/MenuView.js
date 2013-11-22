define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/menu/menu.html'
	],
	function($, _, View, menuTemplate) {
		'use strict';

		var MenuView = View.extend({
			$element: $('#menu-container'),

			doBind: function() {
				$('.menu-toggle').on('click', this.getToggleMenuClickHandler_());
				$('#menu a').on('click', this.getMenuItemClickHandler_());
				$('#menu-mask').on('click', this.getMenuMasklickHandler_());
			},

			doUnbind: function() {
				$('.menu-toggle').off('click');
				$('#menu a').off('click');
				$('#menu-mask').off('click');
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

			getMenuItemClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('menuitemclick');
				}
			},

			getMenuMasklickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('menumaskclick');
				}
			}
		});
		
		return MenuView;
	}
);