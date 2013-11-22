define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/menu/desktopMenu.html'
	],
	function ($, _, View, desktopMenuTemplate) {
		'use strict';

		var DesktopMenuView = View.extend({

			doBind: function () {
			},

			doUnbind: function () {
			},

			doRender: function () {
				this.$element.html(
					_.template(desktopMenuTemplate)
				);
			}
		});

		return DesktopMenuView;
	}
);