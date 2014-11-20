'use strict'

var util = (function() {
  var module = {};

  module.seed = function(len, max) {
    var len = typeof len === 'undefined' ? 50 : len,
        max = typeof max === 'undefined' ? 100 : max,
        randoms = [];
    for (var i=0; i<len; i++) { randoms[i] = Math.round(Math.random()*max); }
    return randoms;
  };

  console.log(module.seed());

  return module;

}());



