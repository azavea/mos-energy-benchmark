(function () {
    'use strict';

    /* ngInject */
    function HeadroomReset($transitions) {
        var module = {};

        module.restrict = 'A';

        module.link = function ($scope, element) {
            $transitions.onStart({}, function() {
                element.addClass('headroom headroom--top');
                element.removeClass('headroom--not-top headroom--unpinned headroom--pinned');
            });
        };

        return module;
    }

    angular.module('mos')
    .directive('headroomReset', HeadroomReset);

})();
