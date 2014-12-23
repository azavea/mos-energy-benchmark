(function () {
    'use strict';

    var COOKIE_STRING_SLIDE_CALLOUT = 'mos.charts.slideCallout.hide';

    /*
     * ngInject
     */
    function ChartsController($cookieStore, $scope, CartoSQLAPI, ChartingUtils, currentData, currentAllData, groupedData, previousData) {
        $scope.currentData = currentData.data.rows;
        $scope.currentAllData = currentAllData.data.rows;
        $scope.groupedData = groupedData.data.rows;
        $scope.combinedData = CartoSQLAPI.getCombinedData(currentData.data, previousData.data);
        $scope.seedData = ChartingUtils.seed(20);

        $scope.hideCallout = $cookieStore.get(COOKIE_STRING_SLIDE_CALLOUT) || false;

        $scope.calloutClicked = function () {
            var hide = true;
            $cookieStore.put(COOKIE_STRING_SLIDE_CALLOUT, hide);
            $scope.hideCallout = hide;
        };
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();
