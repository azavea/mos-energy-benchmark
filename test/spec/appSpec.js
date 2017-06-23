describe('Midway: MOS Modules', function() {
  'use strict';

  var mymodule;
  var MosColors;
  var MosCssValues;

  beforeEach(module('mos'));

  beforeEach(function () {
    mymodule = angular.module('mos');
  });

  var $injector = angular.injector(['ng', 'ngMock', 'mos']);

  beforeEach(inject(function () {
    MosColors = $injector.get('MOSColors');
    MosCssValues = $injector.get('MOSCSSValues');
  }));

  it('should be registered', function() {
    expect(mymodule).toBeDefined();
  });

  describe('Dependencies:', function() {

    var deps;
    var hasModule = function(m) {
      return deps.indexOf(m) >= 0;
    };
    beforeEach(function() {
      deps = mymodule.requires;
    });

    it('should have mos.views dependencies', function() {
      expect(hasModule('mos.views.charts')).toBe(true);
      expect(hasModule('mos.views.map')).toBe(true);
      expect(hasModule('mos.views.info')).toBe(true);
      expect(hasModule('mos.views.detail')).toBe(true);
      expect(hasModule('mos.views.compare')).toBe(true);
    });

    it('should have MOSColors constant defined', function() {
      expect(MosColors).toBeDefined();
      expect(MosColors.Unknown).toBeDefined();
    });

    it('should have MOSCSSValues constant defined', function() {
      expect(MosCssValues).toBeDefined();
      expect(MosCssValues.steam.bins).toBeDefined();
    });

  });
});
