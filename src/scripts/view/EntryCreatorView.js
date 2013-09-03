define(
	[
		'jquery', 'underscore', 'view/View',
		'mixin/DatetimeMixin',
		'text!templates/entryCreator/entryForm.html', 'text!templates/entryCreator/fuelsortPriceRow.html'
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
				$('#gasstation-chooser').on('change', this.getGasstationChooserChangeHandler_());
				$('#save-entry-button').on('click', this.getSaveEntryButtonClickHandler_());
				$('#cancel-edit-button').on('click', this.getCancelEditButtonClickHandler_());

				$('.decrement-price-button').on('click', this.getDecrementPriceButtonClickHandler_());
				$('.increment-price-button').on('click', this.getIncrementPriceButtonClickHandler_());
				$('.fuelsort-label').on('click', this.getFuelsortLabelClickHandler_());
			},

			doUnbind: function() {
				$('#gasstation-chooser').off('change');
				$('#save-entry-button').off('click');
				$('#cancel-edit-button').off('click');

				$('.decrement-price-button').off('click');
				$('.increment-price-button').off('click');
				$('.fuelsort-label').off('click');
			},

			doPopulate: function(data) {
				this.gasstationCollection_ = data.gasstationCollection;
				this.locationCollection_ = data.locationCollection;
				this.fuelsortCollection_ = data.fuelsortCollection;

				this.populateGasstations_();
				this.populateFuelsorts_();

				$('#datetime').val(datetimeMixin.getCurrentDate() + ' ' + datetimeMixin.getCurrentTime());

				if (data.entry) {
					this.entry_ = data.entry;
					this.populateEntry_();
				}
			},

			populateLocations: function() {
				$('#location-chooser').empty();

				var locations = this.locationCollection_.findWhere('gasstationId', $('#gasstation-chooser').val(), true);
				_.each(locations, function(location) {
					var option = $('<option/>').val(location.id).text(location.street);
					$('#location-chooser').append(option);
				});
			},

			doRender: function() {
				this.$element.html(
					_.template(entryCreatorTemplate)
				);
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

				$('.price').html(this.entry_.price);
			},

			populateGasstations_: function() {
				$('#gasstation-chooser').append(
					$('<option/>').val(-1).text('bitte wählen...')
				);

				_.each(this.gasstationCollection_.getData(), function(gasstation) {
					var option = $('<option/>').val(gasstation.id).text(gasstation.name);
					$('#gasstation-chooser').append(option);
				});
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

			getGasstationChooserChangeHandler_: function() {
				var that = this;
				return function() {
					that.trigger('gasstationchooserchange', this.value);
				};
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