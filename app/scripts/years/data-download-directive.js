(function () {
    'use strict';

    /* ngInject */
    function DataDownload() {
        var module = {
            replace: true,
            restrict: 'AE',
            scope: {
            },
            templateUrl: 'scripts/years/data-download-partial.html',
            bindToController: true,
            controller: 'DataDownloadController',
            controllerAs: 'ctl'
        };
        return module;
    }

    angular.module('mos.years')
    .directive('mosDataDownload', DataDownload);

})();
