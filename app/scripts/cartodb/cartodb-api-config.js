(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoConfig ($location, Utils) {
        var module = {};

        module.user = 'mos-benchmarking';
        module.visualization = '41298fb7-e6c7-4c49-8131-3383a7ac5fe1';

        // The unique column to use to identify records throughout the app
        module.uniqueColumn = 'cartodb_id';

        // TODO: query for these
        module.years = [2015, 2014, 2013];
        // default to last year, until years can be queried from Carto
        //module.years = [(new Date()).getFullYear() - 1];
        module.getCurrentYear = getCurrentYear;

        var year = getCurrentYear();

        // TODO: get these from the yearsTable data
        // Statistics displayed on chart view, these change each year
        module.stats = {
            2013: {
                avgEnergyStar: 64,
                ghgBuildings: 62,
                numBuildings: 1880
            },
            2014: {
                avgEnergyStar: 59,
                ghgBuildings: 60,
                numBuildings: 1879
            },
            2015: {
                avgEnergyStar: 63,
                ghgBuildings: 60,
                numBuildings: 1832
            }
        };

        // TODO: get this name async after querying for years
        // There is now only a single table, which contains data for all years.
        // The naming convention for the table is: mos_beb_{underscore seperated ascending years}.
        // The `slice` is here to make the sort non-destructive.
        module.table = 'mos_beb_' + module.years.slice().sort().join('_');

        module.yearsTable = 'mos_years';

        // Fields which do not use a year suffix
        module.timeIndependentFields = ['year_built', 'floor_area'];

        // These match up to the columns returned from CartoDB.
        // The propery names are all lowercase (as opposed to camel case),
        // because CartoDB can only return them that way.
        module.labels = {
            eui: 'EUI (kBtu/ft&sup2;)',
            emissions: 'Emissions (MtCO2e)',
            energystar: 'Energy Star',
            squarefeet: 'Sq. Ft.'
        };

        // Configuration for obtaining data for multiple years
        module.data = {
            url: 'https://' + module.user + '.carto.com/api/v2/sql',

/* jshint laxbreak:true */
            currAllQuery: Utils.strFormat('SELECT'
                + '  address, cartodb_id, number_of_buildings, phl_bldg_id'
                + ', postal_code, primary_property_type, floor_area'
                + ', sector, year_built, portfolio_bldg_id, property_name'
                + ', electricity_{year} as electricity'
                + ', energy_star_{year} as energy_star'
                + ', fuel_oil_{year} as fuel_oil'
                + ', natural_gas_{year} as natural_gas'
                + ', site_eui_{year} as site_eui'
                + ', source_eui_{year} as source_eui'
                + ', steam_{year} as steam'
                + ', total_ghg_{year} as total_ghg'
                + ', water_use_{year} as water_use'
                + ' FROM {table}', {
                    table: module.table,
                    year: year
                }),

            detailQuery: Utils.strFormat('SELECT * from {table} where {uniqueColumn} in ({id})', {
                table: module.table,
                uniqueColumn: module.uniqueColumn
            }),

            groupedQuery: Utils.strFormat('SELECT'
                + '  sector as name'
                + ', count(*) as count'
                + ', sum(site_eui_{year}) as eui'
                + ', avg(energy_star_{year}) as energystar'
                + ', sum(total_ghg_{year}) as emissions'
                + ', sum(site_eui_{year} * floor_area) as totalenergy'
                + ' FROM {table}'
                + ' GROUP BY sector', {
                    table: module.table,
                    year: year
                }),

            yearsQuery: Utils.strFormat('SELECT * from {table}', {
                table: module.yearsTable
            })

/* jshint laxbreak:false */
        };

        return module;

        // Returns the currently-selected year
        function getCurrentYear() {
            var selected = parseInt($location.search().year, 10);
            return module.years.indexOf(selected) >= 0 ? selected : module.years[0];
        }
    }

    angular.module('mos.cartodb', ['mos.utils'])

      .factory('CartoConfig', CartoConfig);

})();
