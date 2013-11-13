define(
	[
		'underscore',
		'viewModel/ViewModel',
		'mixin/EventBus',
		'mixin/DatetimeMixin',
		'Config',
		'collection/EntryCollection', 'collection/FuelsortCollection', 'collection/GasstationCollection', 'collection/LocationCollection',
		'view/EntryMapView',
		'initmap'
	],
	function(_, ViewModel, eventBus, datetimeMixin, config, EntryCollection, FuelsortCollection, GasstationCollection, LocationCollection, EntryMapView, initmap) {
		'use strict';

		var EntryMapViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new EntryMapView();
			},

			doPopulate: function() {
				var that = this;
				$.ajax({
					url: config.baseUrl + 'entry.php/latestEntries',
					type: 'GET',
					dataType: 'json',
					success: function(response) {
						that.initMap(response);
					},
					error: function(response) {
						console.error(response);
					}
				});
			},

			initMap: function(entries) {
				var that = this;

				$('#map').height($(window).height() - $('#toolbar-container').height() - 20);
				var map = $('#map').initMap({
					center: 'Kleve, Germany',
					type: 'roadmap',
					options: {
						zoom: 11
					}
				});

				var groupedEntries = _.groupBy(entries, function(entry) {
					return entry.locationId;
				});

				_.each(groupedEntries, function(locationObj, locationId) {
					var location = LocationCollection.findWhere('id', locationId);
					var gasstation = GasstationCollection.findWhere('id', location.gasstationId);

					var markerData = {
						location: location,
						gasstation: gasstation,
						fuelsorts: []
					};

					_.each(locationObj, function(fuelsortObj) {
						var fuelsortId = fuelsortObj.fuelsortId;

						markerData.fuelsorts.push({
							name: FuelsortCollection.findWhere('id', fuelsortId).name,
							elapsedTime: datetimeMixin.mapElapsedTime(fuelsortObj.datetime),
							price: fuelsortObj.price
						});
					});

					that.mainView.renderMarker(map, markerData);
				});
			}

		});

		return EntryMapViewModel;
	}
);