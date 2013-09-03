define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/imprint.html'
	],
	function($, _, View, imprintTemplate) {
		'use strict';

		var ImprintView = View.extend({
			$element: $('#app-container'),

			doRender: function() {
				this.$element.html(
					_.template(imprintTemplate)
				);
			}
		});
		
		return ImprintView;
	}
);