define(
	[
		'underscore',
		'viewModel/ViewModel', 'view/StatisticView'
	],
	function(_, ViewModel, StatisticView) {
		'use strict';

		var StatisticViewModel = ViewModel.extend({

			doInitialize: function(options) {
				this.mainView = new StatisticView();
			}

		});

		return StatisticViewModel;
	}
);