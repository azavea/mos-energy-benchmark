(function () {
    'use strict';

    /**
     * @ngInject
     */
    function MappingService (MOSColors) {
        var module = {};

        module.FILTER_NONE = 'All types';

        module.getLegend = function() {
            angular.forEach(MOSColors, function(value, key) {
                console.log(key);
                console.log(value);
            });
        };

        /*
         *  Fetches list of building categories in use
         *
         *  @returns Promise with query results
         */
        module.getBldgCategories = function() {
            var qry = 'SELECT DISTINCT sector FROM mos_beb_2013;';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry);
        };

        /*
         *  Fetches details for a selected property
         *
         * @param {string} cartodbId Unique ID for record to search for
         * @returns Promise with results in data.rows
         */
        module.featureLookup = function(cartodbId)  {
            /* jshint camelcase: false */
            var qry = 'SELECT cartodb_id, geocode_address, total_ghg, property_name, ' + 
            'sector FROM mos_beb_2013 where cartodb_id = {{id}}';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry, { id: cartodbId});
            /* jshint camelcase:true */
        };

        module.filterViz = function(viz, val) {
            if (!viz) {
                console.error('cannot filter; there is no viz!');
                return;
            }
            if (val === module.FILTER_NONE) {
                viz.setSQL('select * from mos_beb_2013');
            } else {
                viz.setSQL('select * from mos_beb_2013 where primary_property_type =\'' + val + '\';');
            }
        };

        return module;
    }

    angular.module('mos.mapping')

      .factory('MappingService', MappingService);

})();