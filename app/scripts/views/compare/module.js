(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('compare', {
            url: '/compare',
            templateUrl: 'scripts/views/compare/compare-partial.html',
            controller: 'CompareController'
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
        'ui.router'
      ]).config(StateConfig);

})();