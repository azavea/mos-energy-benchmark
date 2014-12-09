(function () {
    'use strict';

    /**
     * @ngInject
     */
    function MappingService () {
        var module = {};

        module.FILTER_NONE = 'All types';

        // TODO: show additional legend of property type with its sector color if color by property type selected
        /*
        var sectorColors = {
            'School  (K-12)': '#A6CEE3',
            'Office': '#1F78B4',
            'Warehouse': '#B2DF8A',
            'College/ University': '#33A02C',
            'Other': '#FB9A99',
            'Retail': '#E31A1C',
            'Municipal': '#FDBF6F',
            'Multifamily': '#FF7F00',
            'Hotel': '#CAB2D6',
            'Industrial': '#6A3D9A',
            '': '#DDDDDD'
        };
        */

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