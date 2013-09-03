define(
	[
		'underscore',
		'viewModel/ViewModel', 'view/ImprintView'
	],
	function(_, ViewModel, ImprintView) {
		'use strict';

		var ImprintViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new ImprintView();
			}

		});

		return ImprintViewModel;
	}
);