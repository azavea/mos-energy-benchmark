(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('charts', {
            url: '/',
            templateUrl: 'scripts/views/charts/charts-partial.html',
            controller: 'ChartsController',
            resolve: /*@ngInject*/ {
                currentData: function (CartoSQLAPI) {
                    return CartoSQLAPI.getCurrentData();
                },
                groupedData: function (CartoSQLAPI) {
                    return CartoSQLAPI.getGroupedData();
                },
                previousData: function (CartoSQLAPI) {
                    return CartoSQLAPI.getPreviousData();
                }
            }
        });
    }

    /**
     * @ngdoc overview
     * @name mos.views
     * @description
     * # mos
     */
    angular
      .module('mos.views.charts', [
        'ui.router',
        'smoothScroll',
        'mos.cartodb',
        'mos.charting'
      ]).config(StateConfig);

})();