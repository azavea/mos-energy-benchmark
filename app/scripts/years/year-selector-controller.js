(function () {
    'use strict';

    /*
     * ngInject
     */
    function YearSelectorController($location, $window, CartoSQLAPI) {
        var ctl = this;
        ctl.currentYear = CartoSQLAPI.getCurrentYear();
        ctl.years = CartoSQLAPI.years;
        ctl.updateYear = updateYear;

        // Updates the current year
        function updateYear(year) {
            $location.search('year', year);
            $window.location.reload();
        }
    }

    angular.module('mos.years')
    .controller('YearSelectorController', YearSelectorController);

})();
