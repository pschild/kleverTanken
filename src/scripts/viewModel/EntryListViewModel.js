define(
	[
		'underscore',
		'viewModel/ViewModel',
		'mixin/EventBus',
		'mixin/DatetimeMixin',
		'collection/EntryCollection', 'collection/FuelsortCollection', 'collection/GasstationCollection', 'collection/LocationCollection',
		'view/EntryListView'
	],
	function(_, ViewModel, eventBus, datetimeMixin, EntryCollection, FuelsortCollection, GasstationCollection, LocationCollection, EntryListView) {
		'use strict';

		var EntryListViewModel = ViewModel.extend({

			currentPage_: 1,

			doInitialize: function(options) {
				this.mainView = new EntryListView();

				this.listenTo(this.mainView, 'loadmore', this.handleLoadMoreButtonClick_);
				eventBus.on('undodelete', this.handleUndoEntryDelete_, this);
			},

			handleUndoEntryDelete_: function() {
				this.mainView.resetEntryList();
				this.populate();
			},

			doPopulate: function() {
				EntryCollection.sortBy(function(item) {
					return -datetimeMixin.convertDateStringToDate(item.datetime);
				});

				this.mainView.populate({
					entries: this.buildEntries_(EntryCollection.getData())
				});
			},

			handleLoadMoreButtonClick_: function() {
				var that = this;
				EntryCollection.load({
					success: function(entries) {
						that.currentPage_++;
						that.handleEntriesAdded_(entries);
					},
					page: this.currentPage_ + 1,
					scope: this
				});
			},

			handleEntriesAdded_: function(entries) {
				this.mainView.populate({
					entries: this.buildEntries_(entries)
				});
			},

			buildEntries_: function(entries) {
				var data = [];

				_.each(entries, function(entryItem) {
					var location = LocationCollection.findWhere('id', entryItem.locationId);
					data.push({
						entry: entryItem,
						fuelsort: FuelsortCollection.findWhere('id', entryItem.fuelsortId),
						location: location,
						gasstation: GasstationCollection.findWhere('id', location.gasstationId)
					});
				});

				return data;
			}

		});

		return EntryListViewModel;
	}
);