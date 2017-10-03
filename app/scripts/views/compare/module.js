(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('compare', {
            parent: 'root',
            url: '/compare?ids',
            templateUrl: 'scripts/views/compare/compare-partial.html',
            controller: 'CompareController',

            resolve: /* ngInject */ {
                buildingData: ['yearData', '$stateParams', 'CartoSQLAPI',
                    function (yearData, $stateParams, CartoSQLAPI) {

                    CartoSQLAPI.setYears(yearData);

                    var ids = $stateParams.ids.split(',').slice(0, 3);
                    return CartoSQLAPI.getBuildingData(ids);
                }],
                currentData: ['yearData', 'CartoSQLAPI',
                    function (yearData, CartoSQLAPI) {

                    CartoSQLAPI.setYears(yearData);
                    return CartoSQLAPI.getAllCurrentData();
                }]
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
      .module('mos.views.compare', [
        'ui.router',
        'mos.cartodb',
        'mos.root',
        'mos.compare',
        'mos.charting'
      ]).config(StateConfig);

})();
