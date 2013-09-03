define(
	[
		'underscore',
		'viewModel/ViewModel', 'view/MenuView'
	],
	function(_, ViewModel, MenuView) {
		'use strict';

		var MenuViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new MenuView();
			}

		});

		return MenuViewModel;
	}
);