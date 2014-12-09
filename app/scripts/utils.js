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

		return module;
	}

	angular.module('mos.utils', [])
	.factory('Utils', Utils);

})();
