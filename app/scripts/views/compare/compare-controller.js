(function () {
    'use strict';

    var CompareConfig = {
        fields: [
            'energy_star',
            'site_eui',
            'total_ghg',
            'electricity',
            'natural_gas',
            'fuel_oil',
            'steam',
            'water_use'
        ]
    };

    /*
     * ngInject
     */
    function CompareController($scope, BuildingCompare, CompareConfig, MOSCSSValues, YearService,
                               buildingData, currentData) {

        var year = YearService.getCurrentYear();

        var setCalloutValues = function (data, fields) {
            var calloutValues = {};
            angular.forEach(fields, function (key) {
                calloutValues[key] = [];
                for (var i = 0; i < data.length; i++) {
                    calloutValues[key].push(data[i][key + '_' + year]);
                }
            });

            return calloutValues;
        };

        $scope.year = year;
        $scope.buildings = buildingData.data.rows;
        $scope.fields = CompareConfig.fields;
        $scope.currentData = currentData.data.rows;
        $scope.cssValues = MOSCSSValues;
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
