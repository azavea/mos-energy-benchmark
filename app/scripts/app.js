(function () {
'use strict';

    /**
     * ngInject
     */
    function StateConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }

    /**
     * @ngdoc overview
     * @name mos
     * @description
     * # mos
     *
     * Main module of the application.
     */
    angular
    .module('mos', [
        'mos.views.charts'
    ]).config(StateConfig);

})();