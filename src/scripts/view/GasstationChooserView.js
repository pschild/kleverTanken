define(
	[
		'jquery', 'underscore', 'view/View',
		'text!templates/gasstationChooser.html'
	],
	function($, _, View, gasstationChooserTemplate) {
		'use strict';

		var GasstationChooserView = View.extend({

			gasstationCollection_: null,

			locationCollection_: null,

			emptyLabelText_: 'bitte wählen...',

			setEmptyLabelText: function(text) {
				if (text) {
					this.emptyLabelText_ = text;
				}
			},

			doBind: function() {
				$('#gasstation-chooser').on('change', this.getGasstationChooserChangeHandler_());
			},

			doUnbind: function() {
				$('#gasstation-chooser').off('change');
			},

			doPopulate: function(data) {
				this.gasstationCollection_ = data.gasstationCollection;
				this.locationCollection_ = data.locationCollection;

				this.populateGasstations_();
			},

			doRender: function() {
				this.$element.html(
					_.template(gasstationChooserTemplate)
				);
			},

			populateGasstations_: function() {
				$('#gasstation-chooser').append(
					$('<option/>').val(-1).text(this.emptyLabelText_)
				);

				this.gasstationCollection_.sortBy(function(value) {
					return value.name;
				});

				_.each(this.gasstationCollection_.getData(), function(gasstation) {
					var option = $('<option/>').val(gasstation.id).text(gasstation.name);
					$('#gasstation-chooser').append(option);
				});
			},

			populateLocations: function() {
				$('#location-chooser').empty();

				var locations = this.locationCollection_.findWhere('gasstationId', $('#gasstation-chooser').val(), true);
				_.each(locations, function(location) {
					var option = $('<option/>').val(location.id).text(location.street);
					$('#location-chooser').append(option);
				});
			},

			getGasstationChooserChangeHandler_: function() {
				var that = this;
				return function() {
					that.trigger('gasstationchooserchange', this.value);
				};
			}
		});
		
		return GasstationChooserView;
	}
);