(function () {
    'use strict';

    var COOKIE_STRING_SLIDE_CALLOUT = 'mos.charts.slideCallout.hide';

    /*
     * ngInject
     */
    function ChartsController($scope, $cookieStore, $q, CartoSQLAPI) {
        // Initialize
        $scope.loadingView = true;
        $scope.currentData = [];
        $scope.currentAllData = [];
        $scope.groupedData = [];

        $scope.hideCallout = $cookieStore.get(COOKIE_STRING_SLIDE_CALLOUT) || false;

        $scope.calloutClicked = function () {
            var hide = true;
            $cookieStore.put(COOKIE_STRING_SLIDE_CALLOUT, hide);
            $scope.hideCallout = hide;
        };

        var init = function () {
            var getCurrentAll = CartoSQLAPI.getAllCurrentData().then(function(data) {
                $scope.currentAllData = data.data.rows;
            });

            var getGrouped = CartoSQLAPI.getGroupedData().then(function(data) {
                $scope.groupedData = data.data.rows;
            });

            var all = $q.all([getCurrentAll, getGrouped]);

            // fetch all needed chart data when controller loads
            all.then(function() {
                $scope.currentData = CartoSQLAPI.getCurrentData($scope.currentAllData);
                $scope.loadingView = false;
            });
        };

        init();
    }

    angular.module('mos.views.charts')
    .controller('ChartsController', ChartsController);

})();
