/**
 * Applied from Backbone.js 1.0.0
 * (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
 * (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 *
 * @see https://github.com/jashkenas/backbone/blob/master/backbone.js
 */
define(
	['underscore'],
	function(_) {
		'use strict';

		return function(childPrototype) {
			var parent = this;
			var child;

			if (childPrototype && childPrototype.hasOwnProperty('constructor')) {
				child = childPrototype.constructor;
			} else {
				child = function() {
					return parent.apply(this, Array.prototype.slice.call(arguments, 0));
				};
			}

			/* Inheritance */
			var surrogate = function() {
			};
			surrogate.prototype = parent.prototype;
			surrogate.prototype.constructor = child;
			child.prototype = new surrogate();
			_.extend(child.prototype, childPrototype);
			child.extend = parent.extend;

			return child;
		}
	}
);