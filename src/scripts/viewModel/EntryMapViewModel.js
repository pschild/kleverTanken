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

					var infoHtml = gasstation.name + ', ' + location.street + ', ' + location.city + '<br/><br/>';
					_.each(locationObj, function(fuelsortObj) {
						var fuelsortId = fuelsortObj.fuelsortId;
						var fuelsortName = FuelsortCollection.findWhere('id', fuelsortId).name;
						var elapsedTime = datetimeMixin.mapElapsedTime(fuelsortObj.datetime);

						infoHtml += fuelsortName + ': ' + fuelsortObj.price + '<sup>9</sup> (' + elapsedTime + ')<br/>';
					});
					
					map.markers.add({
						myGasstation: {
							position: [
								location.latitude, location.longitude
							],
							info_window: {
								content: infoHtml,
								maxWidth: 350,
								zIndex: 1
							}
						}
					});
				});
			}

		});

		return EntryMapViewModel;
	}
);