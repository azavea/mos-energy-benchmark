(function () {
    'use strict';

    /*
     * ngInject
     */
    function DataDownloadController($scope, CartoSQLAPI) {
        var ctl = this;
        ctl.years = CartoSQLAPI.allYears;
        ctl.yearsData = CartoSQLAPI.yearsData();

        // Update years values and download links after they have been loaded from Carto
        $scope.$on('mos.cartodb:years', function() {
            ctl.years = CartoSQLAPI.allYears;
            ctl.yearsData = CartoSQLAPI.yearsData();
        });

    }

    angular.module('mos.years')
    .controller('DataDownloadController', DataDownloadController);

})();
