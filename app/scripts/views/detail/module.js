(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('detail', {
            url: '/detail/:buildingId',
            templateUrl: 'scripts/views/detail/detail-partial.html',
            controller: 'DetailController',
            resolve: /* ngInject */ {
                buildingData: function ($stateParams, CartoSQLAPI) {
                    return CartoSQLAPI.getBuildingData($stateParams.buildingId);
                },
                currentData: function (CartoSQLAPI) {
                    return CartoSQLAPI.getAllCurrentData();
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
      .module('mos.views.detail', [
        'ui.router',
        'mos.cartodb',
        'mos.charting'
      ]).config(StateConfig);

})();
