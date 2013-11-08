define(
	'GoogleMapsWrapper',
	[
		'async!http://maps.google.com/maps/api/js?sensor=false'
	],
	function() {
		'use strict';

		return google.maps;
	}
);