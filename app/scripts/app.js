(function () {
'use strict';

    /**
     * ngInject
     */
    function StateConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }

    // color ramp for sectors
    var sectorColors = {
        'School  (K-12)': '#A6CEE3',
        'Office': '#1F78B4',
        'Warehouse': '#B2DF8A',
        'College/ University': '#33A02C',
        'Other': '#FB9A99',
        'Retail': '#E31A1C',
        'Municipal': '#FDBF6F',
        'Multifamily': '#FF7F00',
        'Hotel': '#CAB2D6',
        'Industrial': '#6A3D9A',
        'Unknown': '#DDDDDD'
    };

    // min. values and corresponding CSS values for each bucket
    var CssValues = {
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

    /**
     * @ngdoc overview
     * @name mos
     * @description
     * # mos
     *
     * Main module of the application.
     */
    angular
    .module('mos', [
        'mos.views.charts',
        'mos.views.map',
        'mos.views.info',
        'mos.views.detail',
        'mos.views.compare',
        'headroom'
    ]).config(StateConfig);

    angular.module('mos').constant('MOSColors', sectorColors);
    angular.module('mos').constant('MOSCSSValues', CssValues);

})();
