define("utils/util", [
	'vendor/core'
], function(core) {
	'use strict';

	var _ = core._,
		$ = core.$,
		Hammer = core.Hammer;

	/**
	 * Extend class
	 * @param protoProps
	 * @param staticProps
	 * @returns {function}
	 */
	var extend = function(protoProps, staticProps) {
		var parent = this;
		var child;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() {
				return parent.apply(this, arguments);
			};
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function() {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate();

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) {
			_.extend(child.prototype, protoProps);
		}

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	};

	var Class = function() {};

	Class.extend = extend;

	/**
	 * An observer constructor
	 * @constructor
	 */
	var EventEmitter = Class.extend({
		constructor: function() {
			this._listeners = {};
		},

		trigger: function(name) {
			var argumentsArr = Array.prototype.slice.call(arguments, 1);

			if (!(name in this._listeners)) {
				throw new Error('This name does not exist! ' + name);
			}

			this._listeners[name].forEach(function(obj) {
				obj.callback.apply(obj.ctx, argumentsArr);
			});
		},

		on: function(name, callback, ctx) {
			ctx = ctx || {};

			var events = this._listeners[name] || (this._listeners[name] = []);

			events.push({
				callback: callback,
				ctx: ctx
			});
		},

		off: function(name) {
			delete this._listeners[name];
		}
	});



	/**
	 * Makes two-digits number from one digit number
	 * @param {string} val    String format of number
	 * @returns {string}
	 */
	var formatDate = function(val) {
		var valStr = String(val);

		return (valStr.length === 1) ? "0" + valStr : valStr;
	};

	/**
	 * Converts a temperature value to celsius units
	 * @param tempFahrenheiht
	 * @returns {number}
	 */
	var convertTempToCelsius = function(tempFahrenheiht) {
		return (parseFloat(tempFahrenheiht) - 32) * 5 / 9;
	};

	function rangeCaptionChange() {
		var $ranges = $('.filter [type=range]');
		$ranges.on('input', function() {
			var $parent = $(this).parent();
			var $days = $parent.find('.filter-days');
			var $num = $parent.find('.filtered-num');
			$num.text(this.value);
			this.value === '1' ? $days.text('day') : $days.text('days');
		});
	}


	return {
		'Class': Class,
		'eventBus': new EventEmitter(),
		'getTimeByOffset': getTimeByOffset,
		'formatDate': formatDate,
		'convertTempToCelsius': convertTempToCelsius,
		'getTimeOfDay': getTimeOfDay,
		'rangeCaptionChange': rangeCaptionChange
	};
});