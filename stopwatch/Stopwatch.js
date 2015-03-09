'use strict';

(function () {
    var startstopS = 83;
    var lapL = 76;
    var resetR = 82;

    function Timer(node) {
        this.node = node;
        this.init();
        this.allowKeyboardControl();
        this.startStopButton = this.node.querySelector('.btn.btn-primary');
        this.ticTac = this.node.querySelector('.stopwatch-current');
        this.intervalId = null;
        this.elapsedTime = 0;
    }

    Timer.prototype.init = function() {
        this.node.innerHTML = ' <div class="container">' +
                                    '<div class="row well">' +
                                        '<div class="col-xs-2"></div>' +
                                        '<div class="col-xs-3">' +
                                            '<h2 class="stopwatch-current">00:00:00:000</h2>' +
                                            '<div class="stopwatch-laps"></div>' +
                                        '</div>' +
                                        '<div class="col-xs-4 stopwatch-controls">' +
                                            '<div class="btn-group btn-group-lg">' +
                                                '<button class="btn btn-primary">Start</button>' +
                                                '<button class="btn btn-info">Lap</button>' +
                                            '</div>' +
                                            '<button class="btn btn-danger btn-sm">Reset</button>' +
                                        '</div>' +
                                        '<div class="col-xs-3"></div>' +
                                    '</div>' +
                                '</div>';
        var timerControlPanel = this.node.querySelector('.stopwatch-controls');
        var resetButton = timerControlPanel.querySelector('.btn.btn-danger.btn-sm');
        var _this = this;

        // behaviour when clicking button in control panel depending what button was clicked
        timerControlPanel.addEventListener('click', function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            switch (target.className) {
                case 'btn btn-primary': // start/stop button was clicked
                    _this.intervalId ? _this.stop() : _this.start();
                    _this.toggleStartStopButton();
                    break;
                case 'btn btn-info': // lap button was clicked
                    _this.prependLap();
                    break;
                case 'btn btn-danger btn-sm': // reset button was clicked
                    _this.reset();
                    break;
            }     
        }, false);

        // style changes when hovering reset button
        var stopwatchCurrentColor = this.node.querySelector('.stopwatch-current').style.color;
        resetButton.addEventListener('mouseover', function() {
            if (_this.elapsedTime) _this.ticTac.style.color = '#f55';
        }, false);
        resetButton.addEventListener('mouseleave', function() {
            _this.ticTac.style.color = stopwatchCurrentColor;
        }, false);
    };
    // allow keyboard control of the timer the pointer is hovering over or last moved from [S - strt/stop, L - lap, R -reset]
    Timer.prototype.allowKeyboardControl = function() {
        var _this = this;
        this.node.addEventListener('mouseenter', function() {
            Timer.lastActive = _this;
        }, false);
        document.addEventListener('keyup', function(event) {
            event = event || window.event;
            if (Timer.lastActive !== _this) return;
            switch (event.keyCode) {
                case startstopS:
                    _this.intervalId ? _this.stop() : _this.start();
                    _this.toggleStartStopButton();
                    break;
                case lapL:
                    _this.prependLap();
                    break;
                case resetR:
                    _this.reset();
                    break;
            }
        }, false);
    };

    Timer.prototype.toggleStartStopButton = function() {
        this.startStopButton.innerText = this.startStopButton.innerText === 'Start' ? 'Stop' : 'Start';
    };

    Timer.prototype.start = function() {
        var startTime = new Date().getTime();
        var _this = this;
        this.intervalId = setInterval(function() {
            var nextTicTime = new Date().getTime();
            _this.elapsedTime += (nextTicTime - startTime);
            startTime = nextTicTime;
            _this.ticTac.innerText = _this.convert(_this.elapsedTime);
        }, 16);
    };

    Timer.prototype.stop = function() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    };

    Timer.prototype.prependLap = function() {
        if (!this.elapsedTime) return;
        var stopwatchLaps = this.node.querySelector('.stopwatch-laps');
        var firstChildNode = stopwatchLaps.firstChild;
        var div = document.createElement('div');
        div.className = 'alert alert-info';
        div.innerHTML = this.convert(this.elapsedTime) + '<span class="label label-danger">×</span>';
        if (firstChildNode && firstChildNode.innerText === div.innerText) return;
        stopwatchLaps.insertBefore(div, firstChildNode);
        this.removeLap();
    };

    Timer.prototype.reset = function() {
        this.elapsedTime = 0;
        this.stop();
        if (this.startStopButton.innerText === 'Stop') this.toggleStartStopButton();
        this.ticTac.innerText = this.convert(this.elapsedTime);
    };

    Timer.prototype.convert = function(timeToConvert) {
        var hours, minutes, seconds, milliseconds, strResult;
        function stringify2didgits (timeToCheck) {
            return timeToCheck < 10 ? '0' + timeToCheck + ':' : timeToCheck + ':';
        }
        function stringify3didgits (timeToCheck) {
            if (timeToCheck < 10) {
                timeToCheck = '00' + timeToCheck;
            } else if (timeToCheck < 100) {
                timeToCheck = '0' + timeToCheck;
            }
            return '' + timeToCheck;
        }
        hours = Math.floor(timeToConvert / (1000 * 60 * 60));
        minutes = Math.floor(timeToConvert / (1000 * 60)) - hours * 60;
        seconds = Math.floor(timeToConvert / 1000) - minutes * 60 - hours * 60 * 60;
        milliseconds = timeToConvert - seconds * 1000 - minutes * 60 * 1000 - hours * 60 * 60 * 1000;
        strResult = stringify2didgits(hours) + stringify2didgits(minutes) + stringify2didgits(seconds) + stringify3didgits(milliseconds);
        return strResult;
    };

    Timer.prototype.removeLap = function() {
        var lapSection = this.node.querySelector('.stopwatch-laps');
        lapSection.addEventListener('click', function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            target.parentNode.style.display = target.className === 'label label-danger' ? 'none' : '';
        });
        // style changes when hovering close buttons
        var closeButtons = this.node.querySelectorAll('.label.label-danger');
        var laps = this.node.querySelectorAll('.alert.alert-info');
        var lapBackgroundInitial = laps[0].style.backgroundColor;
        var closeButtonColorInitial = closeButtons[0].style.color;
        [].forEach.call(closeButtons, function(closeButton, closeButtonIndex) {
            closeButton.addEventListener('mouseover', function() {
                laps[closeButtonIndex].style.backgroundColor = '#fdd';
                closeButtons[closeButtonIndex].style.color = 'black';
            }, false);
            closeButton.addEventListener('mouseleave', function() {
                laps[closeButtonIndex].style.backgroundColor = lapBackgroundInitial;
                closeButtons[closeButtonIndex].style.color = closeButtonColorInitial;
            }, false);
        });
    };
    
    window.Timer = Timer;
})();

// self-executing anonymous function for creating timer on the page
(function () {
    new Timer(document.querySelector('.node'));
    new Timer(document.querySelector('.node2'));
    new Timer(document.querySelector('.node3'));
})();