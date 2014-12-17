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
            $scope.selectedY = 'totalemissions';
            $scope.selectOptions = {
                totalenergy: 'Total Energy Used',
                totalsqft: 'Total Sq Ft',
                totalemissions: 'Total Emissions',
                avgenergystar: 'Mean Energystar',
                count: 'Building count'
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
