(function () {
    'use strict';

    /*
     * ngInject
     */
    function YearService ($location) {
        var module = {};
        var DEFAULT_YEAR = 2014;

        module.getCurrentYear = getCurrentYear;

        return module;

        // Returns the currently-selected year
        function getCurrentYear() {
            return $location.search().year || DEFAULT_YEAR;
        }
    }

    angular.module('mos.years')
      .factory('YearService', YearService);
})();
