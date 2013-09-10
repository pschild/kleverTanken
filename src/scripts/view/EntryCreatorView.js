define(
	[
		'jquery', 'underscore', 'view/View',
		'mixin/DatetimeMixin',
		'text!templates/entryCreator/entryForm.html', 'text!templates/entryCreator/fuelsortPriceRow.html',
		'mobiscroll.core', 'mobiscroll.datetime', 'mobiscroll.i18n.de'
	],
	function($, _, View, datetimeMixin, entryCreatorTemplate, fuelsortPriceRowTemplate) {
		'use strict';

		var EntryCreatorView = View.extend({
			$element: $('#app-container'),

			entry_: null,

			gasstationCollection_: null,

			locationCollection_: null,

			fuelsortCollection_: null,

			doBind: function() {
				$('#save-entry-button').fastClick(this.getSaveEntryButtonClickHandler_());
				$('#cancel-edit-button').fastClick(this.getCancelEditButtonClickHandler_());

				$('.decrement-price-button').fastClick(this.getDecrementPriceButtonClickHandler_());
				$('.increment-price-button').fastClick(this.getIncrementPriceButtonClickHandler_());
				$('.fuelsort-label').fastClick(this.getFuelsortLabelClickHandler_());
			},

			doUnbind: function() {
				$('#save-entry-button').unbind();
				$('#cancel-edit-button').unbind();

				$('.decrement-price-button').unbind();
				$('.increment-price-button').unbind();
				$('.fuelsort-label').unbind();
			},

			doPopulate: function(data) {
				this.gasstationCollection_ = data.gasstationCollection;
				this.locationCollection_ = data.locationCollection;
				this.fuelsortCollection_ = data.fuelsortCollection;

				this.populateFuelsorts_();

				$('#datetime').val(datetimeMixin.getCurrentDate() + ' ' + datetimeMixin.getCurrentTime());

				if (data.entry) {
					this.entry_ = data.entry;
					this.populateEntry_();
				}
			},

			doRender: function() {
				this.$element.html(
					_.template(entryCreatorTemplate)
				);

				this.initDatetimePicker_();
			},

			populateEntry_: function() {
				var that = this;
				var location = this.locationCollection_.findWhere('id', this.entry_.locationId);

				$('#gasstation-chooser').val(
					this.gasstationCollection_.findWhere('id', location.gasstationId).id
				).change();
				$('#location-chooser').val(location.id);
				$('#datetime').val(datetimeMixin.formatServerDateToGermanDate(this.entry_.datetime, true));

				_.each($('.checkbox-container input[type=checkbox]'), function(fuelsortCheckbox) {
					var $checkboxElement = $(fuelsortCheckbox);
					if ($checkboxElement.val() == that.entry_.fuelsortId) {
						$checkboxElement.prop('checked', true);
					} else {
						$checkboxElement.parents('.fuelsort-price-row').hide();
					}
				});

				$('.price').html(this.entry_.price.toFixed(2));
			},

			populateFuelsorts_: function() {
				_.each(this.fuelsortCollection_.getData(), function(fuelsort) {
					$('.fuelsort-price-container').append(
						_.template(
							fuelsortPriceRowTemplate,
							fuelsort
						)
					);
				});

				/* Workaround: unbind and bind again, because at the beginning the increment und decrement buttons are not available */
				this.doUnbind();
				this.doBind();
			},

			initDatetimePicker_: function() {
				/* workaround mobiscroll: makes the datetime-field loose the focus whenever it is clicked */
				$('#datetime').focus(function() {
					$('#datetime').blur();
				});

				$('#datetime').mobiscroll().datetime({
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

			getSaveEntryButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('saveentry', that.entry_);
				}
			},

			getCancelEditButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('canceledit');
				}
			},

			getFuelsortLabelClickHandler_: function() {
				var that = this;
				return function() {
					var $checkbox = $(this).parent().find('input[type=checkbox]');
					that.trigger('fuelsortlabelclick', $checkbox);
				}
			},

			getDecrementPriceButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('decrementprice', this);
				}
			},

			getIncrementPriceButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('incrementprice', this);
				}
			}
		});
		
		return EntryCreatorView;
	}
);