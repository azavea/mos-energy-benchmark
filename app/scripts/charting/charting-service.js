
(function () {
    'use strict';

    /**
     * ngInject
     */
    function ChartingUtils () {
        var module = {};

        /*
         *  Return an array of arrays of random data items
         *  @param len Number of items to return
         *  @param max Maximum value of any data item
         *  @param dimension Number of fields in each data item
         *  @return Array of arrays or array of integers if dimension === 1
         */
        module.seed = function(len, max, dimension) {
            len = typeof len === 'undefined' ? 50 : len;
            max = typeof max === 'undefined' ? 100 : max;
            dimension = typeof dimension === 'undefined' ? 1 : dimension;
            var generateValue = function() {
                return Math.round(Math.random()*max);
            };

            var randoms = [];
            for (var i=0; i<len; i++) {
                var datum = null;
                if (dimension === 1) {
                    datum = generateValue();
                } else {
                    datum = [];
                    for (var j=0; j<dimension; j++) {
                        datum[j] = generateValue();
                    }
                }
                randoms[i] = datum;
            }
            return randoms;
        };

        return module;
    }

    angular.module('mos.charting')
    .factory('ChartingUtils', ChartingUtils);

})();
