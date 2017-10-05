(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('map', {
            parent: 'root',
            url: '/map?year',
            templateUrl: 'scripts/views/map/map-partial.html',
            controller: 'MapController'
        });
    }

    /**
     * @ngdoc overview
     * @name mos.views
     * @description
     * # mos
     */
    angular
      .module('mos.views.map', [
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'mos.cartodb',
        'mos.root',
        'mos.compare',
        'mos.colors',
        'mos.mapping'
      ]).config(StateConfig);

})();
