(function () {
    'use strict';

    /* ngInject */
    function HeadroomReset() {
        var module = {};

        module.restrict = 'A';

        module.link = function ($scope, element) {
            $scope.$on('$stateChangeStart', function () {
                element.addClass('headroom headroom--top');
                element.removeClass('headroom--not-top headroom--unpinned headroom--pinned');
            });
        };

        return module;
    }

    angular.module('mos')
    .directive('headroomReset', HeadroomReset);

})();