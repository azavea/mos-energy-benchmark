(function () {
    'use strict';

    /*
     * ngInject
     */
    var DetailConfig = {
        fields: {
            'site_eui': 'EUI',
            'total_ghg': 'Emissions',
            'electricity': 'Electric Usage',
            'natural_gas': 'Natural Gas Usage',
            'fuel_oil': 'Oil Usage',
            'steam': 'Steam Usage',
            'water_use': 'Water Usage'
        },
        FILTER: {
            NONE: 'none',
            SECTOR: 'sector'
        }
    };

    /*
     * ngInject
     */
    function DetailController($scope, DetailConfig, MOSColors, buildingData, currentData) {

/* jshint laxbreak:true */
        var building = buildingData.data && buildingData.data.rows && buildingData.data.rows.length > 0
                        ? buildingData.data.rows[0] : {};
/* jshint laxbreak:false */
        var sectorColor = MOSColors[building.sector];
        var rows = currentData.data.rows;

        $scope.building = building;
        $scope.fields = DetailConfig.fields;
        $scope.currentData = rows;
        $scope.filterField = 'sector';
        $scope.calloutColors = [sectorColor];
        $scope.FILTER = DetailConfig.FILTER;
        $scope.dropdownText = {};
        $scope.dropdownText[DetailConfig.FILTER.NONE] = 'All Buildings';
        $scope.dropdownText[DetailConfig.FILTER.SECTOR] = 'Similar Building Types';

        $scope.filterButtonText = $scope.dropdownText[DetailConfig.FILTER.NONE];
        $scope.headerColor = {
            'background-color': sectorColor,
            opacity: 0.8
        };

        $scope.filterBy = function (filter) {
            if (filter === DetailConfig.FILTER.SECTOR) {
                $scope.currentData = _.filter(rows, function (row) {
                    return row.sector === building.sector;
                });
            } else {
                $scope.currentData = rows;
            }
            $scope.filterButtonText = $scope.dropdownText[filter];
        };
    }

    angular.module('mos.views.detail')
    .constant('DetailConfig', DetailConfig)
    .controller('DetailController', DetailController);

})();
