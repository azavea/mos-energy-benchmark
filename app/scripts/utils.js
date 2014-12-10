(function () {
	'use strict';

	/**
	 * ngInject
	 */
	function Utils () {
		var module = {};

        module.strFormat = function (str, formatObject) {
            var formattedStr = str;
            angular.forEach(formatObject, function (value, key) {
                formattedStr = formattedStr.replace('{' + key + '}', value);
            });
            return formattedStr;
        };

        module.Events = {
            UpdateHeight: 'MOS:Utils:UpdateHeight'
        };

		return module;
	}

    /**
     * ngInject
     */
    function AutoHeight($timeout, $window, Utils) {
        var module = {};

        module.restrict = 'A';
        module.scope = true;
        module.link = function ($scope, element, attrs) {

            var selector = attrs.autoSelector || 'body > header.header';

            var updateHeight = function () {
                $timeout(function () {
                    // clientHeight for <= IE8
                    var windowHeight = $window.innerHeight || $window.clientHeight;
                    var headerHeight = $(selector).height();
                    element.height(windowHeight - headerHeight);
                });
            };

            updateHeight();
            $scope.$on(Utils.Events.UpdateHeight, updateHeight);

        };

        return module;
    }

	angular.module('mos.utils', [])
	.factory('Utils', Utils)
    .directive('autoHeight', AutoHeight);

})();
