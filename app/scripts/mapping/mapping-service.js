(function () {
    'use strict';

    /**
     * @ngInject
     */
    function MappingService (MOSColors) {
        var module = {};

        module.FILTER_NONE = 'All types';

        var baseCartoCSS = [
            '#mos_beb_2013{',
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

        var sizeByEuiCartoCSS = [
            '#mos_beb_2013 [ site_eui <= 2523] {marker-width: 25.0;}',
            '#mos_beb_2013 [ site_eui <= 240.4] {marker-width: 23.3;}',
            '#mos_beb_2013 [ site_eui <= 159.9] {marker-width: 21.7;}',
            '#mos_beb_2013 [ site_eui <= 119.8] {marker-width: 20.0;}',
            '#mos_beb_2013 [ site_eui <= 99.3] {marker-width: 18.3;}',
            '#mos_beb_2013 [ site_eui <= 83.3] {marker-width: 16.7;}',
            '#mos_beb_2013 [ site_eui <= 69.5] {marker-width: 15.0;}',
            '#mos_beb_2013 [ site_eui <= 55.9] {marker-width: 13.3;}',
            '#mos_beb_2013 [ site_eui <= 39.7] {marker-width: 11.7;}',
            '#mos_beb_2013 [ site_eui <= 16.3] {marker-width: 10.0;}'
        ].join(['\n']);

        var sizeByGhgCartoCSS = [
            '#mos_beb_2013 [ total_ghg <= 258330] {marker-width: 25.0;}',
            '#mos_beb_2013 [ total_ghg <= 5311.3] {marker-width: 23.3;}',
            '#mos_beb_2013 [ total_ghg <= 2593.9] {marker-width: 21.7;}',
            '#mos_beb_2013 [ total_ghg <= 1671] {marker-width: 20.0;}',
            '#mos_beb_2013 [ total_ghg <= 1129.4] {marker-width: 18.3;}',
            '#mos_beb_2013 [ total_ghg <= 825.7] {marker-width: 16.7;}',
            '#mos_beb_2013 [ total_ghg <= 598.2] {marker-width: 15.0;}',
            '#mos_beb_2013 [ total_ghg <= 429.6] {marker-width: 13.3;}',
            '#mos_beb_2013 [ total_ghg <= 316.5] {marker-width: 11.7;}',
            '#mos_beb_2013 [ total_ghg <= 126.5] {marker-width: 10.0;}'
        ].join(['\n']);

        var sizeByElectricityCartoCSS = [
            '#mos_beb_2013 [ electricity <= 1068323130] {marker-width: 25.0;}',
            '#mos_beb_2013 [ electricity <= 27948794.1] {marker-width: 23.3;}',
            '#mos_beb_2013 [ electricity <= 14378246.5] {marker-width: 21.7;}',
            '#mos_beb_2013 [ electricity <= 9657079.1] {marker-width: 20.0;}',
            '#mos_beb_2013 [ electricity <= 6267008.1] {marker-width: 18.3;}',
            '#mos_beb_2013 [ electricity <= 4535964] {marker-width: 16.7;}',
            '#mos_beb_2013 [ electricity <= 2975929.7] {marker-width: 15.0;}',
            '#mos_beb_2013 [ electricity <= 2005814.5] {marker-width: 13.3;}',
            '#mos_beb_2013 [ electricity <= 1164578] {marker-width: 11.7;}',
            '#mos_beb_2013 [ electricity <= 638726.4] {marker-width: 10.0;}'
        ].join(['\n']);

        var sizeByFuelOilCartoCSS = [
            '#mos_beb_2013 [ fuel_oil <= 35790575] {marker-width: 25.0;}',
            '#mos_beb_2013 [ fuel_oil <= 9401723.3] {marker-width: 23.3;}',
            '#mos_beb_2013 [ fuel_oil <= 6210505.9] {marker-width: 21.7;}',
            '#mos_beb_2013 [ fuel_oil <= 4234237] {marker-width: 20.0;}',
            '#mos_beb_2013 [ fuel_oil <= 3741594.1] {marker-width: 18.3;}',
            '#mos_beb_2013 [ fuel_oil <= 3355132.4] {marker-width: 16.7;}',
            '#mos_beb_2013 [ fuel_oil <= 2418174.1] {marker-width: 15.0;}',
            '#mos_beb_2013 [ fuel_oil <= 1690707] {marker-width: 13.3;}',
            '#mos_beb_2013 [ fuel_oil <= 847996] {marker-width: 11.7;}',
            '#mos_beb_2013 [ fuel_oil <= 175893.5] {marker-width: 10.0;}'
        ].join(['\n']);

        var colorByYearCartoCSS = [
            '#mos_beb_2013 [ year_built <= 2013] {marker-fill: #0C2C84;}',
            '#mos_beb_2013 [ year_built <= 1993] {marker-fill: #225EA8;}',
            '#mos_beb_2013 [ year_built <= 1972] {marker-fill: #1D91C0;}',
            '#mos_beb_2013 [ year_built <= 1952] {marker-fill: #41B6C4;}',
            '#mos_beb_2013 [ year_built <= 1932] {marker-fill: #7FCDBB;}',
            '#mos_beb_2013 [ year_built <= 1912] {marker-fill: #C7E9B4;}',
            '#mos_beb_2013 [ year_built <= 1889] {marker-fill: #FFFFCC;}'
        ].join(['\n']);

        var colorBySqFtCartoCSS = [
            '#mos_beb_2013 [ floor_area <= 13000000] {marker-fill: #91003F;}',
            '#mos_beb_2013 [ floor_area <= 405095] {marker-fill: #CE1256;}',
            '#mos_beb_2013 [ floor_area <= 212892] {marker-fill: #E7298A;}',
            '#mos_beb_2013 [ floor_area <= 135825] {marker-fill: #DF65B0;}',
            '#mos_beb_2013 [ floor_area <= 98679] {marker-fill: #C994C7;}',
            '#mos_beb_2013 [ floor_area <= 75318] {marker-fill: #D4B9DA;}',
            '#mos_beb_2013 [ floor_area <= 59200] {marker-fill: #F1EEF6;}'
        ].join(['\n']);

        // build CartoCSS for coloring features by their sector
        var getSectorColorCartoCSS = function() {
            var css = '';
            angular.forEach(MOSColors, function(value, key) {
                if (key === 'Unknown') {
                    css += '\n#mos_beb_2013 {marker-fill: ' + value + ';}';
                } else {
                    css += '#mos_beb_2013[sector="' + key + '"] {marker-fill: ' + value + ';}';
                }
            });
            return css;
        };

        // mapping of CartoCSS feature color blocks to table field names
        var colorCartoCSS = {
            'sector': getSectorColorCartoCSS(),
            'floor_area': colorBySqFtCartoCSS,
            'year_built': colorByYearCartoCSS
        };

        // TODO: add steam and water_use
        var sizeCartoCSS = {
            'site_eui': sizeByEuiCartoCSS,
            'total_ghg': sizeByGhgCartoCSS,
            'electricity': sizeByElectricityCartoCSS,
            'fuel_oil': sizeByFuelOilCartoCSS
        };

        module.getLegendColors = function() {
            var sectors = [];
            // build object with properties CartoDB expects for legend data
            angular.forEach(MOSColors, function(value, key) {
                sectors.push({'name': key, 'value': value});
            });
            return sectors;
        };

        /*
         *  Fetches list of building categories in use
         *
         *  @returns Promise with query results
         */
        module.getBldgCategories = function() {
            var qry = 'SELECT DISTINCT sector FROM mos_beb_2013;';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry);
        };

        /*
         *  Fetches details for a selected property
         *
         * @param {string} cartodbId Unique ID for record to search for
         * @returns Promise with results in data.rows
         */
        module.featureLookup = function(cartodbId)  {
            /* jshint camelcase: false */
            var qry = 'SELECT cartodb_id, geocode_address, total_ghg, property_name, ' + 
            'sector FROM mos_beb_2013 where cartodb_id = {{id}}';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            return sql.execute(qry, { id: cartodbId});
            /* jshint camelcase:true */
        };

        module.filterViz = function(viz, val) {
            if (!viz) {
                console.error('cannot filter; there is no viz!');
                return;
            }
            if (val === module.FILTER_NONE) {
                viz.setSQL('select * from mos_beb_2013');
            } else {
                viz.setSQL('select * from mos_beb_2013 where primary_property_type =\'' + val + '\';');
            }
        };

        module.setVizCartoCSS = function(viz, colorByField, sizeByField) {
            if (!viz) {
                console.error('cannot change CartoCSS; there is no viz!');
                return;
            }
            var css = baseCartoCSS + colorCartoCSS[colorByField] + sizeCartoCSS[sizeByField];
            viz.setCartoCSS(css);
        };

        return module;
    }

    angular.module('mos.mapping')

      .factory('MappingService', MappingService);

})();