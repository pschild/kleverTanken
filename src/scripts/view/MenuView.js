define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/menu.html'
	],
	function($, _, View, menuTemplate) {
		'use strict';

		var MenuView = View.extend({
			$element: $('#menu-container'),

			doRender: function() {
				this.$element.html(
					_.template(menuTemplate)
				);
			}
		});
		
		return MenuView;
	}
);