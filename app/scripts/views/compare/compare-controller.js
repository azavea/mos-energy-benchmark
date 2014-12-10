(function () {
    'use strict';

    var CompareConfig = {
        fields: {
            'energy_star': 'Energy Star Score',
            'site_eui': 'EUI',
            'total_ghg': 'Emissions',
            'electricity': 'Electric Usage',
            'natural_gas': 'Natural Gas Usage',
            'fuel_oil': 'Oil Usage',
            'steam': 'Steam Usage',
            'water_use': 'Water Usage'
        }
    };

    /*
     * ngInject
     */
    function CompareController($scope, BuildingCompare, CompareConfig, buildingData) {
        $scope.buildings = buildingData.data.rows;
        $scope.fields = CompareConfig.fields;

        $scope.close = function (index) {
            var cartodbId = $scope.buildings[index].cartodb_id;
            BuildingCompare.remove(cartodbId.toString());
            $scope.buildings.splice(index, 1);
        };
    }

    angular.module('mos.views.compare')
    .constant('CompareConfig', CompareConfig)
    .controller('CompareController', CompareController);

})();
