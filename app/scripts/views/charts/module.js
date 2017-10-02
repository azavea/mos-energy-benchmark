(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('charts', {
            parent: 'root',
            url: '/',
            templateUrl: 'scripts/views/charts/charts-partial.html',
            controller: 'ChartsController'
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
        'mos.cartodb',
        'mos.root',
        'mos.charting',
        'mos.utils'
      ]).config(StateConfig);

})();
