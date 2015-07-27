define(['mediator', 'util/rangeslider'], function(mediator, rangeslider) {
    'use strict';
    
    function Settings(options) {
        this.options = options || {
            unit: 'celsius',
            forecastPeriod: 7,
            updatePeriod: 15
        };
        this.init();
    }

    Settings.prototype.setParameters = function(parameters) {
        this.options = parameters || this.options;
        $('.controls').find('[data-temp-unit=' + this.options.unit + ']').prop('checked', true);
        $('#forecast-period').find('.filtered-num').text(this.options.forecastPeriod);
        $('#forecast').val(this.options.forecastPeriod);
        $('#forecast-update').find('.filtered-num').text(this.options.updatePeriod);
        $('#update').val(this.options.updatePeriod);
        this._rangeCaptionChange();
        mediator.publish('settingsChanged', this.options); 
    };
    
    Settings.prototype._updateParameters = function() {
        return {
            unit: $('[data-temp-unit]:checked').data('tempUnit'),
            forecastPeriod: Number($('#forecast').val()),
            updatePeriod: Number($('#update').val())
        };
    };

    Settings.prototype.rangeHandler = function() {
        var $radioInputs = $('.filter [type=radio]');
        var $ranges = $('.filter [type=range]');
        $ranges.on('input', function() {
            this.setParameters(this._updateParameters());
        }.bind(this));
        $radioInputs.on('change', function() {
            this.setParameters(this._updateParameters());
        }.bind(this));
    };

    Settings.prototype._rangeCaptionChange = function() {
        var $ranges = $('.filter [type=range]');
        $.each($ranges, function(i, range) {
            var parent = $(range).parent();
            var days = $(range).parent().find('.filter-days');
            var num = $(range).parent().find('.filtered-num');
            num.text($(range).val());
            $(range).val() === '1' ? days.text('day') : days.text('days');
        })
    };

    Settings.prototype.init = function() {
        this.setParameters();
        this.rangeHandler();
        $('input[type=range]').rangeslider({polyfill: false});      
    };
    return Settings;
});