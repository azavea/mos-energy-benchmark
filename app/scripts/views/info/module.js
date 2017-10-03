(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('info', {
            parent: 'root',
            url: '/info',
            templateUrl: 'scripts/views/info/info-partial.html',
            controller: 'InfoController'
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
