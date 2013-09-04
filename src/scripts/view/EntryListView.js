define(
	[
		'jquery', 'underscore', 'view/View',
		'mixin/DatetimeMixin',
		'text!templates/entryList/entryList.html', 'text!templates/entryList/entryItem.html'
	],
	function($, _, View, datetimeMixin, entryListTemplate, entryItemTemplate) {
		'use strict';

		var EntryListView = View.extend({
			$element: $('#app-container'),

			entries_: [],

			doBind: function() {
				$('#load-more-button').on('click', this.getLoadMoreButtonClickHandler_());
			},

			doUnbind: function() {
				$('#load-more-button').off('click');
			},

			doPopulate: function(data) {
				this.appendEntries_(data.entries);
			},

			doRender: function() {
				this.$element.html(
					_.template(entryListTemplate)
				);
			},

			appendEntries_: function(entries) {
				var that = this;
				_.each(entries, function(entryData) {
					that.entries_.push(entryData);

					$('.entry-list-container').append(
						_.template(
							entryItemTemplate,
							{
								entry: entryData.entry,
								fuelsort: entryData.fuelsort,
								location: entryData.location,
								gasstation: entryData.gasstation,
								elapsedTime: datetimeMixin.mapElapsedTime(entryData.entry.datetime)
							}
						)
					);
				});
			},

			getLoadMoreButtonClickHandler_: function() {
				var that = this;
				return function(event) {
					event.preventDefault();
					that.trigger('loadmore');
				}
			}
		});
		
		return EntryListView;
	}
);