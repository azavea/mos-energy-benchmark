(function () {
    'use strict';

    /**
     * @ngInject
     */
    function CartoConfig (Utils) {
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
            eui: 'EUI',
            emissions: 'Emissions',
            energystar: 'Energy Star',
            squarefeet: 'Sq. Ft.'
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

            detailQuery: Utils.strFormat('SELECT * from mos_beb_2013 where {uniqueColumn} = \'{id}\'', {
                uniqueColumn: module.uniqueColumn
            }),

            popupQuery: Utils.strFormat('SELECT cartodb_id, {uniqueColumn}, geocode_address, total_ghg, property_name ' +
                                        'FROM {currentYearTable} where cartodb_id = \'{cartodbId}\'', {
                                            uniqueColumn: module.uniqueColumn,
                                            currentYearTable: module.tables.currentYear
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
