(function () {
    'use strict';

    /**
     * ngInject
     */
    function NumberFilter($filter) {
        return function (value, decimal) {
            value = parseFloat(value);
            return isNaN(value) ? 'N/A' : $filter('number')(value, decimal);
        };
    }

    angular.module('mos.cartodb')
    .filter('cartodbNumber', NumberFilter);
})();
