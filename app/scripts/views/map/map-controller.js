(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($scope, $timeout, $compile) {
        // temp:  http://azavea-demo.cartodb.com/api/v2/viz/701a2d94-44f2-11e4-bb22-0e10bcd91c2b/viz.json
        // age: http://azavea-demo.cartodb.com/api/v2/viz/d9998c20-7bf6-11e4-b489-0e853d047bba/viz.json

        // initialization
        $scope.compare_selections = [];  // array of up to three selections to compare
        $scope.haveThree = false;

        // TODO: indicate that map is loading, hang on...
        console.log('in map controller; going to load map viz...');

        $scope.compare = function() {
            console.log('go compare ' + $scope.cartodb_id);
            if ($scope.haveThree) {
                // shouldn't get here (button is disabled)
                console.error('Cannot compare more than three items at a time');
            } else {
                // check to see if we have this one already
                if ($scope.compare_selections.indexOf($scope.cartodb_id) > -1) {
                    console.log('already have ' + $scope.cartodb_id + ' in comparison list');
                } else {
                    $scope.compare_selections.push($scope.cartodb_id);
                    $scope.haveThree = $scope.compare_selections.length >=3 ? true : false;
                }
            }
        };

        var popup_template = '<span>' +
              '<h4>Address:</h4>' +
              '<p>{{address}}</p>' +
              '<h4>Emissions:</h4>' +
              '<p>{{total_ghg}}</p>' +
              '<h4>ID:</h4>' + 
              '<p>{{cartodb_id}}</p>' +
              '<p><button ng-click="compare()" ng-disabled="haveThree">Compare</button></p>' +
              '</span>';

        // load map visualization
        cartodb.createVis('mymap', 'http://azavea-demo.cartodb.com/api/v2/viz/c5a9af6e-7f12-11e4-8f24-0e018d66dc29/viz.json',
                          {'infowindow': false})
            .done(function(vis, layers) {
                console.log('map viz loaded!');
                var nativeMap = vis.getNativeMap();
                var overlay = layers[1];

                // find the viz layer we want to interact with
                var sublayer = overlay.getSubLayer(0);
                sublayer.setInteraction(true);

                // give user a pointy hand when they hover over a feature
                sublayer.on('mouseover', function() {
                    $('.leaflet-container').css('cursor','pointer');
                });

                // go back to grabby hand for panning when they mouse away
                sublayer.on('mouseout', function() {
                    $('.leaflet-container').css('cursor', '-webkit-grab');
                    $('.leaflet-container').css('cursor', '-moz-grab');
                });

                sublayer.on('featureClick', function(e, latlng, pos, data, subLayerIndex) {

                    // TODO: something to indicate popup is loading, hang on...
                    console.log('hey, that tickles!');

                    // Go fetch data for this feature; 'data' object from click method only has
                    // the interactivity field, which is the cartodb_id.
                    var qry = 'SELECT cartodb_id, geocode_address, total_ghg, property_name ' + 
                    'FROM mos_beb_2013 where cartodb_id = {{id}}';
                    var sql = new cartodb.SQL({ user: 'azavea-demo'});
                    sql.execute(qry, { id: data.cartodb_id})
                        .done(function(data) {
                            var data = data.rows[0];
                            $scope.cartodb_id = data.cartodb_id;
                            $scope.address = data.geocode_address;
                            $scope.total_ghg = data.total_ghg;

                            var popup = $compile(popup_template)($scope);
                            $scope.$apply(); // tell Angular to really, really go compile now

                            L.popup({
                                minWidth: 100
                            }).setLatLng(latlng).setContent(popup[0]).openOn(nativeMap);

                        }).error(function(errors) {
                            // returns a list
                            console.log('errors: ' + errors);
                        });
                });
            });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();