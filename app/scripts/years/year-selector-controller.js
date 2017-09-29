(function () {
    'use strict';

    /*
     * ngInject
     */
    function YearSelectorController($location, $window, CartoConfig) {
        var ctl = this;
        ctl.currentYear = CartoConfig.getCurrentYear();
        ctl.years = CartoConfig.years;
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
