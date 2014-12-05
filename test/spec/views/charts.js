describe('Controller: mos.views.charts.ChartsController', function () {
    'use strict';

    // load the controller's module
    beforeEach(module('mos'));

    var Controller;
    var scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        Controller = $controller('ChartsController', {
            $scope: scope
        });
    }));

    it('should stub a sample test', function () {
        expect(true).toBe(true);
    });
});