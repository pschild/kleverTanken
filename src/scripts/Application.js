define(
	[
		'jquery', 'underscore', 'Router',
		'viewModel/ToolbarViewModel', 'viewModel/MenuViewModel',
		'collection/EntryCollection', 'collection/GasstationCollection', 'collection/LocationCollection', 'collection/FuelsortCollection',
		'nprogress'
	],
	function($, _, Router, ToolbarViewModel, MenuViewModel, EntryCollection, GasstationCollection, LocationCollection, FuelsortCollection) {
		'use strict';
	
		function Application(options) {
			this.entryCollectionLoaded_ = false;
			this.gasstationCollectionLoaded_ = false;
			this.locationCollectionLoaded_ = false;
			this.fuelsortCollectionLoaded_ = false;

			this.initialize_(options);
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
			},
			
			loadCollections: function() {
				NProgress.configure({ showSpinner: false });
				NProgress.start();

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
				NProgress.inc(0.3);
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
				NProgress.done();

				Router.start();
				this.showToolbar_();
				this.showMenu_();
				this.showContent_();
				this.hideLoadingIndicator_();
			},

			showToolbar_: function() {
				var toolbarViewModel = new ToolbarViewModel();
				toolbarViewModel.getMainView().show();
			},

			showMenu_: function() {
				var menuViewModel = new MenuViewModel();
				menuViewModel.getMainView().show();
			},

			showContent_: function() {
				$('#app-container').show();
			},

			hideLoadingIndicator_: function() {
				console.info('TODO: loading indicator...');
			}
		});
		
		return Application;
	}
);