(function() {
    'use strict';

    var FizzBuzzGame = function(options) {
        var button = options.button;
        var input = options.input;
        var output = options.output;
        var INITIAL_INPUT_VALUE = null;
        var ENTER_KEY_CODE = 13;

        function getFizzBuzzItemsArr(count) {
            var res = [];
            for (var i = 1; i <= count; i += 1) {
                if (i % 3 && i % 5) {
                    res.push(i);
                } else {
                    res.push((i % 3 ? '' : 'Fizz') + (i % 5 ? '' : 'Buzz'));
                }
            }
            return res;
        }

        function clear(containerNode) {
            while (containerNode.firstChild) {
                containerNode.removeChild(containerNode.firstChild);
            }
        }

        function wrapData(arrOfData, tagName, containerNode) {
            var child;
            var frag = document.createDocumentFragment();
            clear(containerNode);
            arrOfData.forEach(function(content) {
                child = document.createElement(tagName);
                child.textContent = content;
                frag.appendChild(child);
            });
            containerNode.appendChild(frag);
        }

        function showList(e) {
            var enteredCounts = Number(input.value);
            var isInt = enteredCounts === parseInt(input.value, 10);
            e.preventDefault();
            if(enteredCounts < 1 || !isInt) {
                enteredCounts = INITIAL_INPUT_VALUE;
                input.value = INITIAL_INPUT_VALUE;
            }
            wrapData(getFizzBuzzItemsArr(enteredCounts), 'li', output);
        }

        function showListOnEnter(e) {
            if(e.keyCode === ENTER_KEY_CODE) {
                showList(e);
            }
        }

        function init() {
            button.addEventListener('click', showList);
            input.addEventListener('keyup', showListOnEnter);
        }

        var publicAPI = {
            init: init
        };

        return publicAPI;
    };

    var options = {
        button: document.querySelector('.play-button'),
        input: document.querySelector('.user-input'),
        output: document.querySelector('.output-block')
    };
    var game = FizzBuzzGame(options);
    game.init();
})();