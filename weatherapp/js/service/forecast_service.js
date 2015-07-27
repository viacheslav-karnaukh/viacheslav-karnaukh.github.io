define(function() {
	'use strict';
	return {
		getDataJSON: function(coords) {
			return $.getJSON([
				'https://api.forecast.io/forecast/6032e2f96ea6972bbb58fb1f80962e2b/',
				coords.lat + ',' + coords.lng,
				'?units=si&callback=?'
			].join(''));
		}
	};
});