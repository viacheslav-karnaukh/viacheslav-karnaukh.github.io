define(function() {
    'use strict';
    return {
        getCoordinates: function(city) {
            return $.getJSON('https://maps.googleapis.com/maps/api/geocode/json', {
				address: city,
				language: 'en'
			});			
        }
    };
});