describe('Factory: mos.colors.ColorService', function () {
    'use strict';

    // load the module
    beforeEach(module('mos'));

    var $injector = angular.injector(['mos']);
    var Colors;
    var CartoConfig;
    var MosColors;
    var MosCssValues;

    // Initialize the service
    beforeEach(inject(function (_ColorService_) {
        MosColors = $injector.get('MOSColors');
        MosCssValues = $injector.get('MOSCSSValues');
        CartoConfig = $injector.get('CartoConfig');
        Colors = _ColorService_;
    }));

    it('should have base CartoCSS', function () {
        expect(Colors.baseCartoCSS).toBeDefined();
    });

    it('should get legend', function () {
        var floorLegend = Colors.getLegend('floor_area');
        expect(floorLegend).toBeDefined();
    });

    it('should build CartoCSS for sector', function () {
        var sectorCSS = Colors.getFieldCartoCSS('sector');

        var cssVal = '#mos_beb_2013_2014[sector="School  (K-12)"] {marker-fill: #A6CEE3;} #mos_beb_2013_2014[sector="Office"] {marker-fill: #1F78B4;} #mos_beb_2013_2014[sector="Medical Office"] {marker-fill: #52A634;} #mos_beb_2013_2014[sector="Warehouse"] {marker-fill: #B2DF8A;} #mos_beb_2013_2014[sector="College/ University"] {marker-fill: #33A02C;} #mos_beb_2013_2014[sector="Other"] {marker-fill: #FB9A99;} #mos_beb_2013_2014[sector="Retail"] {marker-fill: #E31A1C;} #mos_beb_2013_2014[sector="Municipal"] {marker-fill: #FDBF6F;} #mos_beb_2013_2014[sector="Multifamily"] {marker-fill: #FF7F00;} #mos_beb_2013_2014[sector="Hotel"] {marker-fill: #CAB2D6;} #mos_beb_2013_2014[sector="Industrial"] {marker-fill: #6A3D9A;} #mos_beb_2013_2014[sector="Worship"] {marker-fill: #9C90C4;} #mos_beb_2013_2014[sector="Supermarket"] {marker-fill: #E8AE6C;} #mos_beb_2013_2014[sector="Parking"] {marker-fill: #62afe8;} #mos_beb_2013_2014[sector="Laboratory"] {marker-fill: #3AA3FF;} #mos_beb_2013_2014[sector="Hospital"] {marker-fill: #C6B4FF;} #mos_beb_2013_2014[sector="Data Center"] {marker-fill: #a3d895;} \n#mos_beb_2013_2014 {marker-fill: #DDDDDD;}';

        expect(sectorCSS).toBeDefined();
        expect(sectorCSS).toBe(cssVal);
    });

    it('should build CartoCSS for total_ghg', function () {
        var ghgCSS = Colors.getFieldCartoCSS('total_ghg');

        var cssVal = '#mos_beb_2013_2014 [total_ghg <= 258330] {marker-width: 25.0;}\n#mos_beb_2013_2014 [total_ghg <= 5311.3] {marker-width: 23.3;}\n#mos_beb_2013_2014 [total_ghg <= 2593.9] {marker-width: 21.7;}\n#mos_beb_2013_2014 [total_ghg <= 1671] {marker-width: 20.0;}\n#mos_beb_2013_2014 [total_ghg <= 1129.4] {marker-width: 18.3;}\n#mos_beb_2013_2014 [total_ghg <= 825.7] {marker-width: 16.7;}\n#mos_beb_2013_2014 [total_ghg <= 598.2] {marker-width: 15.0;}\n#mos_beb_2013_2014 [total_ghg <= 429.6] {marker-width: 13.3;}\n#mos_beb_2013_2014 [total_ghg <= 316.5] {marker-width: 11.7;}\n#mos_beb_2013_2014 [total_ghg <= 126.5] {marker-width: 10.0;}\n#mos_beb_2013_2014 [total_ghg = null] {marker-width: 0;}\n#mos_beb_2013_2014 [total_ghg = 0] {marker-width: 0;}\n';

        expect(ghgCSS).toBeDefined();
        expect(ghgCSS).toBe(cssVal);
    });

});
