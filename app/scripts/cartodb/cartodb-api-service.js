(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoSQLAPI ($http, $location, $rootScope, CartoConfig, Utils) {
        var module = {};

        // years will be queried from Carto
        // app displays the most recent three years' worth of data
        // download links for all available years are available in the dropdown
        module.years = [];
        module.allYears = [];
        module.yearsData = {};
        module.getCurrentYear = getCurrentYear;

        // There is now only a single table, which contains data for all years.
        // The naming convention for the table is: mos_beb_{underscore seperated ascending years}.
        // The `slice` is here to make the sort non-destructive.
        module.getTableName = getTableName;

        /*
         *  Builds subset of renamed data fields from full query, for charts
         */
        module.getCurrentData = function(currentAllData) {
            var currentData = [];
            angular.forEach(currentAllData, function(row) {
                /* jshint camelcase:false */
                var property = {
                    id: row.portfolio_bldg_id,
                    sector: row.sector,
                    propertyname: row.property_name,
                    emissions: row.total_ghg,
                    energystar: row.energy_star,
                    eui: row.site_eui,
                    sqfeet: row.floor_area,
                    yearbuilt: row.year_built
                };
                /* jshint camelcase:true */
                currentData.push(property);
            });
            return currentData;
        };

        module.getAllCurrentData = function() {
            return makeCartoDBRequest(CartoConfig.data.currAllQuery, {
                year: getCurrentYear(),
                table: getTableName()
            });
        };

        /*
         *  Retrieves the grouped data from CartoDB
         *
         *  @return {$httpPromise} object
         */
        module.getGroupedData = function() {
            return makeCartoDBRequest(CartoConfig.data.groupedQuery, {
                year: getCurrentYear(),
                table: getTableName()
            });
        };

        /**
         * Get building data for a given id or array of ids
         * @param  {String|Array} buildingId Building ids queried against CartoConfig.uniqueColumn column
         * @return {$httpPromise}
         */
        module.getBuildingData = function(buildingId) {
            var ids = buildingId;
            if (_.isArray(buildingId)) {
                ids = buildingId.join(',');
            }
            return makeCartoDBRequest(CartoConfig.data.detailQuery, {
                id: ids,
                table: getTableName()
            });
        };

        /**
         * Get the table of years and their associated values
         * @return {$httpPromise}
         */
        module.getYearsData = function() {
            return makeCartoDBRequest(CartoConfig.data.yearsQuery);
        };

        /**
         * Process the result of the `getYearsData` query and set the data on the service
         */
        module.setYears = function(yearsData) {

            var queryiedYears = [];

            angular.forEach(yearsData.data.rows, function(row) {
                queryiedYears.push(row.year);

                /* jshint camelcase:false */
                module.yearsData[row.year] = {
                    downloadUrl: row.download_url,
                    avgEnergyStar: row.avg_energy_star,
                    ghgBuildings: row.ghg_buildings,
                    numBuildings: row.num_buildings
                };
                /* jshint camelcase:true */
            });

            // all available years
            module.allYears = queryiedYears;

            // use the most recent three years for display
            if (queryiedYears.length >= 3) {
                module.years = queryiedYears.slice(0, 3);
            }

            $rootScope.$broadcast('mos.cartodb:years', module.years);
        };

        /**
         * Helper function to make a request to the CartoDBAPI
         * @param  {String} query The sql query to make
         * @param  {Object(Optional)} queryParams Object See Utils.strFormat params
         * @return {$httpPromise} The $httpPromise object for the query
         */
        function makeCartoDBRequest(query, queryParams) {
            queryParams = queryParams || {};
            var formattedQuery = Utils.strFormat(query, queryParams);
            return $http.get(CartoConfig.data.url, {
                params: {
                    q: formattedQuery
                },
                cache: true
            });
        }

        return module;

        // Returns the currently-selected year
        function getCurrentYear() {
            var selected = parseInt($location.search().year, 10);
            return module.years.indexOf(selected) >= 0 ? selected : module.years[0];
        }

        function getTableName() {
            return 'mos_beb_' + module.years.slice().sort().join('_');
        }
    }

    angular.module('mos.cartodb')

      .factory('CartoSQLAPI', CartoSQLAPI);

})();
