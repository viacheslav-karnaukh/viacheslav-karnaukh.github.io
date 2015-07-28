define(['service/geolocation_service', 'service/forecast_service', 'service/storage_service', 'mediator'], function(geolocation, forecast, storage, mediator) {
    'use strict';

    function Dashboard(options) {
        this.options = options || {
            unit: 'celsius',
            forecastPeriod: 7
        };
        this.subscribe();
    }

    Dashboard.prototype.showForecastDays = function(settings) {
        var dailyForecastNodes = $('.forecast .weekday');
        dailyForecastNodes.each(function(i, dailyForecastNode) {
            i < settings.forecastPeriod ? $(dailyForecastNode).show() : $(dailyForecastNode).hide();
        });
    };

    Dashboard.prototype.showForecastToday = function() {};

    Dashboard.prototype.subscribe = function() {
        function updateDashboard(opts) {
            console.log(opts);
        }
        mediator.subscribe('settingsChanged', function(settings) {
            updateDashboard(settings);
            this.showForecastDays(settings);
        }.bind(this));
        mediator.subscribe('cityClicked', function(settings) {
            this.renderSlide(settings);
        }.bind(this));
    };

    Dashboard.prototype.renderSlide = function(settings) {
        console.log(settings, 'settings');
        var $slides = $('.slides');
        var currentCity = Object.keys(settings)[0];
        var currentUnixTime = settings[currentCity].currently.time * 1000;
        var currentUTCUnixTime = currentUnixTime + new Date().getTimezoneOffset() * 60 * 1000;
        var offsetMilliseconds = settings[currentCity].offset * 60 * 60 * 1000;
        var weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "november", "december"];

        function prettyTime(ms) {
            return [new Date(ms).getHours(), new Date(ms).getMinutes()].map(function(el) {
                return String(el).length === 1 ? ('0' + el) : el;
            }).join(':');
        }

        function replaceIcon(iconName) {
            var icons = {
                'clear-day': 'icon icon-sunny',
                'clear-night': 'icon icon-night',
                'rain': 'icon icon-rain',
                'snow': 'icon icon-snow',
                'sleet': 'icon icon-sleet',
                'wind': 'icon icon-wind',
                'fog': 'icon icon-fog',
                'cloudy': 'icon icon-cloudy-day',
                'partly-cloudy-day': 'icon icon-partly-cloudy',
                'partly-cloudy-night': 'icon icon-night-cloudy'
            };
            return icons[iconName];
        }
        var filteredSettings = {
            city: currentCity,
            time: (function(t) {
                return [t.getHours(), t.getMinutes()].map(function(el) {
                    return String(el).length === 1 ? ('0' + el) : el;
                }).join(':');
            })(new Date(currentUTCUnixTime + offsetMilliseconds)),
            currentDate: (function(t) {
                return weekDays[t.getDay()] + ', ' + months[t.getMonth()] + ' ' + t.getDate();
            })(new Date(currentUTCUnixTime + offsetMilliseconds)),
            icon: replaceIcon(settings[currentCity].currently.icon),
            todayTemp: Math.round(settings[currentCity].currently.temperature),
            currentWeatherCaption: '//' + settings[currentCity].currently.summary.toLowerCase(),
            timeHourly: settings[currentCity].hourly.data.map(function(obj) {
                return prettyTime(obj.time * 1000);
            }),
            iconHourly: settings[currentCity].hourly.data.map(function(obj) {
                return replaceIcon(obj.icon);
            }),
            tempHourly: settings[currentCity].hourly.data.map(function(obj) {
                return Math.round(obj.temperature);
            }),
            humidity: Math.round(settings[currentCity].currently.humidity * 100),
            windSpeed: Math.round(settings[currentCity].currently.windSpeed),
            sunrise: prettyTime(settings[currentCity].daily.data[0].sunriseTime * 1000),
            sunset: prettyTime(settings[currentCity].daily.data[0].sunsetTime * 1000),
            forecastForWeek: settings[currentCity].daily.data.slice(0, 7)
        };
        $('.current-time').html(filteredSettings.time);
        $('h1.city').html(filteredSettings.city);
        $('.current-date').html(filteredSettings.currentDate);
        $('#current-weather-icon').removeClass().addClass(filteredSettings.icon);
        $('.today-temp').html(filteredSettings.todayTemp);
        $('.current-weather .caption').html(filteredSettings.currentWeatherCaption);
        $('.hourly-forecast').each(function(i, el) {
            $(el).find('.time').html(filteredSettings.timeHourly[i]);
            $(el).find('.icon').removeClass().addClass(filteredSettings.iconHourly[i]);
            $(el).find('.temp').html(filteredSettings.tempHourly[i]);
        });
        $('.humidity .parameter-data').html(filteredSettings.humidity);
        $('.wind .parameter-data').html(filteredSettings.windSpeed);
        $('.sunrise .parameter-data').html(filteredSettings.sunrise);
        $('.sunset .parameter-data').html(filteredSettings.sunset);
        $('.forecast .weekday').each(function(i, weekday) {
            $(weekday).find('.day').html(weekDays[new Date(filteredSettings.forecastForWeek[i].time * 1000).getDay()].slice(0, 3));
            $(weekday).find('.icon').removeClass().addClass(replaceIcon(filteredSettings.forecastForWeek[i].icon));
            $(weekday).find('.from.temp').html(Math.round(filteredSettings.forecastForWeek[i].temperatureMin));
            $(weekday).find('.to.temp').html(Math.round(filteredSettings.forecastForWeek[i].temperatureMax));
        });
    };

    return Dashboard;
});