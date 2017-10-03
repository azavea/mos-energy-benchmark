'use strict';

describe('Directive: mos.years.YearSelector', function () {

    beforeEach(module('mos'));

    var $compile;
    var $httpBackend;
    var $rootScope;

    // var yearsData = readJSON('test/spec/mock/years-data.json');

    // mock year and data table name
    beforeEach(module('mos.years', function ($provide) {
        var CartoSQLAPI = jasmine.createSpyObj('CartoSQLAPI', ['getCurrentYear',
                                                               'getTableName',
                                                               'getYearsData']);

        CartoSQLAPI.getCurrentYear.and.returnValue(2015);
        CartoSQLAPI.getTableName.and.returnValue('mos_beb_2013_2014_2015');
        CartoSQLAPI.getYearsData.and.returnValue({});

        $provide.value('CartoSQLAPI', CartoSQLAPI);
    }));

    beforeEach(inject(function (_$compile_, _$httpBackend_, _$rootScope_) {
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('should load current year', function () {
        var scope = $rootScope.$new();
        var element = $compile('<mos-year-selector></mos-year-selector>')(scope);

        var testHtml = '<div>{{ ctl.currentYear }}</div>';
        $httpBackend.expectGET('scripts/years/year-selector-partial.html').respond(200, testHtml);

        // TODO: load year data from mock instead of using spy?
        //$httpBackend.expectGET(/*mos_years*/).respond(200, yearsData);

        $httpBackend.expectGET(/*mos_beb*/).respond(200, {});

        $rootScope.$apply();

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingRequest();

        expect(element.html()).toEqual('2015');
    });
});
