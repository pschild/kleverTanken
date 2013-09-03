define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/toolbar.html'
	],
	function($, _, View, toolbarTemplate) {
		'use strict';

		var ToolbarView = View.extend({
			$element: $('#toolbar-container'),

			doRender: function() {
				this.$element.html(
					_.template(toolbarTemplate)
				);
			}
		});
		
		return ToolbarView;
	}
);