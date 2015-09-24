(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoConfig (Utils) {
        var module = {};

        module.user = 'mos-benchmarking';
        module.visualization = '5e5cbbf0-8ac3-11e4-bf05-0e9d821ea90d';

        // The unique column to use to identify records throughout the app
        module.uniqueColumn = 'cartodb_id';

        module.tables = {
            currentYear: 'mos_beb_2013'
        };

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
            url: 'http://' + module.user + '.cartodb.com/api/v2/sql',

/* jshint laxbreak:true */
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
                + ', sum(site_eui * floor_area) as totalenergy'
                + ' FROM ' + module.tables.currentYear
                + ' GROUP BY sector'
/* jshint laxbreak:false */
        };

        return module;
    }

    angular.module('mos.cartodb', ['mos.utils'])

      .factory('CartoConfig', CartoConfig);

})();
