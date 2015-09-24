(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoSQLAPI ($http, CartoConfig, Utils) {
        var module = {};

        /*
         *  Builds subset of renamed data fields from full query, for charts
         */
        module.getCurrentData = function (currentAllData) {
            var currentData = [];
            angular.forEach(currentAllData, function (row) {
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

        module.getAllCurrentData = function () {
            return makeCartoDBRequest(CartoConfig.data.currAllQuery);
        };

        /*
         *  Retrieves the grouped data from CartoDB
         *
         *  @return {$httpPromise} object
         */
        module.getGroupedData = function () {
            return makeCartoDBRequest(CartoConfig.data.groupedQuery);
        };

        /**
         * Get building data for a given id or array of ids
         * @param  {String|Array} buildingId Building ids queried against CartoConfig.uniqueColumn column
         * @return {$httpPromise}
         */
        module.getBuildingData = function (buildingId) {
            var ids = buildingId;
            if (_.isArray(buildingId)) {
                ids = buildingId.join(',');
            }
            return makeCartoDBRequest(CartoConfig.data.detailQuery, {
                id: ids
            });
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
    }

    angular.module('mos.cartodb')

      .factory('CartoSQLAPI', CartoSQLAPI);

})();
