(function () {
    'use strict';

    /*
     * ngInject
     */
    function ChartsController($scope, CartoSQLAPI, ChartingUtils, currentData, currentAllData, groupedData, previousData) {
        $scope.currentData = currentData.data.rows;
        $scope.currentAllData = currentAllData.data.rows;
        $scope.groupedData = groupedData.data.rows;
        $scope.combinedData = CartoSQLAPI.getCombinedData(currentData.data, previousData.data);
        $scope.seedData = ChartingUtils.seed(20);
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();
