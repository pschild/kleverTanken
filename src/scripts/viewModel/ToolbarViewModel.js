define(
	[
		'underscore',
		'viewModel/ViewModel', 'view/ToolbarView'
	],
	function(_, ViewModel, ToolbarView) {
		'use strict';

		var ToolbarViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new ToolbarView();
			}

		});

		return ToolbarViewModel;
	}
);