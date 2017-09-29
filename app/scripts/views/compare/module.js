(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('compare', {
            url: '/compare?ids',
            templateUrl: 'scripts/views/compare/compare-partial.html',
            controller: 'CompareController',
            resolve: {
                buildingData: function ($stateParams, CartoSQLAPI) {
                    var ids = $stateParams.ids.split(',').slice(0, 3);
                    return CartoSQLAPI.getBuildingData(ids);
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
      .module('mos.views.compare', [
        'ui.router',
        'mos.cartodb',
        'mos.compare',
        'mos.charting'
      ]).config(StateConfig);

})();
