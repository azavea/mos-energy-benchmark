describe('Factory: mos.years.YearService', function () {
    'use strict';

    beforeEach(module('mos'));

    var YearService;

    var yearsData = readJSON('test/spec/mock/years-data.json');
    console.log(yearsData);

    beforeEach(inject(function (_YearService_) {
        YearService = _YearService_;
    }));

    it('should use default year', function () {
        expect(YearService.getCurrentYear()).toBe(2015);
    });

});
