MOS.Config = (function(MOS) {
    'use strict';

    var module = {};

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

        prevQuery: 'SELECT'
            + ' property_id AS id'
            + ', property_name AS propertyname'
            + ', total_ghg_emissions_mtco2e::real AS emissions'
            + ', energy_star_score AS energystar'
            + ', site_eui_kbtu_ft::real AS eui'
            + ' FROM mos_beb_2012',

        currQuery: 'SELECT'
            + ' portfolio AS id'
            + ', property_n AS propertyname'
            + ', total_ghg AS emissions'
            + ', energy_sta AS energystar'
            + ', site_eui__ AS eui'
            + ' FROM mos_beb_2013',

        groupedQuery: 'SELECT'
            + ' city_desig as name'
            + ', count(*) as count'
            + ', sum(site_eui__) as eui'
            + ', avg(energy_sta) as energystar'
            + ', sum(total_ghg) as emissions'
            + ' FROM mos_beb_2013'
            + ' GROUP BY city_desig'
    };

    return module;

}(MOS));
