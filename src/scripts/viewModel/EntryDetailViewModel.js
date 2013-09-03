define(
	[
		'underscore',
		'viewModel/ViewModel',
		'collection/EntryCollection', 'collection/GasstationCollection', 'collection/FuelsortCollection', 'collection/LocationCollection',
		'view/EntryDetailView'
	],
	function(_, ViewModel, EntryCollection, GasstationCollection, FuelsortCollection, LocationCollection, EntryDetailView) {
		'use strict';

		var EntryDetailViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new EntryDetailView();

				this.listenTo(this.mainView, 'editentry', this.handleEditEntryButtonClick_);
				this.listenTo(this.mainView, 'deleteentry', this.handleDeleteEntryButtonClick_);
			},

			doPopulate: function(data) {
				var entry = EntryCollection.findWhere('id', data.entryId);
				var location = LocationCollection.findWhere('id', entry.locationId);
				this.mainView.populate({
					entry: entry,
					fuelsort: FuelsortCollection.findWhere('id', entry.fuelsortId),
					location: location,
					gasstation: GasstationCollection.findWhere('id', location.gasstationId)
				});
			},

			handleEditEntryButtonClick_: function(entryId) {
				window.location.href = '#entryCreator/' + entryId;
			},

			handleDeleteEntryButtonClick_: function(entryId) {
				console.info('TODO: Model zwischenspeichern zum Rückgängig machen');
				EntryCollection.remove({
					data: {
						entryId: entryId
					},
					success: this.handleDeleteEntrySuccess_,
					scope: this
				});
			},

			handleDeleteEntrySuccess_: function() {
				alert('Erfolgreich gelöscht!');
				window.location.href = '#entryList';
			}

		});

		return EntryDetailViewModel;
	}
);