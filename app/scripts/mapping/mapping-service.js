(function () {
    'use strict';

    /**
     * @ngInject
     */
    function MappingService () {
        var module = {};

        module.FILTER_NONE = 'All types';
        var buildingTypes = [{'primary_property_type': module.FILTER_NONE}];

        // TODO: show additional legend of property type with its sector color if color by property type selected
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

        /*
         *  Fetches list of building categories in use
         *
         *  @param {function} callback Function to send the returned array
         */
        module.getBldgCategories = function(callback) {
            if (buildingTypes.size > 1) {
                callback(buildingTypes);
            }
            var qry = 'SELECT DISTINCT primary_property_type FROM mos_beb_2013 ORDER BY sector;';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            sql.execute(qry)
                .done(function(data) {
                    buildingTypes = [{'primary_property_type': module.FILTER_NONE}];
                    buildingTypes = buildingTypes.concat(data.rows);
                    callback(buildingTypes);
                }).error(function(errors) {
                    // returns a list
                    console.error('errors fetching property types: ' + errors);
                    buildingTypes = [{'primary_property_type': module.FILTER_NONE}];
                    callback(buildingTypes);
                });
        };

        /*
         *  Fetches details for a selected property
         *
         * @param {function} callback Function to call with results
         * @param {string} cartodbId Unique ID for record to search for
         * @param {Leaflet.LatLng} coords Clicked point at which to show the popup
         */
        module.featureLookup = function(callback, cartodbId, coords)  {
            /* jshint camelcase: false */
            var qry = 'SELECT cartodb_id, geocode_address, total_ghg, property_name ' + 
            'FROM mos_beb_2013 where cartodb_id = {{id}}';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            sql.execute(qry, { id: cartodbId})
                .done(function(data) {
                    callback(data.rows[0], coords);
                }).error(function(errors) {
                    // returns a list
                    console.error('errors fetching property data: ' + errors);
                    callback(null, coords);
                });
            /* jshint camelcase:true */
        };

        module.filterViz = function(viz, val) {
            if (!viz) {
                console.error('cannot filter; there is no viz!');
                return;
            }
            if ($scope.filterType === module.FILTER_NONE) {
                viz.setSQL('select * from mos_beb_2013');
            } else {
                viz.setSQL("select * from mos_beb_2013 where primary_property_type ='" + val + "';");
            }
        };

        return module;
    }

    angular.module('mos.mapping')

      .factory('MappingService', MappingService);

})();