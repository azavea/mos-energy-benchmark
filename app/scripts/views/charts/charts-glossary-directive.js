(function () {
    'use strict';

    /**
     * ngInject
     */
    function chartsGlossary (Utils) {
        // Begin directive module definition
        var module = {};

        module.scope = {
            page: '@'
        };

        module.restrict = 'EA';
        module.templateUrl = 'scripts/views/charts/charts-glossary-partial.html',

        module.link = function ($scope, element, attrs) {
            var page = $scope.page;
            if (page === 'charts') {
                // Don't show the glossary on the initial panel
                element.hide();

                $scope.$on('header:on-not-top', function (event) {
                    element.show();
                });

                $scope.$on('header:on-top', function (event) {
                    element.hide();
                });
            }
        };

        return module;
    }

    angular.module('mos.charting')
    .directive('mosChartsGlossary', chartsGlossary);

})();
