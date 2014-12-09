(function () {
    'use strict';

    /*
     * ngInject
     */
    var DetailConfig = {
        fields: {
            'electricity': 'Electricity',
            'site_eui': 'EUI',
            'total_ghg': 'Greenhouse Emissions',
            'water_use': 'Water Use',
            'natural_gas': 'Natural Gas'
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
        console.log(building);
        $scope.building = building;
        $scope.fields = DetailConfig.fields;
    }

    angular.module('mos.views.detail')
    .constant('DetailConfig', DetailConfig)
    .controller('DetailController', DetailController);

})();
