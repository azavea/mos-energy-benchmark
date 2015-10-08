(function () {
    'use strict';

    /*
     * ngInject
     */
    function YearService ($location) {
        var module = {};

        // Available years -- must match up to visualization subLayer order
        module.years = [2014, 2013];
        module.getCurrentYear = getCurrentYear;

        return module;

        // Returns the currently-selected year
        function getCurrentYear() {
            var selected = parseInt($location.search().year, 10);
            return module.years.indexOf(selected) >= 0 ? selected : module.years[0];
        }
    }

    angular.module('mos.years')
      .factory('YearService', YearService);
})();
