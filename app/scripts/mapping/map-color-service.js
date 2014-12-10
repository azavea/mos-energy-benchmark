(function () {
    'use strict';

    /**
     * Defines CartoCSS styling by field for feature bubble size and color.
     *
     * @ngInject
     */
    function MapColorService (MOSColors) {
        var module = {};

        var TABLE = '#mos_beb_2013';

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

        // TODO: add steam and water_use
        // min. values and corresponding CSS values for each bucket
        var colorRamps = {
                'floor_area': {
                    'cssVal': 'marker-fill',
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
            }
        };

        return module;
    }

    angular.module('mos.mapping')

      .factory('MapColorService', MapColorService);

})();