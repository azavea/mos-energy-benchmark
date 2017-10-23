(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoConfig (Utils, MOSTablePrefix) {
        var module = {};

        module.user = 'mos-benchmarking';

        // The unique column to use to identify records throughout the app
        module.uniqueColumn = 'cartodb_id';

        module.yearsTable = MOSTablePrefix + 'years';
        module.infoTable = MOSTablePrefix + 'info';

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
                + ' FROM {table}', {}),

            detailQuery: Utils.strFormat('SELECT * from {table} where {uniqueColumn} in ({id})', {
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
                + ' GROUP BY sector', {}),

            yearsQuery: Utils.strFormat('SELECT * from {table} ORDER BY year DESC', {
                table: module.yearsTable
            }),

            infoQuery: Utils.strFormat('SELECT * from {table}', {
                table: module.infoTable
            })

/* jshint laxbreak:false */
        };

        return module;
    }

    angular.module('mos.cartodb', ['mos.utils', 'mos.config'])

      .factory('CartoConfig', CartoConfig);

})();
