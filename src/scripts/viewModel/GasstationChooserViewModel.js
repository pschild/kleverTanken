define(
	[
		'underscore',
		'viewModel/ViewModel',
		'collection/GasstationCollection', 'collection/LocationCollection',
		'view/GasstationChooserView'
	],
	function(_, ViewModel, GasstationCollection, LocationCollection, GasstationChooserView) {
		'use strict';

		var GasstationChooserViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new GasstationChooserView();
				this.mainView.setElement(options.element);

				this.listenTo(this.mainView, 'gasstationchooserchange', this.handleGasstationChooserChange_);
			},

			doPopulate: function(data) {
				this.mainView.populate({
					gasstationCollection: GasstationCollection,
					locationCollection: LocationCollection
				});
			},

			handleGasstationChooserChange_: function(value) {
				if (value > 0) {
					$('#location-chooser').slideDown();
					this.mainView.populateLocations();
					return;
				}

				$('#location-chooser').slideUp();
			}

		});

		return GasstationChooserViewModel;
	}
);