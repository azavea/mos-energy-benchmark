(function () {
    'use strict';

    /*
     * Controller for abstract app root to load years data from Carto.
     *
     * ngInject
     */
    function RootController(CartoSQLAPI, yearData) {

        CartoSQLAPI.setYears(yearData);

    }

    angular.module('mos.root')
    .controller('RootController', RootController);

})();
