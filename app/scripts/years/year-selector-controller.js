(function () {
    'use strict';

    /*
     * ngInject
     */
    function YearSelectorController($location, $window, YearService) {
        var ctl = this;
        ctl.currentYear = YearService.getCurrentYear();
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
