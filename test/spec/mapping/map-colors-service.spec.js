describe('Factory: mos.mapping.MapColorService', function () {
    'use strict';

    // load the module
    beforeEach(module('mos'));

    var $injector = angular.injector(['mos']);
    var MapColors;
    var CartoConfig;
    var MosColors;

    // Initialize the service
    beforeEach(inject(function (_MapColorService_) {
        MosColors = $injector.get('MOSColors');
        CartoConfig = $injector.get('CartoConfig');
        MapColors = _MapColorService_;
    }));

    it('should have base CartoCSS', function () {
        expect(MapColors.baseCartoCSS).toBeDefined();
    });

    it('should get legend options', function () {
        var floorLegend = MapColors.legendOptions('floor_area');
        expect(floorLegend).toBeDefined();
        expect(floorLegend.left).toBe('59200');
        expect(floorLegend.colors).toContain('#DF65B0');
    });

    it('should build CartoCSS for sector', function () {
        var sectorCSS = MapColors.getFieldCartoCSS('sector');

        var cssVal = '#mos_beb_2013[sector="School  (K-12)"] {marker-fill: #A6CEE3;} #mos_beb_2013[sector="Office"] {marker-fill: #1F78B4;} #mos_beb_2013[sector="Warehouse"] {marker-fill: #B2DF8A;} #mos_beb_2013[sector="College/ University"] {marker-fill: #33A02C;} #mos_beb_2013[sector="Other"] {marker-fill: #FB9A99;} #mos_beb_2013[sector="Retail"] {marker-fill: #E31A1C;} #mos_beb_2013[sector="Municipal"] {marker-fill: #FDBF6F;} #mos_beb_2013[sector="Multifamily"] {marker-fill: #FF7F00;} #mos_beb_2013[sector="Hotel"] {marker-fill: #CAB2D6;} #mos_beb_2013[sector="Industrial"] {marker-fill: #6A3D9A;} \n#mos_beb_2013 {marker-fill: #DDDDDD;}';

        expect(sectorCSS).toBeDefined();
        expect(sectorCSS).toBe(cssVal);
    });

    it('should build CartoCSS for total_ghg', function () {
        var ghgCSS = MapColors.getFieldCartoCSS('total_ghg');
        
        var cssVal = '#mos_beb_2013 [total_ghg <= 258330] {marker-width: 25.0;}\n#mos_beb_2013 [total_ghg <= 5311.3] {marker-width: 23.3;}\n#mos_beb_2013 [total_ghg <= 2593.9] {marker-width: 21.7;}\n#mos_beb_2013 [total_ghg <= 1671] {marker-width: 20.0;}\n#mos_beb_2013 [total_ghg <= 1129.4] {marker-width: 18.3;}\n#mos_beb_2013 [total_ghg <= 825.7] {marker-width: 16.7;}\n#mos_beb_2013 [total_ghg <= 598.2] {marker-width: 15.0;}\n#mos_beb_2013 [total_ghg <= 429.6] {marker-width: 13.3;}\n#mos_beb_2013 [total_ghg <= 316.5] {marker-width: 11.7;}\n#mos_beb_2013 [total_ghg <= 126.5] {marker-width: 10.0;}\n';
        
        expect(ghgCSS).toBeDefined();
        expect(ghgCSS).toBe(cssVal);
    });
    
});
