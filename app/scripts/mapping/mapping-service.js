(function () {
    'use strict';

    /**
     * @ngInject
     */
    function MappingService ($http, MOSColors, MapColorService, CartoConfig) {
        var module = {};

        module.FILTER_NONE = 'All types';
        var table = CartoConfig.tables.currentYear;

        /*
         *  Builds sector legend data
         *
         *  @returns Object with properties for custom CartoDB sector legend
         */
        module.getSectorColors = function() {
            var sectors = [];
            angular.forEach(MOSColors, function(value, key) {
                sectors.push({'name': key, 'value': value});
            });
            return sectors;
        };

        /*
         *  Finds color for a given property sector
         *
         *  @param {string} sector Property sector field value from database
         *  @returns {string} Corresponding color value for display
         */
        module.findSectorColor = function(sector) {
            if (sector in MOSColors) {
                return MOSColors[sector];
            } else {
                // if color not found, use 'Unknown' color
                return MOSColors.Unknown;
            }
        };

        module.getLegendOptions = function(field) {
            return MapColorService.legendOptions(field);
        };

        /*
         *  Fetches list of building categories in use
         *
         *  @returns Promise with query results
         */
        module.getBldgCategories = function() {
            var qry = 'SELECT DISTINCT sector FROM {{tbl}};';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry, {tbl: table});
        };

        /*
         *  Fetches details for a selected property by row ID (cartodb_id)
         *
         *  @param {string} cartodbId Unique ID for record to search for
         *  @returns Promise with results in data.rows
         */
        module.featureLookup = function(cartodbId)  {
            var qry = 'SELECT cartodb_id, property_name, address, total_ghg, site_eui, ' + 
            'energy_star, sector FROM {{tbl}} where cartodb_id = {{id}}';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry, { id: cartodbId, tbl: table });
        };

        /*
         *  Fetches details for a selected property by its building ID.
         *  Used by search box.
         *
         *  @param {string} Building ID to search for
         *  @returns Promise with results in data.rows
         */
        module.featureLookupByBldgId = function(bldgId)  {
            var qry = 'SELECT cartodb_id, property_name, address, total_ghg, site_eui, ' + 
            'energy_star, sector, x, y FROM {{tbl}} where phl_bldg_id = \'{{bldgId}}\';';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry, { bldgId: bldgId, tbl: table});
        };

        /*
         *  Fetches all building IDs, for use in autocomplete
         *
         *  @returns Promise with results in data.rows
         */
        module.getBuildingIds = function() {
            var qry = 'SELECT DISTINCT phl_bldg_id FROM {{tbl}};';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry, {tbl: table});
        };

        /*
         *  Filter CartoDB visualization by sector
         *
         *  @param {Object} viz CartoDB visualization layer to filter
         *  @param {string} val Sector column value from database to filter on
         */
        module.filterViz = function(viz, val) {
            if (!viz) {
                console.error('cannot filter; there is no viz!');
                return;
            }
            if (val === module.FILTER_NONE) {
                viz.setSQL('SELECT * FROM ' + table + ';');
            } else {
                viz.setSQL('SELECT * FROM ' + table + ' WHERE sector =\'' + val + '\';');
            }
        };

        /*
         *  Set the CartoDB visualization CartoCSS styling
         *
         *  @param {Object} viz CartoDB visualization layer to style
         *  @param {string} colorByField Database field name used to style feature colors
         *  @param {string} sizeByField Database field name used to style feature bubble size
         */
        module.setVizCartoCSS = function(viz, colorByField, sizeByField) {
            if (!viz) {
                console.error('cannot change CartoCSS; there is no viz!');
                return;
            }
            var css = MapColorService.baseCartoCSS + ' ' +
                      MapColorService.getFieldCartoCSS(colorByField) + ' ' +
                      MapColorService.getFieldCartoCSS(sizeByField);

            viz.setCartoCSS(css);
        };

        /*
         * Geocode an address.  Docs here:
         * http://wiki.openstreetmap.org/wiki/Nominatim
         * 
         * @param {string} address One-line address string to geocode
         * @returns Promise with Nominatim search results
         */
        module.geocode = function(address) {            
            var url = 'http://nominatim.openstreetmap.org/search';
            // limit search to greater Philadelphia region
            var viewbox = '-75.699037,40.195219,-74.886736,39.774326';

            return $http.get(url, {
                params: {
                    'q': address,
                    'viewbox': viewbox,
                    'bounded': 1,
                    'addressdetails': 0,
                    'limit': 1,
                    'format': 'json'
                }
            });
        };

        return module;
    }

    angular.module('mos.mapping')

      .factory('MappingService', MappingService);

})();