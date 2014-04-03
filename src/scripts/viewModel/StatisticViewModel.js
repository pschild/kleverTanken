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
				this.listenTo(this.mainView, 'shortcut', this.handleShortcutButtonClick_);
			},

			doPopulate: function() {
				this.showGasstationChooserView_();

				this.mainView.populate({
					fuelsortCollection: FuelsortCollection
				});
			},

			showGasstationChooserView_: function() {
				var gasstationChooserViewModel = new GasstationChooserViewModel({
					element: $('#gasstation-chooser-view-container'),
					emptyLabelText: 'alle'
				});
				gasstationChooserViewModel.getMainView().show();
				gasstationChooserViewModel.populate();
			},

			handleShortcutButtonClick_: function(shortcutValue) {
				var fromDate;
				var today = new Date();

				switch (shortcutValue) {
					case 'today':
						fromDate = new Date();
						break;
					case 'week':
						fromDate = datetimeMixin.getMondayOfCurrentWeek();
						break;
					case 'month':
						fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
						break;
					case 'year':
						fromDate = new Date(today.getFullYear(), 0, 1);
						break;
					default:
						console.error('No Shortcut-Value was given.');
						break;
				}

				$('#from-date').val(datetimeMixin.getDateAsString(fromDate));
				$('#to-date').val(datetimeMixin.getDateAsString(today));
			},

			handleLoadStatisticsButtonClick_: function() {
				$('#load-statistics-button').attr('disabled', 'disabled');
				$('.statistic-results').hide();
				$('.loading-spinner').show();

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
				if (data.locationData && data.locationData.cheapestLocationId) {
					var cheapestLocation = LocationCollection.findWhere('id', data.locationData.cheapestLocationId);
					data.locationData.cheapestLocation = {
						gasstation: GasstationCollection.findWhere('id', cheapestLocation.gasstationId),
						location: cheapestLocation
					};
				}

				if (data.locationData && data.locationData.mostExpensiveLocationId) {
					var mostExpensiveLocation = LocationCollection.findWhere('id', data.locationData.mostExpensiveLocationId);
					data.locationData.mostExpensiveLocation = {
						gasstation: GasstationCollection.findWhere('id', mostExpensiveLocation.gasstationId),
						location: mostExpensiveLocation
					};
				}

				this.mainView.renderStatisticResults(data);
				this.mainView.renderChart(data.priceDevelopmentData);

				$('#load-statistics-button').removeAttr('disabled');
				$('.loading-spinner').hide();
			}

		});

		return StatisticViewModel;
	}
);