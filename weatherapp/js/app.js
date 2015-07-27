requirejs.config({
	baseUrl: 'js',
	paths: {
		jquery: 'lib/jquery',
		lodash: 'lib/lodash',
		text: 'lib/text',
		mediator: 'util/mediator'
	}
});

define(function (require) {
	'use strict';
	var Settings = require('components/settings');
	var Dashboard = require('components/dashboard');
	var Search = require('components/search');
	new Dashboard();
	new Settings();
	new Search();
	
});