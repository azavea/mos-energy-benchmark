(function () {
    'use strict';

    /**
     * @ngInject
     */
    function MappingService () {
        var module = {};

        module.FILTER_NONE = 'All types';
        var buildingTypes = [{'primary_property_type': module.FILTER_NONE}];

        /*
         *  Fetches list of building categories in use
         *
         *  @ return array of objects, each with primary_property_type attribute
         */
        module.getBldgCategories = function() {
            if (buildingTypes.size > 1) {
                console.log('already fetched building types');
                return buildingTypes;
            }
            var qry = 'SELECT DISTINCT primary_property_type FROM mos_beb_2013;';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            sql.execute(qry)
                .done(function(data) {
                    buildingTypes = [{'primary_property_type': module.FILTER_NONE}];
                    buildingTypes = buildingTypes.concat(data.rows);
                    return buildingTypes;
                }).error(function(errors) {
                    // returns a list
                    console.error('errors fetching property types: ' + errors);
                    return [{'primary_property_type': module.FILTER_NONE}];
                });
        };

        return module;
    }

    angular.module('mos.mapping')

      .factory('MappingService', MappingService);

})();