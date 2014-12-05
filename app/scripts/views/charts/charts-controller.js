(function () {
    'use strict';

    /*
     * ngInject
     */
    function ChartsController($scope, CartoSQLAPI, ChartingUtils, currentData, groupedData, previousData) {
        $scope.currentData = currentData.data.rows;
        $scope.groupedData = groupedData.data.rows;
        $scope.combinedData = CartoSQLAPI.getCombinedData(currentData.data, previousData.data);
        $scope.seedData = ChartingUtils.seed(20);
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();