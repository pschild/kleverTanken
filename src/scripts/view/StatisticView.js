define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/statistic.html'
	],
	function($, _, View, statisticTemplate) {
		'use strict';

		var StatisticView = View.extend({
			$element: $('#app-container'),

			doRender: function() {
				this.$element.html(
					_.template(statisticTemplate)
				);
			}
		});
		
		return StatisticView;
	}
);