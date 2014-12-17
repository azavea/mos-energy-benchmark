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
            $scope.selectedY = 'totalenergy';
            $scope.selectOptions = {
                totalenergy: 'Total Energy Used',
                totalemissions: 'Total Emissions',
                count: 'Building count',
                avgenergystar: 'Mean Energystar'
            };
            $scope.selectUnits = {
                totalenergy: 'BTUs',
                totalsqft: 'Sq Ft',
                totalemissions: '',
                avgenergystar: '',
                count: ''
            };
            $scope.selectedYChanged = function(key) {
                $scope.selectedY = key;
            };
        };

        return module;
    }

    angular.module('mos.charting')
        .directive('mosBarview', barView);

})();
