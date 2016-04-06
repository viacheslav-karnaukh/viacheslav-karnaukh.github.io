(function() {
    'use strict';

    angular
        .module('pokedexApp')
        .controller('PokemonsController', ['$scope', 'Pokemons', PokemonsController]);

    function PokemonsController($scope, Pokemons) {

        var featuresMap = {
            types: 'Type',
            attack: 'Attack',
            defense: 'Defense',
            hp: 'HP',
            sp_atk: 'SP Attack',
            sp_def: 'SP Defense',
            speed: 'Speed',
            weight: 'Weight',
            moves: 'Total moves'
        };

        $scope.pokemons = null;
        $scope.isLoading = false;
        $scope.selectedPokemon = null;
        $scope.features = [];

        $scope.showDetailView = function(idx) {
            $scope.selectedPokemon = $scope.pokemons[idx];
            Object.keys(featuresMap).forEach(function(feature,i) {
                $scope.features[i] = {};
                $scope.features[i].title = featuresMap[feature];
                if(feature === 'types') {
                    $scope.features[i].value = $scope.selectedPokemon[feature].map(function(type) {
                        return type.name[0].toUpperCase() + type.name.slice(1);
                    }).join(', ');
                } else if(feature === 'moves') {
                    $scope.features[i].value = $scope.selectedPokemon[feature].length;
                } else {
                    $scope.features[i].value = $scope.selectedPokemon[feature];
                }
            });
        };

        $scope.loadPokemons = function() {
            $scope.isLoading = true;
            Pokemons.get({offset: $scope.pokemons.length}).$promise.then(function(data) {
                [].push.apply($scope.pokemons, data.objects);
                $scope.isLoading = false;
            });
        };

        function onInitialLoad() {
            $scope.initialLoad = true;
            Pokemons.get().$promise.then(function(data) {
                $scope.pokemons = data.objects;
                $scope.initialLoad = false;
            });
        }

        onInitialLoad();
    }

})();