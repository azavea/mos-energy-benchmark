describe('Factory: mos.compare.BuildingCompare', function () {
    'use strict';

    var buildingCompare;
    var cookieStoreSpy;

    beforeEach(module('mos.compare', function ($provide) {
        cookieStoreSpy = jasmine.createSpyObj('$cookieStore', ['get', 'put', 'remove']);

        $provide.value('$cookieStore', cookieStoreSpy);
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_BuildingCompare_) {
        buildingCompare = _BuildingCompare_;
    }));

    it('should return an empty array by default', function () {
        expect(buildingCompare.list()).toEqual([]);
    });

    it ('should add a string id', function () {
        buildingCompare.add('a');
        expect(buildingCompare.list()).toEqual(['a']);
        expect(buildingCompare.count()).toEqual(1);
    });

    it ('should remove a string id', function () {
        buildingCompare.add('a');
        expect(buildingCompare.list()).toEqual(['a']);
        buildingCompare.remove('a');
        expect(buildingCompare.list()).toEqual([]);
    });

    it ('should require a string in the add method', function () {
        buildingCompare.add(null);
        expect(buildingCompare.list()).toEqual([]);
        buildingCompare.add(1);
        expect(buildingCompare.list()).toEqual([]);
    });

    it ('should return the removed value in remove', function () {
        buildingCompare.add('a');
        buildingCompare.add('b');
        var removed = buildingCompare.remove('a');
        expect(removed).toEqual(['a']);
        removed = buildingCompare.remove('d');
        expect(removed).toEqual(null);
        removed = buildingCompare.remove(undefined);
        expect(removed).toEqual(null);
    });

    it ('should clear the array after a call to clear', function () {
        buildingCompare.add('a');
        buildingCompare.add('b');
        expect(buildingCompare.list()).toEqual(['a', 'b']);
        buildingCompare.clear();
        expect(buildingCompare.list()).toEqual([]);
        expect(buildingCompare.count()).toEqual(0);
    });

    it ('should call $cookieStore.put on add()', function () {
        buildingCompare.add('a');
        expect(cookieStoreSpy.put).toHaveBeenCalled();
    });

    it ('should call $cookieStore.put on remove()', function () {
        buildingCompare.add('a');
        cookieStoreSpy.put.calls.reset();       // need to reset calls since add calls put as well
        buildingCompare.remove('a');
        expect(cookieStoreSpy.put).toHaveBeenCalled();
    });


    it ('should call $cookieStore.remove on clear()', function () {
        buildingCompare.clear();
        expect(cookieStoreSpy.remove).toHaveBeenCalled();
    });
});