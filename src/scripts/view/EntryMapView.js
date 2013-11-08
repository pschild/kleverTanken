define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/entryMap/entryMap.html'
	],
	function($, _, View, entryMapTemplate) {
		'use strict';

		var EntryMapView = View.extend({
			$element: $('#app-container'),

			doBind: function() {
			},

			doUnbind: function() {
			},

			doRender: function() {
				this.$element.html(
					_.template(entryMapTemplate)
				);
			}
		});
		
		return EntryMapView;
	}
);