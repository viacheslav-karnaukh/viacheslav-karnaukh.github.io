define(['service/geolocation_service', 'service/forecast_service', 'service/storage_service', 'mediator'], function(geolocation, forecast, storage, mediator) {
    'use strict';

    function Search() {
        this.citiesList = (function() {
            var savedKeys = Object.keys(localStorage);
            var obj = {};
            if (savedKeys.length) {
                savedKeys.forEach(function(key) {
                    obj[key] = JSON.parse(localStorage[key]);
                });
            }
            return obj;
        })();
        this.init();
    };
    Search.prototype.toggleSidebar = function() {
        var $burgerButton = $('.active-menu');
        var $sidebar = $('#sidebar');
        $burgerButton.click(function() {
            $sidebar.toggleClass('sidebar-hidden');
            $(this).toggleClass('active-menu');
        });
    };
    Search.prototype.addCity = function(cityName) {
        var _this = this;
        if (!cityName) return;
        geolocation.getCoordinates(cityName).done(function(data) {
            var city = data.results[0].address_components[0].long_name;
            var coordinates = data.results[0].geometry.location;
            forecast.getDataJSON(coordinates).then(function(json) {
                if (Object.keys(_this.citiesList).length > 9) return;
                _this.citiesList[city] = json;
                var obj = {};
                obj[city] = JSON.stringify(json);
                console.log(obj);
                storage.save(obj);
                _this.showCities(Object.keys(_this.citiesList));
                $('#search').val('');
            });
        });
    };
    Search.prototype.initSearchBehaviour = function() {
        var $addInputButton = $('.icon-add');
        var $chekButton = $('.icon-check');
        var $receiveDataForm = $('#form');
        var $searchField = $('#search');
        var $cities = $('.cities');
        var _this = this;

        $addInputButton.click(function() {
            [this, $chekButton, $receiveDataForm].forEach(function(node) {
                $(node).toggle();
            });
        });
        $chekButton.click(function() {
            _this.addCity($searchField.val().trim());
        });

        $cities.on('click', '.inner-holder', function(e) {
            var cityName = $(this).find('.city-name').text();
            var obj = {};
            obj[cityName] =  _this.citiesList[cityName];
            mediator.publish('cityClicked', obj);
        })

        $receiveDataForm.on('submit', function(e) {
            e.preventDefault();
            _this.addCity($searchField.val().trim());
        });
        new google.maps.places.Autocomplete(document.getElementById('search'), {
            types: ['(cities)']
        });
    };
    Search.prototype.showCities = function(cities) {
        function iconNameReplacer(iconName) {
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
        };

        var $citiesContainer = $('.cities > ul');
        var $cityNode;
        $citiesContainer.empty();
        cities.forEach(function(city) {
            $cityNode = ['<li class="inner-holder">',
                '<div class="' + iconNameReplacer(this.citiesList[city].currently.icon) + '"></div>',
                '<div class="temp">' + Math.round(this.citiesList[city].currently.temperature) + '</div>',
                '<div>',
                '<div class="city-name">' + city + '</div>',
                '<div class="caption">//' + this.citiesList[city].currently.summary.toLowerCase() + '</div>',
                '</div>',
                '</li>'
            ].join('');
            $citiesContainer.append($cityNode);
        }.bind(this));
    };
    Search.prototype.showCitiesList = function() {

    };
    Search.prototype.init = function() {
        this.toggleSidebar();
        this.initSearchBehaviour();
        this.showCities(Object.keys(this.citiesList));
    };
    return Search;
});