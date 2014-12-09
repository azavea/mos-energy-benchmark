(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($scope, $compile, BuildingCompare) {

        // initialization
        var FILTER_NONE = 'All types';
        var vizLayer = null;

        $scope.haveThree = false;
        $scope.popupLoading = true;
        $scope.buildingTypes = [];
        $scope.filterType = FILTER_NONE;

        // indicate that map is loading, hang on...
        $scope.mapLoading = true;

        var filterViz = function() {
            if (!vizLayer) {
                console.error('cannot filter; there is no viz!');
                return;
            }
            if ($scope.filterType === FILTER_NONE) {
                vizLayer.setSQL("select * from mos_beb_2013");
            } else {
                vizLayer.setSQL("select * from mos_beb_2013 where primary_property_type ='" + $scope.filterType + "';");
            }
        };

        $scope.filterBy = function(propertyType) {
            $scope.filterType = propertyType;
            filterViz();
        };

        var getBldgCategories = function() {
            var qry = 'SELECT DISTINCT primary_property_type FROM mos_beb_2013;';
            var sql = new cartodb.SQL({ user: 'azavea-demo'});
            sql.execute(qry)
                .done(function(data) {
                    $scope.buildingTypes = [{'primary_property_type': FILTER_NONE}];
                    $scope.buildingTypes = data.rows;
                }).error(function(errors) {
                    // returns a list
                    console.error('errors fetching property types: ' + errors);
                });
        };

        $scope.compare = function() {
            if ($scope.haveThree) {
                // shouldn't get here (button is disabled)
                console.error('Cannot compare more than three items at a time');
            } else {
                BuildingCompare.add($scope.cartodbId);
                $scope.haveThree = BuildingCompare.count() >=3 ? true : false;
            }
        };

        var popupTemplate = ['<span>',
          '<div ng-show="popupLoading" class="spinner">',
          '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>',
          '</div>',
          '<div ng-hide="popupLoading"><h4>Address:</h4>',
          '<p>{{::address}}</p>',
          '<h4>Emissions:</h4>',
          '<p>{{::totalGhg}}</p>',
          '<h4>ID:</h4>', 
          '<p>{{::cartodbId}}</p>',
          '<p><button ng-click="compare()" ng-disabled="haveThree">Compare</button></p>',
          '<p><button ui-sref="detail({buildingId: cartodbId})">Full Report</button></p>',
          '</div></span>'].join('');

        var showPopup = function(map, coords) {
            var popup = $compile(popupTemplate)($scope);
            $scope.$apply(); // tell Angular to really, really go compile now
            L.popup({
                minWidth: 100
            }).setLatLng(coords).setContent(popup[0]).openOn(map);
        };

        // fetch building categories
        getBldgCategories();

        // load map visualization
        cartodb.createVis('mymap', 'http://azavea-demo.cartodb.com/api/v2/viz/c5a9af6e-7f12-11e4-8f24-0e018d66dc29/viz.json',
                          {'infowindow': false})
            .done(function(vis, layers) {
                $scope.mapLoading = false;
                var nativeMap = vis.getNativeMap();
                var overlay = layers[1];

                // find the viz layer we want to interact with
                var sublayer = overlay.getSubLayer(0);
                sublayer.setInteraction(true);

                // keep track of the visualization layer so we can filter it later
                vizLayer = sublayer;

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
                    /* jshint camelcase: false */
                    var qry = 'SELECT cartodb_id, geocode_address, total_ghg, property_name ' + 
                    'FROM mos_beb_2013 where cartodb_id = {{id}}';
                    var sql = new cartodb.SQL({ user: 'azavea-demo'});
                    sql.execute(qry, { id: data.cartodb_id})
                        .done(function(data) {
                            var data = data.rows[0];
                            $scope.cartodbId = data.cartodb_id.toString();
                            $scope.address = data.geocode_address;
                            $scope.totalGhg = data.total_ghg;

                            // update popup now we have the data
                            $scope.popupLoading = false;
                            showPopup(nativeMap, latlng);

                        }).error(function(errors) {
                            // returns a list
                            console.error('errors fetching property data: ' + errors);
                        });
                        /* jshint camelcase:true */
                });
            });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();
