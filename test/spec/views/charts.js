describe('Controller: mos.views.charts.ChartsController', function () {
    'use strict';

    beforeEach(module('ui.router'));
    // load the controller's module
    beforeEach(module('mos'));

    var $injector = angular.injector(['ng', 'ngMock', 'mos']);
    var Controller;
    var scope;
    var ChartingUtils;
    var currentData = {
        data: {
            rows: []
        }
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ChartingUtils = $injector.get('ChartingUtils');
        Controller = $controller('ChartsController', {
            $scope: scope,
            ChartingUtils: ChartingUtils,
            currentData: currentData,
            currentAllData: currentData,
            previousData: currentData,
            groupedData: currentData
        });
    }));

    it('should stub a sample test', function () {
        expect(true).toBe(true);
    });
});
