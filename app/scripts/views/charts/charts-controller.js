(function () {
    'use strict';

    /*
     * ngInject
     */
    function ChartsController($scope, currentData) {
        $scope.currentData = currentData.data.rows;
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();