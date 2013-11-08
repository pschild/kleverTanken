define(
	[
		'underscore',
		'viewModel/ViewModel',
		'mixin/EventBus',
		'mixin/DatetimeMixin',
		'collection/EntryCollection', 'collection/FuelsortCollection', 'collection/GasstationCollection', 'collection/LocationCollection',
		'view/EntryMapView',
		'initmap'
	],
	function(_, ViewModel, eventBus, datetimeMixin, EntryCollection, FuelsortCollection, GasstationCollection, LocationCollection, EntryMapView, initmap) {
		'use strict';

		var EntryMapViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new EntryMapView();
			},

			doPopulate: function() {
				var map = $('#map').initMap(
					{
						center: 'Kleve, Germany',
						type: 'roadmap',
						options: {
							zoom: 11
						}
					}
				);

				_.each(LocationCollection.getData(), function(location) {
					var markerId = 'marker' + location.id;
					map.markers.add(
						{
							markerId: {
								position: [
									location.latitude, location.longitude
								],
								info_window: {
									content: location.street + ', ' + location.city + '<br/><b>9.99€</b>',
									maxWidth: 350,
									zIndex: 1
								}
							}
						}
					)
				});
			}

		});

		return EntryMapViewModel;
	}
);