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
				$('#edit-entry-button').on('click', this.getEditEntryButtonClickHandler_());
				$('#delete-entry-button').on('click', this.getDeleteEntryButtonClickHandler_());
			},

			doUnbind: function() {
				$('#edit-entry-button').off('click');
				$('#delete-entry-button').off('click');
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
			},

			doRender: function() {
				this.$element.html(
					_.template(entryDetailTemplate)
				);
			},

			getEditEntryButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('editentry', that.entryData_.entry.id);
				}
			},

			getDeleteEntryButtonClickHandler_: function() {
				var that = this;
				return function() {
					that.trigger('deleteentry', that.entryData_.entry.id);
				}
			}
		});
		
		return EntryDetailView;
	}
);