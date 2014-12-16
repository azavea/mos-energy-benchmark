(function () {
    'use strict';

    /**
     * ngInject
     */
    function barView () {
        // Begin directive module definition
        var module = {};

        module.restrict = 'EA';
        module.templateUrl = 'scripts/views/charts/barview-partial.html';

        module.scope = {
            data: '=' // Required
        };

        module.link = function($scope, element, attrs) {
            $scope.selectedY = 'avgsqft';
            $scope.selectOptions = {
                'avgsqft': 'Mean Sq Ft',
                'avgeui': 'Mean EUI',
                'avgemissions': 'Mean Emissions',
                'avgenergystar': 'Mean Energystar'
            };
            $scope.selectedYChanged = function(key) {
                $scope.selectedY = key;
            };
            $scope.test = 'blah!';
        };

        return module;
    }

    angular.module('mos.charting')
        .directive('mosBarview', barView);

})();
