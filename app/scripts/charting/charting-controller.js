/**
 * ChartingController
 *
 *  Reusable controller for every mos charting directive
 *
 *  Provides:
 *      - A configure function that each directive link function must call to
 *          initialize the $scope.config property
 *      - A blank $scope.plot function that each directive must override. This function takes
 *          the data to plot and performs the actual d3 plotting
 *      - Handles the $scope.watch for new data to update the chart
 *
 */
(function () {
    'use strict';

    /**
     * ngInject
     */
    function ChartingController($scope, $attrs, $element, Utils) {

        var defaultMargins = {left: 30, top: 10, bottom: 30, right: 10};
        $scope.config = {};

        $scope.setDefaultMargins = function (margins) {
            defaultMargins = margins;
        };

        // Configures the scope.config object with the defaults selected, overriding from
        //  directive attributes if the attribute exists
        // Also initializes the margins object separately from the one-way bound attributes
        $scope.configure = function (defaults) {
            angular.forEach(defaults, function (defaultValue, key) {
                var attr = $attrs[key];
                $scope.config[key] = angular.isDefined(attr) ? $scope.$eval(attr) : defaultValue;
            });
            $scope.config.margin = initializeMargins($attrs.margin);
            $scope.plotComplete = false;
        };

        // Wrapper for the plot function, called from $scope.$watch
        $scope.redraw = function (data) {
            if (!data || $scope.plotComplete || !Utils.inViewPort($element)) {
                return;
            }
            $scope.plot(data);
            $scope.plotComplete = true;
        };

        // OVERRIDE
        $scope.plot = function () {};

        $scope.$watch('data', function (newData) {
            $scope.redraw(newData);
        });

        Utils.onPanelSnap($element, function () {
            $scope.redraw($scope.data);
        });

        /**
         * Init margins when passed either an object with properties left/top/bottom/right or an int
         *
         * @param margins Int|Object
         *
         * @returns Object {left: Int, top: Int, bottom: Int, right: Int}
         */
        function initializeMargins(margins) {
            var margin = ($scope.$eval(margins) || defaultMargins);
            if (typeof(margin) !== 'object') {
                // we were passed a vanilla int, convert to full margin object
                margin = {left: margin, top: margin, bottom: margin, right: margin};
            }
            return margin;
        }
    }

    angular.module('mos.charting')
    .controller('ChartingController', ChartingController);

})();
