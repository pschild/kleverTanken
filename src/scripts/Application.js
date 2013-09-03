define(
	[
		'jquery', 'underscore', 'Router',
		'viewModel/ToolbarViewModel', 'viewModel/MenuViewModel',
		'collection/EntryCollection', 'collection/GasstationCollection', 'collection/LocationCollection', 'collection/FuelsortCollection'
	],
	function($, _, Router, ToolbarViewModel, MenuViewModel, EntryCollection, GasstationCollection, LocationCollection, FuelsortCollection) {
		'use strict';
	
		function Application(options) {
			this.initialize_(options);
			this.entryCollectionLoaded_ = false;
			this.gasstationCollectionLoaded_ = false;
			this.locationCollectionLoaded_ = false;
			this.fuelsortCollectionLoaded_ = false;
		}
		
		_.extend(Application.prototype, {
			initialize_: function(options) {
				_.bindAll(
					this,
					'handleGasstationCollectionLoaded_',
					'handleLocationCollectionLoaded_',
					'handleFuelsortCollectionLoaded_',
					'handleEntryCollectionLoaded_'
				);
			},

			bootstrap: function() {
				this.loadCollections();
				this.showToolbar();
				this.shoMenu();
			},

			showToolbar: function() {
				var toolbarViewModel = new ToolbarViewModel();
				toolbarViewModel.getMainView().show();
			},

			shoMenu: function() {
				var menuViewModel = new MenuViewModel();
				menuViewModel.getMainView().show();
			},
			
			loadCollections: function() {
				EntryCollection.load({
					success: this.handleEntryCollectionLoaded_,
					scope: this
				});

				GasstationCollection.load({
					success: this.handleGasstationCollectionLoaded_,
					scope: this
				});

				LocationCollection.load({
					success: this.handleLocationCollectionLoaded_,
					scope: this
				});

				FuelsortCollection.load({
					success: this.handleFuelsortCollectionLoaded_,
					scope: this
				});
			},

			handleEntryCollectionLoaded_: function() {
				this.entryCollectionLoaded_ = true;
				this.checkCollectionsLoaded_();
			},

			handleGasstationCollectionLoaded_: function() {
				this.gasstationCollectionLoaded_ = true;
				this.checkCollectionsLoaded_();
			},

			handleLocationCollectionLoaded_: function() {
				this.locationCollectionLoaded_ = true;
				this.checkCollectionsLoaded_();
			},

			handleFuelsortCollectionLoaded_: function() {
				this.fuelsortCollectionLoaded_ = true;
				this.checkCollectionsLoaded_();
			},

			checkCollectionsLoaded_: function() {
				if (
					this.gasstationCollectionLoaded_
					&& this.entryCollectionLoaded_
					&& this.fuelsortCollectionLoaded_
					&& this.locationCollectionLoaded_
				) {
					this.launchApplication();
				}
			},

			launchApplication: function() {
				Router.start();
			}
		});
		
		return Application;
	}
);