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
            return parseInt($location.search().year, 10) || DEFAULT_YEAR;
        }
    }

    angular.module('mos.years')
      .factory('YearService', YearService);
})();
