/**
 * Applied from Backbone.js 1.0.0
 * (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
 * (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 *
 * @see https://github.com/jashkenas/backbone/blob/master/backbone.js
 */
define(
	[
		'jquery', 'underscore', 'mixin/EventsMixin', 'mixin/ExtendMixin', 'History',
		'viewModel/EntryListViewModel', 'viewModel/EntryMapViewModel', 'viewModel/EntryDetailViewModel', 'viewModel/EntryCreatorViewModel', 'viewModel/StatisticViewModel', 'viewModel/ImprintViewModel'
	],
	function($, _, EventsMixin, ExtendMixin, History, EntryListViewModel, EntryMapViewModel, EntryDetailViewModel, EntryCreatorViewModel, StatisticViewModel, ImprintViewModel) {
		'use strict';

		// Routers map faux-URLs to actions, and fire events when routes are
		// matched. Creating a new one sets its `routes` hash, if not set statically.
		function Router(options) {
			options || (options = {});
			if (options.routes) this.routes = options.routes;
			this._bindRoutes();
			this.initialize.apply(this, arguments);
		}

		// Cached regular expressions for matching named param parts and splatted
		// parts of route strings.
		var optionalParam = /\((.*?)\)/g;
		var namedParam = /(\(\?)?:\w+/g;
		var splatParam = /\*\w+/g;
		var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

		_.extend(Router.prototype, EventsMixin, {
			routes: {
				'': 'showEntryListView',
				'entryList': 'showEntryListView',
				'entryMap': 'showEntryMapView',
				'entryDetail/:id': 'showEntryDetailView',
				'entryCreator': 'showEntryCreatorView',
				'entryCreator/:id': 'showEntryCreatorView',
				'statistics': 'showStatisticView',
				'imprint': 'showImprintView'
			},

			activeViewModel: undefined,

			viewModels: {
				'entryListViewModel': {
					'clazz': EntryListViewModel,
					'instance': undefined
				},
				'entryMapViewModel': {
					'clazz': EntryMapViewModel,
					'instance': undefined
				},
				'entryDetailViewModel': {
					'clazz': EntryDetailViewModel,
					'instance': undefined
				},
				'entryCreatorViewModel': {
					'clazz': EntryCreatorViewModel,
					'instance': undefined
				},
				'statisticViewModel': {
					'clazz': StatisticViewModel,
					'instance': undefined
				},
				'imprintViewModel': {
					'clazz': ImprintViewModel,
					'instance': undefined
				}
			},

			// Initialize is an empty function by default. Override it with your own
			// initialization logic.
			initialize: function() {
			},

			start: function() {
				History.start();
			},

			// Manually bind a single named route to a callback. For example:
			//
			//     this.route('search/:query/p:num', 'search', function(query, num) {
			//       ...
			//     });
			//
			route: function(route, name, callback) {
				if (!_.isRegExp(route)) route = this._routeToRegExp(route);
				if (_.isFunction(name)) {
					callback = name;
					name = '';
				}
				if (!callback) callback = this[name];
				var router = this;
				History.route(route, function(fragment) {
					var args = router._extractParameters(route, fragment);
					callback && callback.apply(router, args);
					router.trigger.apply(router, ['route:' + name].concat(args));
					router.trigger('route', name, args);
					History.trigger('route', router, name, args);
				});
				return this;
			},

			// Simple proxy to `Backbone.history` to save a fragment into the history.
			navigate: function(fragment, options) {
				History.navigate(fragment, options);
				return this;
			},

			// Bind all defined routes to `Backbone.history`. We have to reverse the
			// order of the routes here to support behavior where the most general
			// routes can be defined at the bottom of the route map.
			_bindRoutes: function() {
				if (!this.routes) return;
				this.routes = _.result(this, 'routes');
				var route, routes = _.keys(this.routes);
				while ((route = routes.pop()) != null) {
					this.route(route, this.routes[route]);
				}
			},

			// Convert a route string into a regular expression, suitable for matching
			// against the current location hash.
			_routeToRegExp: function(route) {
				route = route.replace(escapeRegExp, '\\$&')
					.replace(optionalParam, '(?:$1)?')
					.replace(namedParam, function(match, optional) {
						return optional ? match : '([^\/]+)';
					})
					.replace(splatParam, '(.*?)');
				return new RegExp('^' + route + '$');
			},

			// Given a route, and a URL fragment that it matches, return the array of
			// extracted decoded parameters. Empty or unmatched parameters will be
			// treated as `null` to normalize cross-browser behavior.
			_extractParameters: function(route, fragment) {
				var params = route.exec(fragment).slice(1);
				return _.map(params, function(param) {
					return param ? decodeURIComponent(param) : null;
				});
			},

			destroyActiveViewModel: function() {
				if (!this.activeViewModel) {
					return;
				}

				this.activeViewModel.destroy();
			},

			getViewModel: function(name, options) {
				if (!this.viewModels) {
					return undefined;
				}

				options = options || {};
				if (!this.viewModels[name].instance) {
					var clazz = this.viewModels[name].clazz;
					this.viewModels[name].instance = new clazz(options);
				}
				return this.viewModels[name].instance;
			},

			showView: function(viewModelName, options) {
				this.destroyActiveViewModel();
				var viewModel = this.getViewModel(viewModelName, options);
				if (!viewModel) {
					console.error('No viewModel found for "' + viewModelName + '" in Router.showView().');
					return;
				}

				viewModel.getMainView().show();
				viewModel.populate(options || {});

				this.activeViewModel = viewModel;
			},

			showEntryListView: function() {
				this.showView('entryListViewModel');
			},

			showEntryMapView: function() {
				this.showView('entryMapViewModel');
			},

			showEntryDetailView: function(entryId) {
				this.showView('entryDetailViewModel', {
					entryId: entryId
				});
			},

			showEntryCreatorView: function(entryId) {
				this.showView('entryCreatorViewModel', {
					entryId: entryId
				});
			},

			showStatisticView: function() {
				this.showView('statisticViewModel');
			},

			showImprintView: function() {
				this.showView('imprintViewModel');
			}
		});

		Router.extend = ExtendMixin;

		return new Router();
	}
);