(function () {
    'use strict';

    /* ngInject */
    function YearSelector() {
        var module = {
            replace: true,
            restrict: 'AE',
            scope: {
            },
            templateUrl: 'scripts/years/year-selector-partial.html',
            bindToController: true,
            controller: 'YearSelectorController',
            controllerAs: 'ctl'
        };
        return module;
    }

    angular.module('mos.years')
    .directive('mosYearSelector', YearSelector);

})();
