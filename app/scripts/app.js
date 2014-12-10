(function () {
'use strict';

    /**
     * ngInject
     */
    function StateConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }

    // color ramp for sectors

    var sectorColors = {
        'School  (K-12)': '#A6CEE3',
        'Office': '#1F78B4',
        'Warehouse': '#B2DF8A',
        'College/ University': '#33A02C',
        'Other': '#FB9A99',
        'Retail': '#E31A1C',
        'Municipal': '#FDBF6F',
        'Multifamily': '#FF7F00',
        'Hotel': '#CAB2D6',
        'Industrial': '#6A3D9A',
        'Unknown': '#DDDDDD'
    };

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
        'mos.views.charts',
        'mos.views.map',
        'mos.views.info',
        'mos.views.detail',
        'mos.views.compare',
        'headroom'
    ]).config(StateConfig);

    angular.module('mos').constant('MOSColors', sectorColors);

})();
