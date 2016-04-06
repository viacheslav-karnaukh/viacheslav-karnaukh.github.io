(function() {
    'use strict';

    angular
        .module('pokedexApp', ['ngRoute', 'ngResource'])

        .config(['$routeProvider', '$locationProvider', function($routeProvider) {
            $routeProvider
                .when('/', { templateUrl: 'app/components/pokemons/all.html' })
                .otherwise({ redirectTo: '/' });
        }]);
    
})();