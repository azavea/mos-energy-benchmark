describe('Midway: MOS Modules', function() {
  'use strict';

  var mymodule;
  var MosColors;

  beforeEach(module('mos'));
  var $injector = angular.injector(['mos']);

  beforeEach(function () {
    mymodule = angular.module('mos');
  });

  beforeEach(inject(function () {
      MosColors = $injector.get('MOSColors');
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

  });
});