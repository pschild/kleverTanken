define(
	[
		'underscore',
		'viewModel/ViewModel', 'viewModel/GasstationChooserViewModel',
		'mixin/DatetimeMixin',
		'collection/EntryCollection', 'collection/GasstationCollection', 'collection/LocationCollection', 'collection/FuelsortCollection',
		'view/EntryCreatorView',
		'alertify'
	],
	function(_, ViewModel, GasstationChooserViewModel, datetimeMixin, EntryCollection, GasstationCollection, LocationCollection, FuelsortCollection, EntryCreatorView, alertify) {
		'use strict';

		var EntryCreatorViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new EntryCreatorView();

				this.listenTo(this.mainView, 'saveentry', this.handleSaveEntryButtonClick_);
				this.listenTo(this.mainView, 'canceledit', this.handleCancelEditButtonClick_);
				this.listenTo(this.mainView, 'fuelsortlabelclick', this.handleFuelsortLabelClick_);
				this.listenTo(this.mainView, 'decrementprice', this.handleDecrementPriceButtonClick_);
				this.listenTo(this.mainView, 'incrementprice', this.handleIncrementPriceButtonClick_);
			},

			doPopulate: function(data) {
				this.showGasstationChooserView_();

				var entry = null;
				if (data.entryId) {
					entry = EntryCollection.findWhere('id', data.entryId);
				}

				this.mainView.populate({
					entry: entry,
					gasstationCollection: GasstationCollection,
					locationCollection: LocationCollection,
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

			validateForm_: function() {
				return parseInt($('#gasstation-chooser').val()) > 0
					&& parseInt($('#location-chooser').val()) > 0
					&& $('#datetime').val() !== ''
					&& this.getFuelsortAndPriceData_().length > 0
				;
			},

			buildEntries_: function() {
				var entries = [];
				_.each(this.getFuelsortAndPriceData_(), function(fuelsortPricePair) {
					entries.push({
						locationId: parseInt($('#location-chooser').val()),
						fuelsortId: fuelsortPricePair.fuelsortId,
						price: fuelsortPricePair.price,
						datetime: this.getDateAndTimeFromPicker_()
					});
				}, this);
				console.warn('TODO: wenn nur ein Model gespeichert werden soll (z.B. bei Update), dann nur das zurückgeben, nicht das Array');

				return entries;
			},

			getFuelsortAndPriceData_: function() {
				var fuelsortData = [];
				$('.fuelsort-price-row').each(function(index, row) {
					var $checkbox = $($(row).find('input[type=checkbox]'));
					if ($checkbox.is(':checked')) {
						var price = parseFloat($(row).find('.price').html());
						fuelsortData.push({
							fuelsortId: parseInt($checkbox.val()),
							price: price
						});
					}
				});

				return fuelsortData;
			},

			getDateAndTimeFromPicker_: function() {
				return datetimeMixin.getDateTimeForServer(
					datetimeMixin.formatGermanDatetimeToJsDate($('#datetime').val(), true),
					true
				);
			},

			handleSaveEntryButtonClick_: function(entry) {
				if (!this.validateForm_()) {
					alertify.error('<b>Da stimmt was nicht...</b><br>Bitte überprüfe deine Eingaben');
					return false;
				}

				if (entry) {
					EntryCollection.update({
						data: {
							entryId: entry.id,
							entryData: this.buildEntries_()
						},
						success: this.handleSaveEntrySuccess_,
						scope: this
					});

					return;
				}

				EntryCollection.save({
					data: this.buildEntries_(),
					success: this.handleSaveEntrySuccess_,
					scope: this
				});
			},

			handleSaveEntrySuccess_: function() {
				alertify.success('<b>(-:</b><br>Eintrag gespeichert');
				window.location.href = '#entryList';
			},

			handleCancelEditButtonClick_: function() {
				window.history.back();
			},

			handleFuelsortLabelClick_: function($checkbox) {
				$checkbox.trigger('click');
			},

			handleDecrementPriceButtonClick_: function(button) {
				var $priceContainer = $(button).parent().find('.price');
				var oldPrice = parseFloat($priceContainer.text());
				if (oldPrice <= 0) {
					return;
				}

				var newPrice = oldPrice - 0.01;
				$priceContainer.text(newPrice.toFixed(2));
				$(button).parents('.fuelsort-price-row').find('input[type=checkbox]').prop('checked', true);
			},

			handleIncrementPriceButtonClick_: function(button) {
				var $priceContainer = $(button).parent().find('.price');
				var oldPrice = parseFloat($priceContainer.text());

				var newPrice = oldPrice + 0.01;
				$priceContainer.text(newPrice.toFixed(2));
				$(button).parents('.fuelsort-price-row').find('input[type=checkbox]').prop('checked', true);
			}

		});

		return EntryCreatorViewModel;
	}
);