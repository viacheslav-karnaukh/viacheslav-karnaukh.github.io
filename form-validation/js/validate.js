'use strict';

(function() {
    // form elements saved in variables
    var form = document.querySelector('form');
    var emailInput = document.querySelector('#email');
    var passwordInput = document.querySelector('#password');
    var phoneInput = document.querySelector('#phone');
    var checkbox = document.querySelector('[type=checkbox]');
    var submitButton = document.querySelector('[type=submit]');
    // all the models which will be checked for controlling visualisation
    var usedEmails = ['author@mail.com', 'foo@mail.com', 'tester@mail.com'];
    var patterns = {
        'email': {
            'contains @': /@/,
            'valid': /^[\w.-]+@[\w-]+\.[a-zA-Z0-9.]+$/
        },
        'password': {
            'not too short': /.{5,}/,
            'forbidden symbols': /[^a-zA-Z0-9_-]/,
            'too simple': /(^[a-zA-Z]*$)|(^[0-9]*$)/
        },
        'phone': /^\+\d{12}$/
    };
    var errorMessages = {
        'email': {
            'not valid': 'Email should look like email@example.com',
            'withoutAt': 'Email must have \"@\" sign.',
            used: function(enteredEmail) {
                return 'Email ' + enteredEmail + ' is already used.';
            },
            usedOnServer: function(email) {
                return 'Email ' + email + ' is already stored on a server.';
            }
        },
        'password': {
            'short': 'Password should contain minimum 5 characters.',
            'allowed symbols': 'Only latin characters, digits, underscore and hyphen are allowed.',
            'simple': 'Too simple password. Try to use both letters and digits.'
        },
        'phone': 'Phone number shoud be entered using international format, e.g. +380991234567'
    };
    var check = {
        pattern: function(regexp, node) {
            return regexp.test(node.value);
        },
        requirements: function() {
            return !(document.querySelector('.has-error') || document.querySelector('.alert') || !checkbox.checked || !emailInput.value || !passwordInput.value);
        }
    };
    // functions to use for visualisation
    var display = {
        errorText: function(errorMessage) {
            var errorNode = document.createElement('div');
            errorNode.className = 'alert alert-danger';
            errorNode.innerText = errorMessage;
            return errorNode;
        },
        errorOn: function(field, errorMessage) {
            if (field.parentNode.lastChild.className === 'alert alert-danger') return;
            field.parentNode.className += ' has-error';
            field.parentNode.appendChild(display.errorText(errorMessage));
        },
        errorOff: function(field) {
            field.parentNode.className = field.parentNode.className.replace(' has-error', '');
            if (field.parentNode.lastChild.className === 'alert alert-danger') {
                field.parentNode.removeChild(field.parentNode.lastChild);
            }
        },
        submitState: function() {
            function preventEnterKeyPress(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                }
            }
            if (check.requirements()) {
                submitButton.className = 'btn btn-primary';
            } else {
                submitButton.className = 'btn btn-primary disabled';
                document.documentElement.addEventListener('keypress', preventEnterKeyPress, false);
            }
        }
    };
    // all web page processes control
    var controls = {
        input: function(field) {
            function validInputs() {
                    function checkEmailOnServer(emailToCheck) {
                            var request = new XMLHttpRequest();
                            var STATE_READY = 4;
                            var isUsed = false;
                            request.open('get', 'https://aqueous-reaches-8130.herokuapp.com/check-email/?email=' + emailToCheck, true);
                            request.onreadystatechange = function() {
                                if (request.readyState === STATE_READY) {
                                    isUsed = JSON.parse(request.responseText)['used'];
                                    if (isUsed) display.errorOn(field, errorMessages['email']['usedOnServer'](field.value));
                                }
                            };
                            request.send();
                        }
                        // depending on which field data input occurs, construct cases of error messages
                    switch (field.id) {
                        case 'email':
                            if (!check.pattern(patterns['email']['contains @'], field)) {
                                display.errorOn(field, errorMessages['email']['withoutAt']);
                            } else if (!check.pattern(patterns['email']['valid'], field)) {
                                display.errorOn(field, errorMessages['email']['not valid']);
                            } else if (usedEmails.indexOf(field.value) !== -1) {
                                display.errorOn(field, errorMessages['email']['used'](field.value));
                            } else checkEmailOnServer(field.value);
                            if (!field.value) display.errorOff(field);
                            break;
                        case 'password':
                            if (check.pattern(patterns['password']['forbidden symbols'], field)) {
                                display.errorOn(field, errorMessages['password']['allowed symbols']);
                            } else if (!check.pattern(patterns['password']['not too short'], field)) {
                                display.errorOn(field, errorMessages['password']['short']);
                            } else if (check.pattern(patterns['password']['too simple'], field)) {
                                display.errorOn(field, errorMessages['password']['simple']);
                            }
                            if (!field.value) display.errorOff(field);
                            break;
                        case 'phone':
                            if (!check.pattern(patterns['phone'], field)) {
                                display.errorOn(field, errorMessages['phone']);
                            }
                            if (!field.value) display.errorOff(field);
                            break;
                    }
                    display.submitState();
                }
                // set time lag for validating inputs and informing a user with error messages
            var timeout = setTimeout(validInputs, 500);

            function delayedError() {
                    var event = event || window.event;
                    var target = event.target || event.srcElement;
                    clearTimeout(timeout);
                    timeout = setTimeout(validInputs, 500);
                    var error = setTimeout(display.errorOff(target), 500);
                }
                // handlers listening to events to start validating process
            form.addEventListener('keyup', delayedError, false);
            form.addEventListener('change', delayedError, false);
            form.addEventListener('blur', validInputs, true);
        },
        init: function() {
            controls.input(emailInput);
            controls.input(passwordInput);
            controls.input(phoneInput);
            checkbox.addEventListener('click', function() {
                display.submitState();
            }, false);
        }
    };
    controls.init();
})();