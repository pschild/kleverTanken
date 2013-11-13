define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/entryMap/entryMap.html', 'text!templates/entryMap/infoWindow.html'
	],
	function($, _, View, entryMapTemplate, infoWindowTemplate) {
		'use strict';

		var EntryMapView = View.extend({
			$element: $('#app-container'),

			doBind: function() {
			},

			doUnbind: function() {
			},

			renderMarker: function(map, markerData) {
				map.markers.add({
					myGasstation: {
						position: [
							markerData.location.latitude, markerData.location.longitude
						],
						options: {
							title: markerData.gasstation.name
						},
						info_window: {
							content: _.template(
								infoWindowTemplate,
								markerData
							),
							maxWidth: 350,
							zIndex: 1
						}
					}
				});
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