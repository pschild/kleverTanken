define(
	['underscore', 'mixin/EventsMixin'],
	function(_, EventsMixin) {
		'use strict';

		function EventBus(options) {

		}

		_.extend(EventBus.prototype, EventsMixin, {

		});

		return new EventBus();
	}
);