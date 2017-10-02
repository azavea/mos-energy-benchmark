(function () {
'use strict';

    /**
     * Abstract base state that ensures Carto table of years is loaded before rest of app
     * initializes. All other Carto queries depend on knowing what the available years are.
     *
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('root', {
            abstract: true,
            controller: 'RootController',
            template:'<ui-view/>',
            resolve : {
                yearData: function (CartoSQLAPI) {
                    return CartoSQLAPI.getYearsData();
                }
            }
        });
    }

    /**
     * @ngdoc overview
     * @name mos
     * @description
     * # mos
     */
    angular
      .module('mos.root', [
        'ui.router',
        'mos.cartodb',
        'mos.utils'
      ]).config(StateConfig);

})();
