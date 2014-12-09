(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($compile, $scope, $state, BuildingCompare, MappingService) {

        // initialization
        var vizLayer = null;
        var nativeMap = null;

        $scope.compare = {
            count: BuildingCompare.count(),
            isChecked: false,
            disabled: false
        };
        $scope.cartodbId = '';
        $scope.popupLoading = true;
        $scope.buildingTypes = [];
        $scope.filterType = MappingService.FILTER_NONE;

        // indicate that map is loading, hang on..
        $scope.mapLoading = true;

        $scope.filterBy = function(propertyType) {
            $scope.filterType = propertyType;
            MappingService.filterViz(vizLayer, propertyType);
        };

        $scope.setCompare = function(cartodbId) {
            if (BuildingCompare.count() < 3 && $scope.compare.isChecked) {
                BuildingCompare.add(cartodbId);
            } else if (!$scope.compare.isChecked) {
                BuildingCompare.remove(cartodbId);
            }
            $scope.compare.count = BuildingCompare.count();
        };

        $scope.gotoCompare = function () {
            $state.go('compare', {ids: BuildingCompare.list().join(',')});
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
          '<p><input type="checkbox" ng-model="compare.isChecked" ng-disabled="compare.disabled" ng-change="setCompare(cartodbId)" />Compare</p>',
          '<p><button ui-sref="detail({buildingId: cartodbId})">Full Report</button></p>',
          '</div></span>'].join('');

        var showPopup = function(coords) {
            // Set the properties of the compare object here so we ensure the popup always
            //  has the correct state on load
            $scope.compare.isChecked = BuildingCompare.hasId($scope.cartodbId);
            $scope.compare.disabled = !$scope.compare.isChecked && BuildingCompare.count() >= 3;
            var popup = $compile(popupTemplate)($scope);
            $scope.$apply(); // tell Angular to really, really go compile now
            L.popup({
                minWidth: 100
            }).setLatLng(coords).setContent(popup[0]).openOn(nativeMap);
        };

        // callback for service to set building categories
        var setBldgCategories = function(categories) {
            $scope.buildingTypes = categories;
        };

        // callback for service to set feature click query results
        var setClickedFeature = function(row, coords) {
            /* jshint camelcase: false */
            if (row) {
                $scope.cartodbId = row.cartodb_id.toString();
                $scope.address = row.geocode_address;
                $scope.totalGhg = row.total_ghg;
            } else {
                $scope.cartodbId = null;
                $scope.address = null;
                $scope.totalGhg = null;
            }

            $scope.popupLoading = false;
            showPopup(coords);
            /* jshint camelcase:true */
        };

        // fetch building categories for drop-down
        MappingService.getBldgCategories(setBldgCategories);

        // load map visualization
        cartodb.createVis('mymap', 'http://azavea-demo.cartodb.com/api/v2/viz/c5a9af6e-7f12-11e4-8f24-0e018d66dc29/viz.json',
                          {'infowindow': false, 'legends': true})
            .done(function(vis, layers) {
                $scope.mapLoading = false;
                nativeMap = vis.getNativeMap();
                var overlay = layers[1];

                // find the viz layer we want to interact with
                vizLayer = overlay.getSubLayer(0);
                vizLayer.setInteraction(true);

                // give user a pointy hand when they hover over a feature
                vizLayer.on('mouseover', function() {
                    $('.leaflet-container').css('cursor','pointer');
                });

                // go back to grabby hand for panning when they mouse away
                vizLayer.on('mouseout', function() {
                    $('.leaflet-container').css('cursor', '-webkit-grab');
                    $('.leaflet-container').css('cursor', '-moz-grab');
                });

                /* jshint camelcase:false */
                vizLayer.on('featureClick', function(e, latlng, pos, data) {

                    // show popup with spinner to indicate it's loading, hang on...
                    $scope.popupLoading = true;
                    showPopup(latlng);
                    MappingService.featureLookup(setClickedFeature, data.cartodb_id, latlng);
                });
                /* jshint camelcase:true */
            });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();
