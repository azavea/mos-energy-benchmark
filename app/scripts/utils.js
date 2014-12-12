(function () {
    'use strict';

    /**
     * ngInject
     */
    function Utils ($document) {
        var module = {};

        module.strFormat = function (str, formatObject) {
            var formattedStr = str;
            angular.forEach(formatObject, function (value, key) {
                formattedStr = formattedStr.replace('{' + key + '}', value);
            });
            return formattedStr;
        };

        /**
         *  Checks if an element is currently visible in the viewport
         *
         *  @param {DOM element} element to check for visibility
         *  @returns {boolean} true if the element is currently visible in the viewport
         */
        module.inViewPort = function (element) {
            var height = $document[0].documentElement.clientHeight;
            var width = $document[0].documentElement.clientWidth;
            var r = element[0].getBoundingClientRect();
            return r.top >= 0 && r.bottom <= height && r.left >= 0 && r.right <= width;
        };

        /**
         *  Triggers a callback when a panel snap occurs
         *
         *  @param {DOM element} child element of a panel snap container
         *  @param {function} callback that is called when the panel snaps
         */
        module.onPanelSnap = function (element, callback) {
            var panelSnapContainer = $(element[0]).parents('.panel-snap-container');
            panelSnapContainer.on('panelsnap:finish', function (event) {
                callback(event);
            });
        };

        return module;
    }

    angular.module('mos.utils', [])
        .factory('Utils', Utils);

})();
