define(
	[
		'jquery', 'underscore', 'view/View',
		'mixin/DatetimeMixin',
		'text!templates/statistic/statistic.html'
	],
	function($, _, View, datetimeMixin, statisticTemplate) {
		'use strict';

		var StatisticView = View.extend({
			$element: $('#app-container'),

			doBind: function() {
				$('#load-statistics-button').fastClick(this.getLoadStatisticsButtonClickHandler_());
			},

			doUnbind: function() {
				$('#load-statistics-button').unbind();
			},

			doPopulate: function(data) {
				this.fuelsortCollection_ = data.fuelsortCollection;
				this.populateFuelsorts_();
			},

			populateFuelsorts_: function() {
				$('#fuelsort-chooser').append(
					$('<option/>').val(-1).text('bitte wählen...')
				);

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
			}
		});
		
		return StatisticView;
	}
);