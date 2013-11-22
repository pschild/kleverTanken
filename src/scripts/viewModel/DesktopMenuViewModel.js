define(
	[
		'underscore',
		'viewModel/ViewModel', 'view/DesktopMenuView'
	],
	function (_, ViewModel, DesktopMenuView) {
		'use strict';

		var DesktopMenuViewModel = ViewModel.extend({

			doInitialize: function (options) {
				this.mainView = new DesktopMenuView();
				// we need to set the element manually here because otherwise it is not rendered at this point of time.
				this.mainView.setElement(options.element);
			}

		});

		return DesktopMenuViewModel;
	}
);