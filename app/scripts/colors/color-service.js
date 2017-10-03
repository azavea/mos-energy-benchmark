(function () {
    'use strict';

    /**
     * Defines CartoCSS styling by field for feature bubble size and color.
     *
     * @ngInject
     */
    function ColorService (CartoConfig, CartoSQLAPI, MOSColors, MOSCSSValues) {
        var module = {};

        var SECTOR_DESC = 'Building Type';

        function sectorComparator(a, b) {
            return a.name.localeCompare(b.name);
        }

        /*
         *  Helper to get the fields available to select for setting color.
         *
         *  @returns Collection of field name -> descriptive name key/value pairs
         */
        module.getColorByFields = function() {
            var colorFields = {'sector': SECTOR_DESC};
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

        /*
         *  @param {string} Database field name defined in MOSCSSValues
         *  @returns Object with properties for CartoDB choropleth legend creation
         */
        var legendOptions = function(field) {
            if (!(field in MOSCSSValues)) {
                console.error('Field ' + field + ' has no CartoCSS defined!');
                return {};
            }

            var bins = MOSCSSValues[field].bins;
            var lastBin = bins.length - 1;
            var opts = {};
            opts.title = MOSCSSValues[field].description;

            if (MOSCSSValues[field].cssVal === 'marker-fill') {
                opts.type = 'choropleth';
                opts.right = bins[0].max;
                opts.left = bins[lastBin].max;

                if (field !== 'year_built') {
                    opts.right = Number(opts.right).toLocaleString();
                    opts.left = Number(opts.left).toLocaleString();
                }

                opts.colors = [];
                for (var i = lastBin; i-->0; ) {
                    opts.colors.push(bins[i].markerVal);
                }
            } else {
                opts.type = 'bubble';
                opts.color = 'DarkGrey';
                opts.min = Number(bins[lastBin].max).toLocaleString();
                opts.max = Number(bins[0].max).toLocaleString();
            }

            return opts;
        };

        /*
         *  Makes a CartoDB legend for the given field
         *
         *  @param {string} selection Database field to build legend for
         *  @returns Compiled legend element
         */
        module.getLegend = function(selection) {
            var legend = null;
            if (selection === 'sector') {
                // categorize by sector
                legend = new cartodb.geo.ui.Legend.Custom({
                   title: SECTOR_DESC,
                   type: 'custom',
                   data: getSectorColors()
                 });
            } else {
                // color choropleth or size bubbles
                var opts = legendOptions(selection);
                if (opts.type === 'bubble') {
                    legend = new cartodb.geo.ui.Legend.Bubble(opts);
                } else {
                    legend = new cartodb.geo.ui.Legend.Choropleth(opts);
                }
            }
            return legend.render().el;
        };

        /*
         *  Builds sector legend data
         *
         *  @returns Object with properties for custom CartoDB sector legend
         */
        var getSectorColors = function() {
            var sectors = [];
            angular.forEach(MOSColors, function(value, key) {
                sectors.push({'name': key, 'value': value});
            });
            return sectors.sort(sectorComparator);
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

        /*
         *  @param {string} Database field name
         *  @returns CartoCSS string snippet for field
         */
        module.getFieldCartoCSS = function(field) {
            if (field === 'sector') {
                return getSectorColorCartoCSS();
            } else if (!(field in MOSCSSValues)) {
                console.error('Field ' + field + ' has no CartoCSS defined!');
                return '';
            }

            var bins = MOSCSSValues[field].bins;
            var cssVal = MOSCSSValues[field].cssVal;
            var binSize = bins.length;
            var css = '';
            var TABLE = '#' + CartoSQLAPI.getTableName();

            // Every field, except for the time independent fields, needs a year suffix
            var fieldWithYear = CartoConfig.timeIndependentFields.indexOf(field) !== -1 ?  field :
                    field + '_' + CartoSQLAPI.getCurrentYear();

            for (var i = 0; i < binSize; i++) {
                var thisBin = bins[i];
                css += TABLE + ' [' + fieldWithYear + ' <= ' + thisBin.max +
                       '] {' + cssVal + ': ' + thisBin.markerVal + ';}\n';
            }

            // for feature size, add bins with zero size to hide null/zero values
            if (cssVal === 'marker-width') {
                css += TABLE + ' [' + fieldWithYear + ' = null] {marker-width: 0;}\n' +
                       TABLE + ' [' + fieldWithYear + ' = 0] {marker-width: 0;}\n';
            }

            return css;
        };

        // build CartoCSS for coloring features by their sector
        var getSectorColorCartoCSS = function() {
            var css = '';
            var TABLE = '#' + CartoSQLAPI.getTableName();
            angular.forEach(MOSColors, function(value, key) {
                if (key === 'Unknown') {
                    css += '\n' + TABLE + ' {marker-fill: ' + value + ';}';
                } else {
                    css += TABLE + '[sector="' + key + '"] {marker-fill: ' + value + ';} ';
                }
            });
            return css;
        };

        module.baseCartoCSS = [
            '#' + CartoSQLAPI.getTableName() + '{',
            'marker-fill-opacity: 0.8;',
            'marker-line-color: #FFF;',
            'marker-line-width: 0.5;',
            'marker-line-opacity: 1;',
            'marker-placement: point;',
            'marker-multi-policy: largest;',
            'marker-type: ellipse;',
            'marker-fill: #FF5C00;',
            'marker-allow-overlap: true;',
            'marker-clip: false;}'
        ].join(['\n']);

        return module;
    }

    angular.module('mos.colors')
      .factory('ColorService', ColorService);
})();
