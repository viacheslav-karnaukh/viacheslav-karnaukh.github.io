(function() {
    'use strict';

    angular
        .module('pokedexApp')
        .filter('formatID', [formatID]);

    function formatID() {
        return function(id) {
            if(id) {
                id = String(id);
                var transformedIds = ['', '#00' + id, '#0' + id];
                return id.length < 3 ? transformedIds[id.length] : '#' + id;
            }
        };
    }
})();