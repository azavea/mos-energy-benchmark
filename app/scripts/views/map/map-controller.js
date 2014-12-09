(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($scope, $compile, BuildingCompare) {
        // temp:  http://azavea-demo.cartodb.com/api/v2/viz/701a2d94-44f2-11e4-bb22-0e10bcd91c2b/viz.json
        // age: http://azavea-demo.cartodb.com/api/v2/viz/d9998c20-7bf6-11e4-b489-0e853d047bba/viz.json

        // initialization
        $scope.haveThree = false;
        $scope.popupLoading = true;

        // indicate that map is loading, hang on...
        $scope.mapLoading = true;

        $scope.status = {
            isopen: false
        };

        $scope.toggled = function(open) {
            console.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function($event) {
            console.log('toggling happened!');
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.compare = function() {
            if ($scope.haveThree) {
                // shouldn't get here (button is disabled)
                console.error('Cannot compare more than three items at a time');
            } else {
                BuildingCompare.add($scope.cartodb_id);
                $scope.haveThree = BuildingCompare.count() >=3 ? true : false;
            }
        };

        var popup_template = ['<span>',
          '<div ng-show="popupLoading" class="spinner">',
          '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>',
          '</div>',
          '<div ng-hide="popupLoading"><h4>Address:</h4>',
          '<p>{{address}}</p>',
          '<h4>Emissions:</h4>',
          '<p>{{total_ghg}}</p>',
          '<h4>ID:</h4>', 
          '<p>{{cartodb_id}}</p>',
          '<p><button ng-click="compare()" ng-disabled="haveThree">Compare</button></p>',
          '</div></span>'].join('');

        var showPopup = function(map, coords) {
            var popup = $compile(popup_template)($scope);
            $scope.$apply(); // tell Angular to really, really go compile now
            L.popup({
                minWidth: 100
            }).setLatLng(coords).setContent(popup[0]).openOn(map);
        };

        // load map visualization
        cartodb.createVis('mymap', 'http://azavea-demo.cartodb.com/api/v2/viz/c5a9af6e-7f12-11e4-8f24-0e018d66dc29/viz.json',
                          {'infowindow': false})
            .done(function(vis, layers) {
                $scope.mapLoading = false;
                console.log('done');
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

                    // show popup with spinner to indicate it's loading, hang on...
                    $scope.popupLoading = true;
                    showPopup(nativeMap, latlng);
                    
                    // Go fetch data for this feature; 'data' object from click method only has
                    // the interactivity field, which is the cartodb_id.
                    var qry = 'SELECT cartodb_id, geocode_address, total_ghg, property_name ' + 
                    'FROM mos_beb_2013 where cartodb_id = {{id}}';
                    var sql = new cartodb.SQL({ user: 'azavea-demo'});
                    sql.execute(qry, { id: data.cartodb_id})
                        .done(function(data) {
                            var data = data.rows[0];
                            $scope.cartodb_id = data.cartodb_id.toString();
                            $scope.address = data.geocode_address;
                            $scope.total_ghg = data.total_ghg;

                            // update popup now we have the data
                            $scope.popupLoading = false;
                            showPopup(nativeMap, latlng);

                        }).error(function(errors) {
                            // returns a list
                            console.error('errors: ' + errors);
                        });
                });
            });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();