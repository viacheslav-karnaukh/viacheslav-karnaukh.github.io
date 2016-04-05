(function() {
    'use strict';

    angular
        .module('pokedexApp')
        .factory('Pokemons', ['$resource', Pokemons]);

    function Pokemons($resource) {
        return $resource('http://pokeapi.co/api/v1/pokemon/:id', {limit: 12});        
    }
    
})();