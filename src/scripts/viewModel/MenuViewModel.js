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

				this.listenTo(this.mainView, 'menutoggle', this.handleToggleMenuClick_);
				this.listenTo(this.mainView, 'menumaskclick', this.handleMenuMaskClick_);
				this.listenTo(this.mainView, 'menuitemclick', this.handleMenuItemClick_);
			},

			handleToggleMenuClick_: function() {
				this.toggleMenu();
			},

			handleMenuMaskClick_: function() {
				if ($('.menu-mask').hasClass('visible')) {
					this.toggleMenu();
				}
			},

			handleMenuItemClick_: function() {
				this.toggleMenu();
			},

			toggleMenu: function() {
				$('#menu').toggleClass('menu-open');
				$('#menu-mask').toggleClass('visible');
			}

		});

		return MenuViewModel;
	}
);