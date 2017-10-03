(function () {
    'use strict';

    /*
     * ngInject
     */
    function HeaderBarController(CartoSQLAPI) {

        var ctl = this;

        ctl.year = CartoSQLAPI.getCurrentYear();

    }

    angular.module('mos.headerbar')
    .controller('HeaderBarController', HeaderBarController);

})();
