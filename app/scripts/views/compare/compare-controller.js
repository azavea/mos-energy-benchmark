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
    function CompareController($scope, BuildingCompare, CompareConfig, buildingData, currentData) {

        var setCalloutValues = function (data, fields) {
            var calloutValues = {};
            angular.forEach(fields, function (readable, key) {
                calloutValues[key] = [];
                for (var i = 0; i < data.length; i++) {
                    calloutValues[key].push(data[i][key]);
                }
            });

            return calloutValues;
        };

        $scope.buildings = buildingData.data.rows;
        $scope.fields = CompareConfig.fields;
        $scope.currentData = currentData.data.rows;
        $scope.calloutColors = [
            '#8FBD84',
            '#81ABCC',
            '#DD8180'
        ];
        $scope.calloutValues = setCalloutValues($scope.buildings, CompareConfig.fields);

        $scope.close = function (index) {
            var cartodbId = $scope.buildings[index].cartodb_id;
            BuildingCompare.remove(cartodbId.toString());
            $scope.buildings.splice(index, 1);
            $scope.calloutValues = setCalloutValues($scope.buildings, CompareConfig.fields);
        };
    }

    angular.module('mos.views.compare')
    .constant('CompareConfig', CompareConfig)
    .controller('CompareController', CompareController);

})();
