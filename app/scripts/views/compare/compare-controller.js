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
    function CompareController($location, $scope, BuildingCompare, CartoSQLAPI, CompareConfig,
                               MOSCSSValues, buildingData, currentData) {

        var year = CartoSQLAPI.getCurrentYear();

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
        /*jshint camelcase: false */
        $scope.buildingNames = _.map($scope.buildings, 'property_name');
        /*jshint camelcase: true */
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
            /*jshint camelcase: false */
            var cartodbId = $scope.buildings[index].cartodb_id.toString();
            /*jshint camelcase: true */
            BuildingCompare.remove(cartodbId);
            $scope.buildings.splice(index, 1);
            $scope.buildingNames.splice(index, 1);
            $scope.calloutValues = setCalloutValues($scope.buildings, CompareConfig.fields);

            // update URL to remove building ID
            var urlIds = $location.search().ids;
            if (urlIds) {
                urlIds = urlIds.split(',');
                var idx = _.indexOf(urlIds, cartodbId);
                if (idx > -1) {
                    urlIds.splice(idx, 1);
                    $location.search('ids', urlIds.join(','));
                }
            }
        };
    }

    angular.module('mos.views.compare')
    .constant('CompareConfig', CompareConfig)
    .controller('CompareController', CompareController);

})();
