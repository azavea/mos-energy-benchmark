(function () {
    'use strict';

    var logData = function (data) {
        console.log(data);
    };

    /*
     * ngInject
     */
    function ChartsController($scope, CartoConfig, CartoSQLAPI) {
        CartoSQLAPI.getCurrentData().then(logData);
        CartoSQLAPI.getPreviousData().then(logData);
        CartoSQLAPI.getGroupedData().then(logData);
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();