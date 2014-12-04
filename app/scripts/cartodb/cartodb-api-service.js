(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoSQLAPI ($http, CartoConfig) {
        var module = {};

        /*
         *  Retrieves the current data from CartoDB
         *
         *  @return jQuery.Deferred object
         */
        module.getCurrentData = function () {
            return makeCartoDBRequest(CartoConfig.data.currQuery);
        };

        /*
         *  Retrieves the previous data from CartoDB
         *
         *  @return jQuery.Deferred object
         */
        module.getPreviousData = function () {
            return makeCartoDBRequest(CartoConfig.data.prevQuery);
        };

        /*
         *  Retrieves the grouped data from CartoDB
         *
         *  @return jQuery.Deferred object
         */
        module.getGroupedData = function () {
            return makeCartoDBRequest(CartoConfig.data.groupedQuery);
        };

        /*
         * Combines the rows, keeps the ones where data exists for both years
         *
         * @param currData Object returned from CartoDB representing current data
         *     prevData Object returned from CartoDB representing previous data
         *
         * @return Array of merged data
         */
        module.getCombinedData = function (currData, prevData) {
            var currRows = currData[0].rows;
            var prevRows = prevData[0].rows;

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

        // Helper for getting data from CartoDB and returning a promise
        function makeCartoDBRequest(query) {
            return $http.get(CartoConfig.data.url, {
                params: {
                    q: query
                }
            });
        }


        return module;
    }

    angular.module('mos.cartodb')

      .factory('CartoSQLAPI', CartoSQLAPI);

})();