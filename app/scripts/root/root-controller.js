(function () {
    'use strict';

    /*
     * ngInject
     */
    function RootController(CartoSQLAPI, yearData) {

        console.log('in root controller with yearData:');
        console.log(yearData);

        CartoSQLAPI.setYears(yearData);

    }

    angular.module('mos.root')
    .controller('RootController', RootController);

})();
