define(function() {
	'use strict';
	return {
		save: function(obj) {
			Object.keys(obj).forEach(function(key) {
				localStorage.setItem(key, obj[key]);
			});
		},
		get: function(key) {
			return localStorage.getItem(key);
		},
		getAll: function() {
			return localStorage;
		}
	};
});