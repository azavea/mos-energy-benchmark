(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoConfig (Utils, MOSCSSValues, MOSColors) {
        var module = {};

        // The unique column to use to identify records throughout the app
        module.uniqueColumn = 'cartodb_id';

        module.tables = {
            currentYear: 'mos_beb_2013',
            previousYear: 'mos_beb_2012'
        };

        // These match up to the columns returned from CartoDB.
        // The propery names are all lowercase (as opposed to camel case),
        // because CartoDB can only return them that way.
        module.labels = {
            eui: 'Total Energy',
            emissions: 'Emissions',
            energystar: 'Energy Star',
            squarefeet: 'Sq. Ft.'
        };

        /*
         *  Helper to get the fields available to select for setting color.
         *
         *  @returns Collection of field name -> descriptive name key/value pairs
         */
        module.getColorByFields = function() {
            var colorFields = {'sector': 'Building Type'};
            angular.forEach(MOSCSSValues, function(obj, key) {
                if (obj.cssVal === 'marker-fill') {
                    colorFields[key] = obj.description;
                }
            });
            return colorFields;
        };

        /*
         *  Helper to get the fields available to select for setting size.
         *
         *  @returns Collection of field name -> descriptive name key/value pairs
         */
        module.getSizeByFields = function() {
            var sizeFields = {};
            angular.forEach(MOSCSSValues, function(obj, key) {
                if (obj.cssVal === 'marker-width') {
                    sizeFields[key] = obj.description;
                }
            });
            return sizeFields;
        };

        /*
         * Get the CSS color defined for the bin of a given value
         *
         * @param field {string} Database field name binned
         * @param value {Number} Check which bin this value falls into
         *
         * @returns Color found for the value's bin
         */
        module.getColor = function (field, value) {
            if (!(field in MOSCSSValues)) {
                if (field === 'sector') {
                    if (value in MOSColors) {
                        return MOSColors[value];
                    } else {
                        // if color not found, use 'Unknown' color
                        return MOSColors.Unknown;
                    }
                } else {
                    console.error('Have no CSS defined for field: ' + field);
                    return '#ddd';
                }
            }

            var bins = MOSCSSValues[field].bins;
            var last = bins.length - 1;
            for (var i = last; i-->0;) {
                var maxVal = Number(bins[i].max);
                if (value <= maxVal) {
                    return bins[i].markerVal;
                }
            }

            console.error('Could not find a bin for field: ' + field + ' with value: ' + value);
            return bins[last].markerVal;
        };

        // Configuration for obtaining data for multiple years.
        // 'prevQuery' and 'currQuery' are used in order to make
        // it easier to swap in newer sets of data. There are
        // no current plans to support more than two years of data.
        module.data = {
            url: 'http://azavea-demo.cartodb.com/api/v2/sql',

/* jshint laxbreak:true */
            prevQuery: 'SELECT'
                + ' property_id AS id'
                + ', property_name AS propertyname'
                + ', total_ghg AS emissions'
                + ', energy_star_score AS energystar'
                + ', site_eui AS eui'
                + ' FROM ' + module.tables.previousYear,

            currQuery: 'SELECT'
                + ' portfolio_bldg_id AS id'
                + ', property_name AS propertyname'
                + ', total_ghg AS emissions'
                + ', energy_star AS energystar'
                + ', site_eui AS eui'
                + ', floor_area AS sqfeet'
                + ', year_built AS yearbuilt'
                + ' FROM ' + module.tables.currentYear,

            currAllQuery: 'SELECT * FROM ' + module.tables.currentYear,

            detailQuery: Utils.strFormat('SELECT * from mos_beb_2013 where {uniqueColumn} in ({id})', {
                uniqueColumn: module.uniqueColumn
            }),

            groupedQuery: 'SELECT'
                + '  sector as name'
                + ', count(*) as count'
                + ', sum(site_eui) as eui'
                + ', avg(energy_star) as energystar'
                + ', sum(total_ghg) as emissions'
                + ' FROM ' + module.tables.currentYear
                + ' GROUP BY sector'
/* jshint laxbreak:false */
        };

        return module;
    }

    angular.module('mos.cartodb', ['mos.utils'])

      .factory('CartoConfig', CartoConfig);

})();
