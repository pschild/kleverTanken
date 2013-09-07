define(
	[
		'underscore',
		'viewModel/ViewModel',
		'Config', 'mixin/DatetimeMixin',
		'collection/FuelsortCollection',
		'view/StatisticView'
	],
	function(_, ViewModel, config, datetimeMixin, FuelsortCollection, StatisticView) {
		'use strict';

		var StatisticViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new StatisticView();

				this.listenTo(this.mainView, 'loadstatistics', this.handleLoadStatisticsButtonClick_);
			},

			doPopulate: function() {
				this.mainView.populate({
					fuelsortCollection: FuelsortCollection
				});
			},

			handleLoadStatisticsButtonClick_: function() {
				var fuelsortId = $('#fuelsort-chooser').val();
				var gasstationId = $('#location-chooser').val() || -1; // TODO

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
						'fuelsortId': parseInt(fuelsortId),
						'gasstationId': parseInt(gasstationId),
						'fromDate': fromDate,
						'toDate': toDate
					},
					success: function(r) {
						console.log('success', r);
					},
					error: function() {
						alert('Ups...beim Laden der Statistiken ist wohl etwas schief gelaufen :-(');
					}
				});
			}

		});

		return StatisticViewModel;
	}
);