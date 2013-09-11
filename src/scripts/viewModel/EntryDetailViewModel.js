define(
	[
		'underscore',
		'viewModel/ViewModel',
		'mixin/EventBus',
		'collection/EntryCollection', 'collection/GasstationCollection', 'collection/FuelsortCollection', 'collection/LocationCollection',
		'view/EntryDetailView',
		'alertify'
	],
	function(_, ViewModel, eventBus, EntryCollection, GasstationCollection, FuelsortCollection, LocationCollection, EntryDetailView, alertify) {
		'use strict';

		var EntryDetailViewModel = ViewModel.extend({

			entryId_: undefined,

			doInitialize: function(options) {
				this.mainView = new EntryDetailView();

				this.listenTo(this.mainView, 'editentry', this.handleEditEntryButtonClick_);
				this.listenTo(this.mainView, 'deleteentry', this.handleDeleteEntryButtonClick_);
			},

			doPopulate: function(data) {
				this.entryId_ = data.entryId;

				var entry = EntryCollection.findWhere('id', data.entryId);
				if (!entry) {
					alertify.error('Ein Eintrag zu der ID ' + data.entryId + ' konnte leider nicht gefunden werden.');
					window.location.href = '#entryList';
					return;
				}

				var location = LocationCollection.findWhere('id', entry.locationId);
				this.mainView.populate({
					entry: entry,
					fuelsort: FuelsortCollection.findWhere('id', entry.fuelsortId),
					location: location,
					gasstation: GasstationCollection.findWhere('id', location.gasstationId)
				});
			},

			handleEditEntryButtonClick_: function() {
				window.location.href = '#entryCreator/' + this.entryId_;
			},

			handleDeleteEntryButtonClick_: function() {
				EntryCollection.setCachedModel(
					EntryCollection.findWhere('id', this.entryId_)
				);

				EntryCollection.remove({
					data: {
						entryId: this.entryId_
					},
					success: this.handleDeleteEntrySuccess_,
					scope: this
				});
			},

			handleDeleteEntrySuccess_: function() {
				alertify.success('Eintrag gelöscht<br><a id="undo-delete-button" href="#">Rückgängig machen</a>');
				$('#undo-delete-button').on('click', _.bind(this.handleUndoDeleteButtonClick_, this));

				window.location.href = '#entryList';
			},

			handleUndoDeleteButtonClick_: function(event) {
				event.preventDefault();

				var cachedModel = EntryCollection.getCachedModel();
				if (!cachedModel) {
					console.error('Could not find a cached model.');
					return;
				}

				console.warn('TODO: entryData: [cachedModel] nix gut...');
				EntryCollection.update({
					data: {
						entryId: cachedModel.id,
						entryData: [cachedModel]
					},
					success: this.handleUndoDeleteSuccess_,
					scope: this
				});
			},

			handleUndoDeleteSuccess_: function() {
				EntryCollection.setCachedModel(null);
				eventBus.trigger('undodelete');
			}

		});

		return EntryDetailViewModel;
	}
);