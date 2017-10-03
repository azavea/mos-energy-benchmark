(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('detail', {
            parent: 'root',
            url: '/detail/:buildingId',
            templateUrl: 'scripts/views/detail/detail-partial.html',
            controller: 'DetailController',
            resolve: /* ngInject */ {
                buildingData: ['yearData', '$stateParams', 'CartoSQLAPI',
                    function (yearData, $stateParams, CartoSQLAPI) {

                    CartoSQLAPI.setYears(yearData);
                    return CartoSQLAPI.getBuildingData($stateParams.buildingId);
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
      .module('mos.views.detail', [
        'ui.router',
        'mos.cartodb',
        'mos.root',
        'mos.charting'
      ]).config(StateConfig);

})();
