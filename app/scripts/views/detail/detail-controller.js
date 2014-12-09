(function () {
    'use strict';

    /*
     * ngInject
     */
    function DetailController(buildingData) {
        console.log('detail: ', buildingData.data);
    }

    angular.module('mos.views.detail')
    .controller('DetailController', DetailController);

})();
