define(
	[
		'jquery', 'underscore', 'Router',
		'viewModel/ToolbarViewModel', 'viewModel/MenuViewModel', 'viewModel/DesktopMenuViewModel',
		'collection/EntryCollection', 'collection/GasstationCollection', 'collection/LocationCollection', 'collection/FuelsortCollection',
		'jquery-fast-click', 'jquery-cookie'
	],
	function($, _, Router, ToolbarViewModel, MenuViewModel, DesktopMenuViewModel, EntryCollection, GasstationCollection, LocationCollection, FuelsortCollection) {
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
				$('.wave').animate({
					top: '-=25%'
				}, {
					complete: function() {
						$('.percent-label').html(
							parseInt($('.percent-label').html()) + 25
						);
					}
				});

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
				var that = this;
				$('.wave').animate({
					top: '5%'
				}, {
					complete: function() {
						Router.start();
						that.hideLoadingIndicator_();
						//that.showNewsNotification_();
					}
				});
			},

			showToolbar_: function() {
				var toolbarViewModel = new ToolbarViewModel();
				toolbarViewModel.getMainView().show();
			},

			showMenu_: function() {
				var menuViewModel = new MenuViewModel();
				menuViewModel.getMainView().show();
			},

			showDesktopMenu_: function() {
				var desktopMenuViewModel = new DesktopMenuViewModel({
					element: $('#desktop-menu-container')
				});
				desktopMenuViewModel.getMainView().show();
			},

			showContent_: function() {
				$('#app-container').fadeIn(500);
			},

			hideLoadingIndicator_: function() {
				var that = this;
				$('.loading-indicator').fadeOut(500, function() {
					$(this).remove();
					that.showToolbar_();
					that.showMenu_();
					that.showDesktopMenu_();
					that.showContent_();
				});
			},

			showNewsNotification_: function() {
				var cookieValue = $.cookie('alreadyVisited');
				if (!cookieValue) {
					$.cookie('alreadyVisited', 'yes');
					alert('This seems to be your first visit!');
				}
			}
		});
		
		return Application;
	}
);