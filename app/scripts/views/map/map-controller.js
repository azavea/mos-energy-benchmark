(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($scope) {
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false
            }
        });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();