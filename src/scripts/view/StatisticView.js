define(
	[
		'jquery', 'underscore', 'view/View',
		'mixin/DatetimeMixin',
		'chartJs',
		'text!templates/statistic/statistic.html', 'text!templates/statistic/statisticResults.html'
	],
	function($, _, View, datetimeMixin, chartJs, statisticTemplate, statisticResultsTemplate) {
		'use strict';

		var StatisticView = View.extend({
			$element: $('#app-container'),

			doBind: function() {
				$('#load-statistics-button').click(this.getLoadStatisticsButtonClickHandler_());
				$('.shortcut-button').click(this.getShortcutButtonClickHandler_());
			},

			doUnbind: function() {
				$('#load-statistics-button').unbind();
				$('#shortcut-today-button').unbind();
			},

			doPopulate: function(data) {
				this.fuelsortCollection_ = data.fuelsortCollection;
				this.populateFuelsorts_();
			},

			renderStatisticResults: function(data) {
				$('.statistic-results').hide().html(
					_.template(
						statisticResultsTemplate,
						data
					)
				);

				if (!data.locationData) {
					$('.location-statistic-container').hide();
				} else {
					$('.location-statistic-container').show();
				}

				$('.statistic-results').fadeIn();
			},

			renderChart: function(data) {
				if (!data || data.values.length < 2) {
					$('.statistic-chart').hide();
					return;
				}

				var labels = [];
				var prices = [];
				var avgPrices = [];
				_.each(data.values, _.bind(function(entry) {
					labels.push(datetimeMixin.formatServerDateToGermanDate(entry.datetime));
					prices.push(parseFloat(entry.price).toFixed(2));
					avgPrices.push(parseFloat(data.avgOverall).toFixed(2));
				}, this));

				var chartWidth = 400;
				if (labels.length > 10) {
					chartWidth = 400 + labels.length * 10;
					for (var i = 0; i < labels.length; i++) {
						if (
							i > 0
								&& i !== labels.length - 1
								&& i !== Math.floor(labels.length / 2)
							) {
							labels[i] = '';
						}
					}
				}

				var lineChartData = {
					labels: labels,
					datasets: [
						{
							fillColor: 'rgba(37, 142, 205, 0.5)',
							strokeColor: 'rgba(37, 142, 205, 0.9)',
							data: prices
						},
						{
							fillColor: 'rgba(0, 0, 0, 0.2)',
							strokeColor: 'rgba(0, 0, 0, 0.0)',
							data: avgPrices
						}
					]
				};

				var minPrice = parseFloat(_.min(prices));
				var maxPrice = parseFloat(_.max(prices));
				var diff = (maxPrice + 0.05) - (minPrice - 0.05);
				var steps = (diff / 0.05);

				var options = {
					scaleOverride: true,
					scaleSteps: steps,
					scaleStepWidth: 0.05,
					scaleStartValue: minPrice - 0.05,
					pointDot: false,
					animation: false
				};

				var chart = $('<canvas/>').attr('id', 'chart').attr('width', chartWidth).attr('height', 300);
				$('.statistic-chart').empty().append(chart);
				new Chart(document.getElementById('chart').getContext('2d')).Line(lineChartData, options);
				$('.statistic-chart').css('display', 'block');
			},

			populateFuelsorts_: function() {
				_.each(this.fuelsortCollection_.getData(), function(fuelsort) {
					var option = $('<option/>').val(fuelsort.id).text(fuelsort.name);
					$('#fuelsort-chooser').append(option);
				});
			},

			doRender: function() {
				this.$element.html(
					_.template(statisticTemplate)
				);

				this.initDatetimePicker_();
				this.setCurrentDateAndTime_();
			},

			setCurrentDateAndTime_: function() {
				var fromDate = new Date(new Date() - 1000 * 60 * 60 * 24 * 14);
				$('#from-date').val(datetimeMixin.getDateAsString(fromDate));
				$('#to-date').val(datetimeMixin.getCurrentDate());
			},

			initDatetimePicker_: function() {
				/* makes the datetime-field loose the focus whenever it is clicked. That's a fix for mobiscroll... */
				$('#from-date').focus(function() {
					$('#from-date').blur();
				});

				$('#from-date').mobiscroll().date({
					showNow: true,
					maxDate: new Date(),
					startYear: new Date().getFullYear() - 2,
					theme: 'android-ics light',
					lang: 'de',
					display: 'modal',
					animate: 'pop',
					mode: 'scroller'
				});

				/* makes the datetime-field loose the focus whenever it is clicked. That's a fix for mobiscroll... */
				$('#to-date').focus(function() {
					$('#to-date').blur();
				});

				$('#to-date').mobiscroll().date({
					showNow: true,
					maxDate: new Date(),
					startYear: new Date().getFullYear() - 2,
					theme: 'android-ics light',
					lang: 'de',
					display: 'modal',
					animate: 'pop',
					mode: 'scroller'
				});
			},

			getLoadStatisticsButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('loadstatistics');
				}
			},

			getShortcutButtonClickHandler_: function() {
				var that = this;
				return function(event) {
					var shortcutValue = event.currentTarget.value;
					that.trigger('shortcut', shortcutValue);
				}
			}
		});
		
		return StatisticView;
	}
);