(function () {
    'use strict';

    /*
     * ngInject
     */
    function ChartsController($scope, ChartingUtils, currentData) {
        $scope.currentData = currentData.data.rows;
        $scope.seedData = ChartingUtils.seed(20);
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();