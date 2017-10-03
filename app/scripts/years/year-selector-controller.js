(function () {
    'use strict';

    /*
     * ngInject
     */
    function YearSelectorController($location, $scope, $window, CartoSQLAPI) {
        var ctl = this;
        ctl.currentYear = CartoSQLAPI.getCurrentYear();
        ctl.years = CartoSQLAPI.years;
        ctl.updateYear = updateYear;

        // Updates the current year
        function updateYear(year) {
            $location.search('year', year);
            $window.location.reload();
        }

        // Update years values after they have been loaded from Carto
        $scope.$on('mos.cartodb:years', function(event, data) {
            ctl.years = data;
            ctl.currentYear = CartoSQLAPI.getCurrentYear();
        });
    }

    angular.module('mos.years')
    .controller('YearSelectorController', YearSelectorController);

})();
