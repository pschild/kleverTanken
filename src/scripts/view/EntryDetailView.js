define(
	[
		'jquery', 'underscore', 'view/View',
		'mixin/DatetimeMixin',
		'text!templates/entryDetail/entryDetail.html', 'text!templates/entryDetail/detailInformation.html'
	],
	function($, _, View, datetimeMixin, entryDetailTemplate, detailInformationTemplate) {
		'use strict';

		var EntryDetailView = View.extend({
			$element: $('#app-container'),

			entryData_: null,

			doBind: function() {
				$('#edit-entry-button').click(this.getEditEntryButtonClickHandler_());
				$('#delete-entry-button').click(this.getDeleteEntryButtonClickHandler_());
			},

			doUnbind: function() {
				$('#edit-entry-button').unbind();
				$('#delete-entry-button').unbind();
			},

			doPopulate: function(data) {
				this.entryData_ = data;
				this.renderDetailData_();
			},

			renderDetailData_: function() {
				$('#detail-information').html(
					_.template(
						detailInformationTemplate,
						{
							entryData: this.entryData_,
							formattedDateString: datetimeMixin.formatServerDateToGermanDate(this.entryData_.entry.datetime, true, true)
						}
					)
				);

				if (this.entryData_.entry.mts && this.entryData_.entry.mts == 1) {
					$('.mts-info').show();
				}
			},

			doRender: function() {
				this.$element.html(
					_.template(entryDetailTemplate)
				);
			},

			getEditEntryButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('editentry');
				}
			},

			getDeleteEntryButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('deleteentry');
				}
			}
		});
		
		return EntryDetailView;
	}
);