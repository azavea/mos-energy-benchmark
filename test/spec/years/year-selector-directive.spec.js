'use strict';

describe('Directive: mos.years.YearSelector', function () {

    beforeEach(module('mos'));

    var $compile;
    var $httpBackend;
    var $rootScope;

    beforeEach(inject(function (_$compile_, _$httpBackend_, _$rootScope_) {
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('should load current year', function () {
        var scope = $rootScope.$new();
        var element = $compile('<mos-year-selector></mos-year-selector>')(scope);

        var testHtml = '<div>{{ ctl.currentYear }}</div>'
        $httpBackend.expectGET('scripts/years/year-selector-partial.html').respond(200, testHtml);
        $rootScope.$apply();

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingRequest();

        expect(element.html()).toEqual('2015');
    });
});
