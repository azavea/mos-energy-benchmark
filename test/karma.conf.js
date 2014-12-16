// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-12-04 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/d3/d3.js',
      'bower_components/d3-tip/index.js',
      'bower_components/lodash/dist/lodash.compat.js',
      'bower_components/headroom.js/dist/headroom.js',
      'bower_components/headroom.js/dist/angular.headroom.js',

      // Karma has problems with this file, but it's not needed for tests, commenting out
      //'bower_components/panelsnap/jquery.panelSnap.js',

      // Add app scripts here, same order as in index.html
      'app/scripts/utils.js',
      'app/scripts/cartodb/cartodb-api-config.js',
      'app/scripts/cartodb/cartodb-api-service.js',
      'app/scripts/cartodb/cartodb-filters.js',
      'app/scripts/colors/module.js',
      'app/scripts/colors/color-service.js',
      'app/scripts/charting/module.js',
      'app/scripts/charting/charting-service.js',
      'app/scripts/charting/charting-controller.js',
      'app/scripts/charting/barchart-directive.js',
      'app/scripts/charting/scatterplot-directive.js',
      'app/scripts/compare/module.js',
      'app/scripts/compare/compare-service.js',
      'app/scripts/mapping/module.js',
      'app/scripts/mapping/mapping-service.js',
      'app/scripts/views/charts/module.js',
      'app/scripts/views/charts/charts-controller.js',
      'app/scripts/views/charts/count-up-directive.js',
      'app/scripts/views/charts/panel-snap-directive.js',
      'app/scripts/views/map/module.js',
      'app/scripts/views/map/map-controller.js',
      'app/scripts/views/info/module.js',
      'app/scripts/views/info/info-controller.js',
      'app/scripts/views/detail/module.js',
      'app/scripts/views/detail/detail-controller.js',
      'app/scripts/views/compare/module.js',
      'app/scripts/views/compare/compare-controller.js',
      'app/scripts/app.js',
      'http://libs.cartocdn.com/cartodb.js/v3/3.11/cartodb.js',

      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
