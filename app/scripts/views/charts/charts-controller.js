(function () {
    'use strict';

    /*
     * ngInject
     */
    function ChartsController($scope, $q, CartoSQLAPI, ChartingUtils) {
        // Initialize
        $scope.loadingView = true;
        var previousData = null;
        $scope.currentData = null;
        $scope.currentAllData = null;
        $scope.groupedData = null;

        var getCurrent = CartoSQLAPI.getCurrentData().then(function(data) {
            $scope.currentData = data.data.rows;
            console.log('got current data!');
        });

        var getPrevious = CartoSQLAPI.getPreviousData().then(function(data) {
            previousData = data.data.rows;
            console.log('got previous data!');
        });

        var getCurrentAll = CartoSQLAPI.getAllCurrentData().then(function(data) {
            $scope.currentAllData = data.data.rows;
            console.log('got current all data!');
        });

        var getGrouped = CartoSQLAPI.getGroupedData().then(function(data) {
            $scope.groupedData = data.data.rows;
            console.log('got grouped data!');
        });

        var all = $q.all([getCurrent, getPrevious, getCurrentAll, getGrouped]);

        all.then(function() {
            $scope.combinedData = CartoSQLAPI.getCombinedData($scope.currentData, previousData);
            $scope.seedData = ChartingUtils.seed(20);
            $scope.loadingView = false;
        });
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();
