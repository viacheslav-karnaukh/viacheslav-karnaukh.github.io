(function() {
	'use strict';
	function Validator(regex, inputNode) {
		this.regex = regex;
		this.inputNode = inputNode;
	}
	Validator.prototype._isValid = function() {
		return this.regex.test(this.inputNode.value);
	};
	Validator.prototype.showResult = function() {
		var parent = this.inputNode.parentNode;
		parent.classList.toggle('no-error', this._isValid());
		parent.classList.toggle('error', !this._isValid());
	};
	Validator.prototype.init = function() {
		this.showResult();
		this.inputNode.addEventListener('keyup', this.showResult.bind(this));
	};

	var validator = new Validator(/^[A-Z][A-Za-z]+(\s[A-Z][A-Za-z]+){1,2}$/, document.querySelector('.test-names > input'));
	validator.init();
})();