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

        // Force headroom and panel-snap play nicely together
        initHeader();
    }

    // The panel snap logic on the charts page needs to use an
    // alternate element for scroll events. This conflicts with
    // Headroom, and it must be manually initialized.
    function initHeader() {
        var header = $('.header')[0];
        var scroller = $('.panel-snap-container')[0];
        var options = {
            offset: 120,
            scroller: scroller
        };

        // The undefined check is so this doesn't fail in unit tests
        if (typeof Headroom !== 'undefined') {
            var headroom = new Headroom(header, options);
            headroom.init();
        }
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();
