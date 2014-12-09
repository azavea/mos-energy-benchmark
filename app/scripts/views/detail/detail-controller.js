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
        }
    };

    /*
     * ngInject
     */
    function DetailController($scope, DetailConfig, buildingData) {

/* jshint laxbreak:true */
        var building = buildingData.data && buildingData.data.rows && buildingData.data.rows.length > 0
                        ? buildingData.data.rows[0] : {};
/* jshint laxbreak:false */
        $scope.building = building;
        $scope.fields = DetailConfig.fields;
    }

    angular.module('mos.views.detail')
    .constant('DetailConfig', DetailConfig)
    .controller('DetailController', DetailController);

})();
