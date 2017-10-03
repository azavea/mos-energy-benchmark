(function () {
    'use strict';

    /* ngInject */
    function HeaderBar() {
        var module = {
            replace: true,
            restrict: 'AE',
            scope: {
            },
            templateUrl: 'scripts/headerbar/headerbar-partial.html',
            bindToController: true,
            controller: 'HeaderBarController',
            controllerAs: 'ctl'
        };
        return module;
    }

    angular.module('mos.headerbar')
    .directive('mosHeaderbar', HeaderBar);

})();
