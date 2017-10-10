(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('info', {
            parent: 'root',
            url: '/info?year',
            templateUrl: 'scripts/views/info/info-partial.html',
            controller: 'InfoController',
            resolve: /* ngInject */ {
                infoData: ['yearData', '$stateParams', 'CartoSQLAPI',
                    function (yearData, $stateParams, CartoSQLAPI) {

                    CartoSQLAPI.setYears(yearData);
                    return CartoSQLAPI.getInfoData().then(function(data) {
                        return CartoSQLAPI.getInfo(data.data.rows);
                    });
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
      .module('mos.views.info', [
        'ui.router',
        'mos.cartodb',
        'mos.root'
      ]).config(StateConfig);

})();
