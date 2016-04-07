(function() {
    'use strict';

    angular
        .module('pokedexApp')
        .filter('formatID', [formatID]);

    function formatID() {
        return function(id) {
            id = String(id);
            return id.length < 3 ? ['', '#00' + id, '#0' + id][id.length] : '#' + id;
        };
    }
})();
