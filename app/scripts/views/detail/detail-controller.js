(function () {
    'use strict';

    /*
     * ngInject
     */
    var DetailConfig = {
        fields: [
            'site_eui',
            'total_ghg',
            'electricity',
            'natural_gas',
            'fuel_oil',
            'steam',
            'water_use'
        ],
        FILTER: {
            NONE: 'none',
            SECTOR: 'sector'
        }
    };

    /*
     * ngInject
     */
    function DetailController($scope, CartoConfig, DetailConfig, MOSColors, MOSCSSValues,
                              buildingData, currentData) {

/* jshint laxbreak:true */
        var building = buildingData.data && buildingData.data.rows && buildingData.data.rows.length > 0
                        ? buildingData.data.rows[0] : {};
/* jshint laxbreak:false */
        var sectorColor = MOSColors[building.sector] || MOSColors.Unknown;
        var rows = currentData.data.rows;

        // Note: this page is intentionally not affected by the year toggle
        $scope.years = CartoConfig.years;
        $scope.yearsAscending = CartoConfig.years.slice().sort();
        $scope.building = building;
        $scope.fields = DetailConfig.fields;
        $scope.currentData = rows;
        $scope.cssValues = MOSCSSValues;
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

        // Returns an array of callout values for the given key
        $scope.getCalloutValues = function (key) {
            return _.map($scope.years, function(year) {
                return building[key + '_' + year];
            });
        };
    }

    angular.module('mos.views.detail')
    .constant('DetailConfig', DetailConfig)
    .controller('DetailController', DetailController);

})();
