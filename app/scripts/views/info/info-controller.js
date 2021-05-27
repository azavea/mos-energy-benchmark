(function () {
    'use strict';

    /*
     * ngInject
     */
    function InfoController($scope, CartoSQLAPI, infoData) {

        $scope.info = infoData;

        $scope.yearsString = '';
        setYearsString(CartoSQLAPI.years);

        // Strip the scheme from a url, for presentation as link text
        $scope.getPrettyUrl = function(url) {
           var splits = _.split(url, '//');
           if (splits && splits.length > 1) {
            return splits[1];
           }
           return url;
        };

        // Update years values and download links after they have been loaded from Carto
        $scope.$on('mos.cartodb:years', function(event, data) {
            setYearsString(data);
        });

        // Helper to build a pretty string of the years in the app, like "2013, 2014, and 2015"
        function setYearsString(years) {
            if (years && years.length > 1) {
                // get years in ascending order without modifying original
                var yrs = years.slice().reverse();
                $scope.yearsString = [_.dropRight(yrs, 1).join(', '),
                                      ', and ',
                                      _.last(yrs)].join('');
            }
        }
    }

    angular.module('mos.views.info')
    .controller('InfoController', InfoController);

})();
