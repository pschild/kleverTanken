define(
	[
		'underscore',
		'viewModel/ViewModel', 'viewModel/GasstationChooserViewModel',
		'Config', 'mixin/DatetimeMixin',
		'collection/FuelsortCollection', 'collection/GasstationCollection', 'collection/LocationCollection',
		'view/StatisticView',
		'alertify'
	],
	function(_, ViewModel, GasstationChooserViewModel, config, datetimeMixin, FuelsortCollection, GasstationCollection, LocationCollection, StatisticView, alertify) {
		'use strict';

		var StatisticViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new StatisticView();

				this.listenTo(this.mainView, 'loadstatistics', this.handleLoadStatisticsButtonClick_);
			},

			doPopulate: function() {
				this.showGasstationChooserView_();

				this.mainView.populate({
					fuelsortCollection: FuelsortCollection
				});
			},

			showGasstationChooserView_: function() {
				var gasstationChooserViewModel = new GasstationChooserViewModel({
					element: $('#gasstation-chooser-view-container')
				});
				gasstationChooserViewModel.getMainView().show();
				gasstationChooserViewModel.populate();
			},

			handleLoadStatisticsButtonClick_: function() {
				var fuelsortId = $('#fuelsort-chooser').val();
				var locationId = $('#location-chooser').val() || -1;

				var fromDate = datetimeMixin.getDateTimeForServer(
					datetimeMixin.formatGermanDatetimeToJsDate($('#from-date').val(), false),
					false
				);

				var toDate = datetimeMixin.getDateTimeForServer(
					datetimeMixin.formatGermanDatetimeToJsDate($('#to-date').val(), false),
					false
				);

				$.ajax({
					url: config.baseUrl + 'statistics.php/statistic',
					data: {
						fuelsortId: parseInt(fuelsortId),
						locationId: parseInt(locationId),
						fromDate: fromDate,
						toDate: toDate
					},
					type: 'GET',
					dataType: 'json',
					success:_.bind(this.loadStatisticResultsSuccess_, this),
					error: function() {
						alertify.error('Ups...beim Laden der Statistiken ist wohl etwas schief gelaufen :-(');
					}
				});
			},

			loadStatisticResultsSuccess_: function(data) {
				if (data.locationData) {
					var cheapestLocation = LocationCollection.findWhere('id', data.locationData.cheapestLocationId);
					data.locationData.cheapestLocation = {
						gasstation: GasstationCollection.findWhere('id', cheapestLocation.gasstationId),
						location: cheapestLocation
					};

					var mostExpensiveLocation = LocationCollection.findWhere('id', data.locationData.mostExpensiveLocationId);
					data.locationData.mostExpensiveLocation = {
						gasstation: GasstationCollection.findWhere('id', mostExpensiveLocation.gasstationId),
						location: mostExpensiveLocation
					};
				}

				this.mainView.renderStatisticResults(data);
				this.mainView.renderChart(data.priceDevelopmentData);
			}

		});

		return StatisticViewModel;
	}
);