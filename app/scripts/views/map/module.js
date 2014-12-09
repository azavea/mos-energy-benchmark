(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('map', {
            url: '/map',
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
        'ui.router',
        'ui.bootstrap',
        'mos.compare',
        'mos.mapping'
      ]).config(StateConfig);

})();