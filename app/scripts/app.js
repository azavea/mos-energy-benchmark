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
        'School (K-12)': '#A6CEE3',
        'Office': '#1F78B4',
        'Medical Office': '#52A634',
        'Warehouse': '#B2DF8A',
        'College/ University': '#33A02C',
        'Other': '#FB9A99',
        'Retail': '#E31A1C',
        'Municipal': '#FDBF6F',
        'Multifamily': '#FF7F00',
        'Hotel': '#CAB2D6',
        'Industrial': '#6A3D9A',
        'Worship': '#9C90C4',
        'Supermarket': '#E8AE6C',
        'Parking': '#62afe8',
        'Laboratory': '#3AA3FF',
        'Hospital': '#C6B4FF',
        'Data Center': '#a3d895',
        'Unknown': '#DDDDDD'
    };

    // min. values and corresponding CSS values for each bucket
    var CssValues = {
            'energy_star': {
                cssVal: 'marker-width',
                description: 'Energy Star',
                bins: [
                    {
                        max: '100',
                        markerVal: 25
                    },
                    {
                        max: '90',
                        markerVal: 23.3
                    },
                    {
                        max: '80',
                        markerVal: 21.7
                    },
                    {
                        max: '70',
                        markerVal: 20.0
                    },
                    {
                        max: '60',
                        markerVal: 18.3
                    },
                    {
                        max: '51',
                        markerVal: 16.7
                    },
                    {
                        max: '41',
                        markerVal: 15.0
                    },
                    {
                        max: '31',
                        markerVal: 13.3
                    },
                    {
                        max: '21',
                        markerVal: 11.7
                    },
                    {
                        max: '11',
                        markerVal: 10.0
                    }
                ]
            },
            'floor_area': {
                'cssVal': 'marker-fill',
                'description': 'Square Footage',
                'bins': [
                    {
                        'max': '13000000',
                        'markerVal': '#91003F'
                    },
                    {
                        'max': '405095',
                        'markerVal': '#CE1256'
                    },
                    {
                        'max': '212892',
                        'markerVal': '#E7298A'
                    },
                    {
                        'max': '135825',
                        'markerVal': '#DF65B0'
                    },
                    {
                        'max': '98679',
                        'markerVal': '#C994C7'
                    },
                    {
                        'max': '75318',
                        'markerVal': '#D4B9DA'
                    },
                    {
                        'max': '59200',
                        'markerVal': '#F1EEF6'
                    }
            ]
        },
        'year_built': {
            'cssVal': 'marker-fill',
            'description': 'Year Built',
            'bins': [
                {
                    'max': '2014',
                    'markerVal': '#0C2C84'
                },
                {
                    'max': '1993',
                    'markerVal': '#225EA8'
                },
                {
                    'max': '1972',
                    'markerVal': '#1D91C0'
                },
                {
                    'max': '1952',
                    'markerVal': '#41B6C4'
                },
                {
                    'max': '1932',
                    'markerVal': '#7FCDBB'
                },
                {
                    'max': '1912',
                    'markerVal': '#C7E9B4'
                },
                {
                    'max': '1889',
                    'markerVal': '#FFFFCC'
                }
            ]
        },
        'site_eui': {
            'cssVal': 'marker-width',
            'description': 'EUI (kBtu/ft&sup2;)',
            'bins': [
                {
                    'max': '2523',
                    'markerVal': '25.0'
                },
                {
                    'max': '240.4',
                    'markerVal': '23.3'
                },
                {
                    'max': '159.9',
                    'markerVal': '21.7'
                },
                {
                    'max': '119.8',
                    'markerVal': '20.0'
                },
                {
                    'max': '99.3',
                    'markerVal': '18.3'
                },
                {
                    'max': '83.3',
                    'markerVal': '16.7'
                },
                {
                    'max': '69.5',
                    'markerVal': '15.0'
                },
                {
                    'max': '55.9',
                    'markerVal': '13.3'
                },
                {
                    'max': '39.7',
                    'markerVal': '11.7'
                },
                {
                    'max': '16.3',
                    'markerVal': '10.0'
                }
            ]
        },
        'total_ghg': {
            'cssVal': 'marker-width',
            'description': 'Emissions (MtCO2e)',
            'bins': [
                {
                    'max': '258330',
                    'markerVal': '25.0'
                },
                {
                    'max': '5311.3',
                    'markerVal': '23.3'
                },
                {
                    'max': '2593.9',
                    'markerVal': '21.7'
                },
                {
                    'max': '1671',
                    'markerVal': '20.0'
                },
                {
                    'max': '1129.4',
                    'markerVal': '18.3'
                },
                {
                    'max': '825.7',
                    'markerVal': '16.7'
                },
                {
                    'max': '598.2',
                    'markerVal': '15.0'
                },
                {
                    'max': '429.6',
                    'markerVal': '13.3'
                },
                {
                    'max': '316.5',
                    'markerVal': '11.7'
                },
                {
                    'max': '126.5',
                    'markerVal': '10.0'
                }
            ]
        },
        'electricity': {
            'cssVal': 'marker-width',
            'description': 'Electricity (kBtu)',
            'bins': [
                {
                    'max': '1068323130',
                    'markerVal': '25.0'
                },
                {
                    'max': '27948794.1',
                    'markerVal': '23.3'
                },
                {
                    'max': '14378246.5',
                    'markerVal': '21.7'
                },
                {
                    'max': '9657079.1',
                    'markerVal': '20.0'
                },
                {
                    'max': '6267008.1',
                    'markerVal': '18.3'
                },
                {
                    'max': '4535964',
                    'markerVal': '16.7'
                },
                {
                    'max': '2975929.7',
                    'markerVal': '15.0'
                },
                {
                    'max': '2005814.5',
                    'markerVal': '13.3'
                },
                {
                    'max': '1164578',
                    'markerVal': '11.7'
                },
                {
                    'max': '638726.4',
                    'markerVal': '10.0'
                }
            ]
        },
        'fuel_oil': {
            'cssVal': 'marker-width',
            'description': 'Fuel Oil (kBtu)',
            'bins': [
                {
                    'max': '35790575',
                    'markerVal': '25.0'
                },
                {
                    'max': '9401723.3',
                    'markerVal': '23.3'
                },
                {
                    'max': '6210505.9',
                    'markerVal': '21.7'
                },
                {
                    'max': '4234237',
                    'markerVal': '20.0'
                },
                {
                    'max': '3741594.1',
                    'markerVal': '18.3'
                },
                {
                    'max': '3355132.4',
                    'markerVal': '16.7'
                },
                {
                    'max': '2418174.1',
                    'markerVal': '15.0'
                },
                {
                    'max': '1690707',
                    'markerVal': '13.3'
                },
                {
                    'max': '847996',
                    'markerVal': '11.7'
                },
                {
                    'max': '175893.5',
                    'markerVal': '10.0'
                }
            ]
        },
        'natural_gas': {
            'cssVal': 'marker-width',
            'description': 'Natural Gas (kBtu)',
            'bins': [
                {
                    'max': '1123733030',
                    'markerVal': '35.0'
                },
                {
                    'max': '16996373.8',
                    'markerVal': '32.2'
                },
                {
                    'max': '7030613.2',
                    'markerVal': '29.4'
                },
                {
                    'max': '4607952.6',
                    'markerVal': '26.7'
                },
                {
                    'max': '3306190.9',
                    'markerVal': '23.9'
                },
                {
                    'max': '2201595.2',
                    'markerVal': '21.1'
                },
                {
                    'max': '1386463.6',
                    'markerVal': '18.3'
                },
                {
                    'max': '765205.4',
                    'markerVal': '15.6'
                },
                {
                    'max': '323197.2',
                    'markerVal': '12.8'
                },
                {
                    'max': '115650',
                    'markerVal': '10.0'
                }
            ]
        },
        'water_use': {
            'cssVal': 'marker-width',
            'description': 'Water Use (kgal)',
            'bins': [
                {
                    'max': '700949.4',
                    'markerVal': '35.0'
                },
                {
                    'max': '14733.6',
                    'markerVal': '32.2'
                },
                {
                    'max': '7137.9',
                    'markerVal': '29.4'
                },
                {
                    'max': '3943',
                    'markerVal': '26.7'
                },
                {
                    'max': '2349.3',
                    'markerVal': '23.9'
                },
                {
                    'max': '1345',
                    'markerVal': '21.1'
                },
                {
                    'max': '904.9',
                    'markerVal': '18.3'
                },
                {
                    'max': '611.4',
                    'markerVal': '15.6'
                },
                {
                    'max': '328.3',
                    'markerVal': '12.8'
                },
                {
                    'max': '112.7',
                    'markerVal': '10.0'
                }
            ]
        },
        'steam': {
            'cssVal': 'marker-width',
            'description': 'Steam (kBtu)',
            'bins': [
                {
                    'max': '1375885588',
                    'markerVal': '25.0'
                },
                {
                    'max': '33787072',
                    'markerVal': '23.3'
                },
                {
                    'max': '20344457.7',
                    'markerVal': '21.7'
                },
                {
                    'max': '14335164',
                    'markerVal': '20.0'
                },
                {
                    'max': '11635695.2',
                    'markerVal': '18.3'
                },
                {
                    'max': '9132222.5',
                    'markerVal': '16.7'
                },
                {
                    'max': '6982731.5',
                    'markerVal': '15.0'
                },
                {
                    'max': '5334792',
                    'markerVal': '13.3'
                },
                {
                    'max': '3599831.1',
                    'markerVal': '11.7'
                },
                {
                    'max': '1982704.8',
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
        'mos.root',
        'mos.headerbar',
        'mos.views.charts',
        'mos.views.map',
        'mos.views.info',
        'mos.views.detail',
        'mos.views.compare',
        'mos.years',
        'headroom'
    ]).config(StateConfig);

    angular.module('mos').constant('MOSColors', sectorColors);
    angular.module('mos').constant('MOSCSSValues', CssValues);

})();
