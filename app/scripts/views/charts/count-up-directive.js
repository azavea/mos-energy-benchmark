(function () {
    'use strict';

    /**
     * ngInject
     */
    function countUp ($timeout, Utils) {
        // Begin directive module definition
        var module = {};
        module.restrict = 'A';

        module.link = function ($scope, element, attrs) {
            var num = 0;
            var step = 0;
            var refreshMillis = 30;
            var finalValue= parseInt(attrs.mosCountUp, 10);
            var totalMillis = parseFloat(attrs.seconds || 1) * 1000;
            var steps = Math.ceil(totalMillis / refreshMillis);
            var increment = finalValue / steps;
            var timeout = null;

            Utils.onPanelSnap(element, function() {
                if (!timeout && Utils.inViewPort(element)) {
                    tick();
                }
            });

            // Recursively increments the value until the finalValue is reached
            var tick = function () {
                timeout = $timeout(function() {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(timeout);
                        num = finalValue;
                        element[0].textContent = num.toLocaleString();
                    } else {
                        element[0].textContent = Math.round(num).toLocaleString();
                        tick();
                    }
                }, refreshMillis);
            };
        };

        return module;
    }

    angular.module('mos.charting')
    .directive('mosCountUp', countUp);

})();
