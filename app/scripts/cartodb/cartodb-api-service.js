(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoSQLAPI ($http, CartoConfig, Utils) {
        var module = {};

        /*
         *  Retrieves the current data from CartoDB
         *
         *  @return {$httpPromise} object
         */
        module.getCurrentData = function () {
            return makeCartoDBRequest(CartoConfig.data.currQuery);
        };

        module.getAllCurrentData = function () {
            return makeCartoDBRequest(CartoConfig.data.currAllQuery);
        };

        /*
         *  Retrieves the previous data from CartoDB
         *
         *  @return {$httpPromise} object
         */
        module.getPreviousData = function () {
            return makeCartoDBRequest(CartoConfig.data.prevQuery);
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

        /*
         * Combines the rows, keeps the ones where data exists for both years
         *
         * @param {Object} currData Data returned from CartoDB representing current data
         * @param {Object} prevData Data returned from CartoDB representing previous data
         *
         * @return [Array] Merged data
         */
        module.getCombinedData = function (currData, prevData) {
            var currRows = currData.rows;
            var prevRows = prevData.rows;

            var data = {};
            var dataArr = [];
            angular.forEach(prevRows, function (row) {
                data[row.id] = {
                    prev: row
                };
            });
            angular.forEach(currRows, function (row) {
                if (data[row.id]) {
                    data[row.id].curr = row;
                }
            });
            angular.forEach(prevRows, function (row) {
                if (!data[row.id].curr) {
                    delete data[row.id];
                } else {
                    dataArr.push(data[row.id]);
                }
            });

            return dataArr;
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
