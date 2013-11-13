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
				this.listenTo(this.mainView, 'menuitemclick', this.handleMenuItemClick_);
				this.listenTo(this.mainView, 'menumaskclick', this.handleMenuMaskClick_);
			},

			toggleMenu: function() {
				$('#menu').toggleClass('menu-open');
				$('#menu-mask').toggleClass('visible');

				/* Workaround: prevent scrolling when body-height is greater than viewport by setting overflow to hidden */
				if ($('#menu-mask').hasClass('visible')) {
					$('body').css('overflow', 'hidden');
					$('.menu-vertical').css('height', 1000);
				} else {
					$('body').css('overflow', 'auto');
					$('.menu-vertical').css('height', '100%');
				}
			},

			handleToggleMenuClick_: function() {
				this.toggleMenu();
			},

			handleMenuItemClick_: function() {
				this.toggleMenu();
			},

			handleMenuMaskClick_: function() {
				this.toggleMenu();
			}

		});

		return MenuViewModel;
	}
);