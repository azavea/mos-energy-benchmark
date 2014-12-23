(function () {
    'use strict';

    /**
     * @ngInject
     */
    function MappingService ($http, $q, ColorService, CartoConfig) {

        var viewbox = '-75.699037,40.195219,-74.886736,39.774326';
        var buildingIds = [];
        var module = {};

        module.FILTER_NONE = 'All types';
        var table = CartoConfig.tables.currentYear;

        var searchBuildingIds = function (buildingId) {
            return _.filter(buildingIds, function (id) {
                return id.indexOf(buildingId) !== -1;
            });
        };

        /*
         *  Fetches list of building categories in use
         *
         *  @returns Promise with query results
         */
        module.getBldgCategories = function() {
            var qry = 'SELECT DISTINCT sector FROM {{tbl}} order by sector;';
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
            var qry = 'SELECT cartodb_id, phl_bldg_id, property_name, address, floor_area, total_ghg, site_eui, ' +
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
            var css = ColorService.baseCartoCSS + ' ' +
                      ColorService.getFieldCartoCSS(colorByField) + ' ' +
                      ColorService.getFieldCartoCSS(sizeByField);

            viz.setCartoCSS(css);
        };

        /*
         * Geocode an address.
         */
        module.geocode = function(address) {

            var dfd = $q.defer();
            var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find';
            // limit search to greater Philadelphia region

            $http.get(url, {
                params: {
                    'text': address,
                    'bbox': viewbox,
                    'category': 'Address,Postal',
                    'outFields': 'StAddr,City,Postal',
                    'maxLocations': 1,
                    'f': 'pjson'
                }
            }).then(function (data) {
                dfd.resolve(data.data.locations);
            }, function () {
                dfd.resolve([]);
            });
            return dfd.promise;
        };

        /*
         * Suggest an address or building id, depending on the search query
         *
         * https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm
         *
         * @param address String One-line address or building id to search for
         * @returns Array of string suggestions
         */
        module.suggest = function (address) {
            var dfd = $q.defer();

            var suggestUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
            $http.get(suggestUrl, {
                params: {
                    text: address,
                    searchExtent: viewbox,
                    category: 'Address,Postal',
                    f: 'pjson'
                }
            }).success(function (data) {
                var buildings = searchBuildingIds(address).slice(0, 5);
                var suggestions = buildings.concat(_.pluck(data.suggestions, 'text'));
                dfd.resolve(suggestions);

            }).error(function () {
                dfd.resolve(searchBuildingIds(address).slice(0, 5));
            });

            return dfd.promise;
        };

        // Call building ids to initialize
        // This is a bit nasty, but making a separate service for this seems like overkill?
        module.getBuildingIds().done(function (data) {
            buildingIds = _.pluck(data.rows, 'phl_bldg_id');
        });

        return module;
    }

    angular.module('mos.mapping')

      .factory('MappingService', MappingService);

})();