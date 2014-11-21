
MOS.Util = (function(MOS) {
    'use strict';

    var module = {};

    module.seed = function(len, max) {
        len = typeof len === 'undefined' ? 50 : len;
        max = typeof max === 'undefined' ? 100 : max;
        var randoms = [];
        for (var i=0; i<len; i++) {
            randoms[i] = Math.round(Math.random()*max);
        }
        return randoms;
    };

    return module;

}(MOS));

