
(function () {
    'use strict';

    /**
     * ngInject
     */
    function BuildingCompare ($cookieStore) {

        var COOKIE_KEY = 'mos.compare.buildingcompare.compareids';
        var buildingIds = $cookieStore.get(COOKIE_KEY) || [];

        var module = {};

        module.add = function (buildingId) {
            if (typeof buildingId === 'string' && _.indexOf(buildingIds, buildingId) === -1) {
                buildingIds.push(buildingId);
                $cookieStore.put(COOKIE_KEY, buildingIds);
            }
        };

        module.remove = function (buildingId) {
            if (typeof buildingId !== 'string') {
                return null;
            }
            var index = _.indexOf(buildingIds, buildingId);
            var value = null;
            if (index !== -1) {
                value = buildingIds.splice(index, 1);
                $cookieStore.put(COOKIE_KEY, buildingIds);
            }
            return value;
        };

        module.hasId = function (buildingId) {
            return _.indexOf(buildingIds, buildingId) !== -1 ? true : false;
        };

        module.list = function () {
            return buildingIds;
        };

        module.count = function () {
            return buildingIds.length;
        };

        module.clear = function () {
            buildingIds = [];
            $cookieStore.remove(COOKIE_KEY);
        };

        return module;
    }

    angular.module('mos.compare')
    .factory('BuildingCompare', BuildingCompare);

})();
