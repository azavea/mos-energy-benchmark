(function () {
    'use strict';

    /**
     * Defines CartoCSS styling by field for feature bubble size and color.
     *
     * @ngInject
     */
    function MapColorService (MOSColors, CartoConfig) {
        var module = {};

        var TABLE = '#' + CartoConfig.tables.currentYear;

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

        /*
         *  @param {string} Database field name defined in colorRamps below
         *  @returns Object with properties for CartoDB choropleth legend creation
         */
        module.legendOptions = function(field) {
            if (!(field in colorRamps)) {
                console.error('Field ' + field + ' has no CartoCSS defined!');
                return {};
            }

            var bins = colorRamps[field].bins;
            var lastBin = bins.length - 1;
            var opts = {};

            opts.right = bins[0].min;
            opts.left = bins[lastBin].min;
            opts.colors = [];

            for (var i = lastBin; i-->0; ) {
                opts.colors.push(bins[i].markerVal);
            }

            return opts;
        };

        /*
         *  @param {string} Database field name
         *  @returns CartoCSS string snippet for field
         */
        module.getFieldCartoCSS = function(field) {
            if (field === 'sector') {
                return getSectorColorCartoCSS();
            } else if (!(field in colorRamps)) {
                console.error('Field ' + field + ' has no CartoCSS defined!');
                return '';
            }

            var bins = colorRamps[field].bins;
            var cssVal = colorRamps[field].cssVal;
            var binSize = bins.length;
            var css = '';

            for (var i = 0; i < binSize; i++) {
                var thisBin = bins[i];
                css += TABLE + ' [' + field + ' <= ' + thisBin.min + 
                       '] {' + cssVal + ': ' + thisBin.markerVal + ';}\n';
            }
            return css;
        };

        // build CartoCSS for coloring features by their sector
        var getSectorColorCartoCSS = function() {
            var css = '';
            angular.forEach(MOSColors, function(value, key) {
                if (key === 'Unknown') {
                    css += '\n' + TABLE + ' {marker-fill: ' + value + ';}';
                } else {
                    css += TABLE + '[sector="' + key + '"] {marker-fill: ' + value + ';} ';
                }
            });
            return css;
        };

        /*
         *  Helper to get the fields available to select for setting color.
         *
         *  @returns Collection of field name -> descriptive name key/value pairs
         */
        module.getColorByFields = function() {
            var colorFields = {'sector': 'Building Type'};
            angular.forEach(colorRamps, function(obj, key) {
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
            angular.forEach(colorRamps, function(obj, key) {
                if (obj.cssVal === 'marker-width') {
                    sizeFields[key] = obj.description;
                }
            });
            return sizeFields;
        };

        module.baseCartoCSS = [
            TABLE + '{',
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

        // min. values and corresponding CSS values for each bucket
        var colorRamps = {
                'floor_area': {
                    'cssVal': 'marker-fill',
                    'description': 'Square Footage',
                    'bins': [
                        {
                            'min': '13000000',
                            'markerVal': '#91003F'
                        },
                        {
                            'min': '405095',
                            'markerVal': '#CE1256'
                        },
                        {
                            'min': '212892',
                            'markerVal': '#E7298A'
                        },
                        {
                            'min': '135825',
                            'markerVal': '#DF65B0'
                        },
                        {
                            'min': '98679',
                            'markerVal': '#C994C7'
                        },
                        {
                            'min': '75318',
                            'markerVal': '#D4B9DA'
                        },
                        {
                            'min': '59200',
                            'markerVal': '#F1EEF6'
                        }                      
                ]
            },
            'year_built': {
                'cssVal': 'marker-fill',
                'description': 'Year Built',
                'bins': [
                    {
                        'min': '2013',
                        'markerVal': '#0C2C84'
                    },
                    {
                        'min': '1993',
                        'markerVal': '#225EA8'
                    },
                    {
                        'min': '1972',
                        'markerVal': '#1D91C0'
                    },
                    {
                        'min': '1952',
                        'markerVal': '#41B6C4'
                    },
                    {
                        'min': '1932',
                        'markerVal': '#7FCDBB'
                    },
                    {
                        'min': '1912',
                        'markerVal': '#C7E9B4'
                    },
                    {
                        'min': '1889',
                        'markerVal': '#FFFFCC'
                    }
                ]
            },
            'site_eui': {
                'cssVal': 'marker-width',
                'description': 'Total Energy',
                'bins': [
                    {
                        'min': '2523',
                        'markerVal': '25.0'
                    },
                    {
                        'min': '240.4',
                        'markerVal': '23.3'
                    },
                    {
                        'min': '159.9',
                        'markerVal': '21.7'
                    },
                    {
                        'min': '119.8',
                        'markerVal': '20.0'
                    },
                    {
                        'min': '99.3',
                        'markerVal': '18.3'
                    },
                    {
                        'min': '83.3',
                        'markerVal': '16.7'
                    },
                    {
                        'min': '69.5',
                        'markerVal': '15.0'
                    },
                    {
                        'min': '55.9',
                        'markerVal': '13.3'
                    },
                    {
                        'min': '39.7',
                        'markerVal': '11.7'
                    },
                    {
                        'min': '16.3',
                        'markerVal': '10.0'
                    }
                ]
            },
            'total_ghg': {
                'cssVal': 'marker-width',
                'description': 'Greenhouse Gases',
                'bins': [
                    {
                        'min': '258330',
                        'markerVal': '25.0'
                    },
                    {
                        'min': '5311.3',
                        'markerVal': '23.3'
                    },
                    {
                        'min': '2593.9',
                        'markerVal': '21.7'
                    },
                    {
                        'min': '1671',
                        'markerVal': '20.0'
                    },
                    {
                        'min': '1129.4',
                        'markerVal': '18.3'
                    },
                    {
                        'min': '825.7',
                        'markerVal': '16.7'
                    },
                    {
                        'min': '598.2',
                        'markerVal': '15.0'
                    },
                    {
                        'min': '429.6',
                        'markerVal': '13.3'
                    },
                    {
                        'min': '316.5',
                        'markerVal': '11.7'
                    },
                    {
                        'min': '126.5',
                        'markerVal': '10.0'
                    }
                ]
            },
            'electricity': {
                'cssVal': 'marker-width',
                'description': 'Electricity',
                'bins': [
                    {
                        'min': '1068323130',
                        'markerVal': '25.0'
                    },
                    {
                        'min': '27948794.1',
                        'markerVal': '23.3'
                    },
                    {
                        'min': '14378246.5',
                        'markerVal': '21.7'
                    },
                    {
                        'min': '9657079.1',
                        'markerVal': '20.0'
                    },
                    {
                        'min': '6267008.1',
                        'markerVal': '18.3'
                    },
                    {
                        'min': '4535964',
                        'markerVal': '16.7'
                    },
                    {
                        'min': '2975929.7',
                        'markerVal': '15.0'
                    },
                    {
                        'min': '2005814.5',
                        'markerVal': '13.3'
                    },
                    {
                        'min': '1164578',
                        'markerVal': '11.7'
                    },
                    {
                        'min': '638726.4',
                        'markerVal': '10.0'
                    }
                ]
            },
            'fuel_oil': {
                'cssVal': 'marker-width',
                'description': 'Fuel Oil',
                'bins': [
                    {
                        'min': '35790575',
                        'markerVal': '25.0'
                    },
                    {
                        'min': '9401723.3',
                        'markerVal': '23.3'
                    },
                    {
                        'min': '6210505.9',
                        'markerVal': '21.7'
                    },
                    {
                        'min': '4234237',
                        'markerVal': '20.0'
                    },
                    {
                        'min': '3741594.1',
                        'markerVal': '18.3'
                    },
                    {
                        'min': '3355132.4',
                        'markerVal': '16.7'
                    },
                    {
                        'min': '2418174.1',
                        'markerVal': '15.0'
                    },
                    {
                        'min': '1690707',
                        'markerVal': '13.3'
                    },
                    {
                        'min': '847996',
                        'markerVal': '11.7'
                    },
                    {
                        'min': '175893.5',
                        'markerVal': '10.0'
                    }
                ]
            },
            'natural_gas': {
                'cssVal': 'marker-width',
                'description': 'Natural Gas',
                'bins': [
                    {
                        'min': '1123733030',
                        'markerVal': '35.0'
                    },
                    {
                        'min': '16996373.8',
                        'markerVal': '32.2'
                    },
                    {
                        'min': '7030613.2',
                        'markerVal': '29.4'
                    },
                    {
                        'min': '4607952.6',
                        'markerVal': '26.7'
                    },
                    {
                        'min': '3306190.9',
                        'markerVal': '23.9'
                    },
                    {
                        'min': '2201595.2',
                        'markerVal': '21.1'
                    },
                    {
                        'min': '1386463.6',
                        'markerVal': '18.3'
                    },
                    {
                        'min': '765205.4',
                        'markerVal': '15.6'
                    },
                    {
                        'min': '323197.2',
                        'markerVal': '12.8'
                    },
                    {
                        'min': '115650',
                        'markerVal': '10.0'
                    }
                ]
            },
            'water_use': {
                'cssVal': 'marker-width',
                'description': 'Water Use',
                'bins': [
                    {
                        'min': '700949.4',
                        'markerVal': '35.0'
                    },
                    {
                        'min': '14733.6',
                        'markerVal': '32.2'
                    },
                    {
                        'min': '7137.9',
                        'markerVal': '29.4'
                    },
                    {
                        'min': '3943',
                        'markerVal': '26.7'
                    },
                    {
                        'min': '2349.3',
                        'markerVal': '23.9'
                    },
                    {
                        'min': '1345',
                        'markerVal': '21.1'
                    },
                    {
                        'min': '904.9',
                        'markerVal': '18.3'
                    },
                    {
                        'min': '611.4',
                        'markerVal': '15.6'
                    },
                    {
                        'min': '328.3',
                        'markerVal': '12.8'
                    },
                    {
                        'min': '112.7',
                        'markerVal': '10.0'
                    }
                ]
            },
            'steam': {
                'cssVal': 'marker-width',
                'description': 'Steam',
                'bins': [
                    {
                        'min': '1375885588',
                        'markerVal': '25.0'
                    },
                    {
                        'min': '33787072',
                        'markerVal': '23.3'
                    },
                    {
                        'min': '20344457.7',
                        'markerVal': '21.7'
                    },
                    {
                        'min': '14335164',
                        'markerVal': '20.0'
                    },
                    {
                        'min': '11635695.2',
                        'markerVal': '18.3'
                    },
                    {
                        'min': '9132222.5',
                        'markerVal': '16.7'
                    },
                    {
                        'min': '6982731.5',
                        'markerVal': '15.0'
                    },
                    {
                        'min': '5334792',
                        'markerVal': '13.3'
                    },
                    {
                        'min': '3599831.1',
                        'markerVal': '11.7'
                    },
                    {
                        'min': '1982704.8',
                        'markerVal': '10.0'
                    }
                ]
            }
        };

        return module;
    }

    angular.module('mos.mapping')

      .factory('MapColorService', MapColorService);

})();