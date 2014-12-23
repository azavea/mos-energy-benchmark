(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($compile, $q, $scope, $state, $timeout, BuildingCompare, MappingService, ColorService) {

        // indicate that map is loading, hang on..
        $scope.mapLoading = true;

        // setup overlay div for loading detail/compare views
        var overlayTriggerMillis = 300;
        $scope.loadingView = false;

        // initialization
        var vizLayer = null;
        var nativeMap = null;

        $scope.popupLoading = true;

        $scope.compare = {
            count: BuildingCompare.count(),
            isChecked: false,
            disabled: false
        };

        $scope.buildingTypes = [];
        $scope.filterType = MappingService.FILTER_NONE;
        $scope.searchText = '';
        $scope.noResults = false;
        $scope.amSearching = false;

        $scope.colorByTypes = ColorService.getColorByFields();
        $scope.sizeByTypes = ColorService.getSizeByFields();

        $scope.selections = {
            colorType: 'sector',
            sizeType: 'site_eui',
            filterType: MappingService.FILTER_NONE
        };

        // helper function to set or unset property data from a result row
        var setPropertyData = function(row) {
            if (row) {
                /* jshint camelcase:false */
                $scope.propertyData = {
                    cartodbId: row.cartodb_id.toString(),
                    buildingId: row.phl_bldg_id,
                    propertyName: row.property_name,
                    floorArea: row.floor_area,
                    address: row.address,
                    totalGhg: row.total_ghg,
                    siteEui: row.site_eui,
                    energyStar: row.energy_star,
                    sector: row.sector
                };
                /* jshint camelcase:true */

            // get the color for this location's sector
            $scope.propertyData.sectorColor =
                ColorService.findSectorColor($scope.propertyData.sector);

            } else {
                // row is null; unset property data
                $scope.propertyData = {
                    cartodbId: '',
                    buildingId: '',
                    propertyName: '',
                    address: '',
                    floorArea: '',
                    totalGhg: '',
                    siteEui: '',
                    energyStar: '',
                    sector: '',
                    sectorColor: 'transparent'
                };
            }
        };

        // initialize property data
        setPropertyData(null);

        // when user edits search text field, clear feedback messages on it
        $scope.clearErrorMsg = function() {
            $scope.noResults = false;
            $scope.amSearching = false;
        };

        $scope.suggest = function () {
            $scope.noResults = false;
            $scope.amSearching = true;
            var dfd = $q.defer();
            MappingService.suggest($scope.searchText).then(function (data) {
                if (!data.length) {
                    $scope.noResults = true;
                }
                dfd.resolve(data);
            }, function () {
                $scope.noResults = true;
                dfd.resolve([]);
            }).finally(function () {
                $scope.amSearching = false;
            });
            return dfd.promise;
        };

        $scope.searchMap = function() {
            $scope.amSearching = true;

            if (!$scope.searchText || $scope.searchText.length < 5) {
                // nothing to search for
                $scope.noResults = true;
                $scope.amSearching = false;
                return;
            }

            // if entered search text is numeric, try searching by property ID
            if (!isNaN($scope.searchText)) {
                MappingService.featureLookupByBldgId($scope.searchText)
                    .done(function(data) {
                        if (!data.rows || data.rows.length < 1) {
                            $scope.noResults = true;
                            $scope.amSearching = false;
                            return;
                        }

                        // pan to location found and open its pop-up
                        var row = data.rows[0];
                        setPropertyData(row);
                        var latlng = L.latLng(row.y, row.x);
                        $scope.popupLoading = false;
                        $scope.amSearching = false;
                        nativeMap.panTo(latlng);
                        showPopup(latlng);
                        nativeMap.setZoom(16);

                    }).error(function(errors) {
                        console.error('errors fetching property by building ID: ' + errors);
                        setPropertyData(null);
                        $scope.popupLoading = false;
                        $scope.amSearching = false;
                        $scope.noResults = true;
                    });
            } else {
                // geocode address and pan to the spot
                MappingService.geocode($scope.searchText).then(function(data) {
                    if (!data.length) {
                        console.error('Could not find address!');
                        $scope.noResults = true;
                        $scope.amSearching = false;
                        return;
                    }

                    var result = data[0];
                    $scope.noResults = false;
                    $scope.amSearching = false;

                    // show popup with found addresss display name
                    var geometry = result.feature.geometry;
                    var latlng = L.latLng(geometry.y, geometry.x);
                    nativeMap.panTo(latlng, {animate: true});
                    var geocodePopupTemplate = [
                        '<span class="featurePopup"><div class="headerPopup"></div>',
                        '<div class="popupContent"><p>{{::geocodedDisplayName}}</p></div></span>'
                    ].join('');
                    var attrs = result.feature.attributes;
                    /* jshint camelcase:false */
                    $scope.geocodedDisplayName = [
                        attrs.StAddr,
                        attrs.City,
                        attrs.Postal
                    ].join(', ');
                    /* jshint camelcase:true */
                    var popup = $compile(geocodePopupTemplate)($scope);
                    L.popup({
                        minWidth: 200
                    }).setLatLng(latlng).setContent(popup[0]).openOn(nativeMap);
                    nativeMap.setZoom(16);

                }, function(err) {
                    console.error(err);
                    $scope.amSearching = false;
                    $scope.noResults = true;
                });
            }
        };

        $scope.filterBy = function(sector) {
            $scope.selections.filterType = sector;
            MappingService.filterViz(vizLayer, sector);
        };

        $scope.setSelection = function(field, selection) {
            $scope.selections[field] = selection;
            MappingService.setVizCartoCSS(vizLayer,
                                          $scope.selections.colorType,
                                          $scope.selections.sizeType);
            setLegends();
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

        var popupTemplate = ['<span class="featurePopup">',
          '<div ng-show="popupLoading" class="spinner">',
          '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
          '<div ng-hide="popupLoading"><div class="headerPopup" ',
          'ng-style="{\'background-color\': \'{{::propertyData.sectorColor}}\' }">',
          '<h4>{{::propertyData.propertyName}}</h4>',
          '<p class="popup-header">OPA Number: {{::propertyData.buildingId}}</p>',
          '<p class="popup-header" ng-if="propertyData.address !== propertyData.propertyName">{{::propertyData.address}}</p>',
          '<p class="popup-header">{{::propertyData.floorArea.toLocaleString()}} sq ft</p></div>',
          '<div class="popupContent">',
          '<p>Site EUI: <strong>{{::propertyData.siteEui.toLocaleString()}}</strong></p>',
          '<p>Emissions: <strong>{{::propertyData.totalGhg.toLocaleString()}}</strong></p>',
          '<p ng-show="propertyData.energyStar">Energy Star: <strong>{{::propertyData.energyStar.toLocaleString()}}</strong></p>',
          '<br>',
          '<p><label><input type="checkbox" ng-model="compare.isChecked" ng-disabled="compare.disabled" ',
          'ng-change="setCompare(propertyData.cartodbId)" /> <em>Compare</em></label>',
          '<button type="button" class="pull-right btn btn-popover" ',
          'ng-style="{\'background-color\': \'{{::propertyData.sectorColor}}\',  \'opacity\': 0.8 }" ',
          'ui-sref="detail({buildingId: propertyData.cartodbId})">Full Report</button></p>',
          '</div></div></span>'].join('');

        var showPopup = function(coords) {
            // Set the properties of the compare object here so we ensure the popup always
            //  has the correct state on load
            $scope.compare.isChecked = BuildingCompare.hasId($scope.propertyData.cartodbId);
            $scope.compare.disabled = !$scope.compare.isChecked && BuildingCompare.count() >= 3;

            var popup = $compile(popupTemplate)($scope);
            $scope.$apply(); // tell Angular to really, really go compile now

            L.popup({
                minWidth: 220
            }).setLatLng(coords).setContent(popup[0]).openOn(nativeMap);
        };

        // fetch building categories for drop-down
        MappingService.getBldgCategories()
            .done(function(data) {
                $scope.buildingTypes = [MappingService.FILTER_NONE];
                angular.forEach(data.rows, function(value) {
                    $scope.buildingTypes.push(value.sector);
                });
            }).error(function(errors) {
                // returns a list
                console.error('errors fetching property types: ' + errors);
                $scope.buildingTypes = [module.FILTER_NONE];
            });

        // add legends for feature size and color
        var setLegends = function() {
            // first remove previous legends
            $('div.cartodb-legend.bubble').remove();
            $('div.cartodb-legend.choropleth').remove();
            $('div.cartodb-legend.custom').remove();
            $('#mymap').append(ColorService.getLegend($scope.selections.sizeType));
            $('#mymap').append(ColorService.getLegend($scope.selections.colorType));
        };

        $scope.$on('$stateChangeStart', function () {
            $timeout(function () {
                $scope.loadingView = true;
            }, overlayTriggerMillis);
        });

        // load map visualization
        cartodb.createVis('mymap', 'http://azavea-demo.cartodb.com/api/v2/viz/3a56f79c-87d1-11e4-b8a5-0e9d821ea90d/viz.json',
                          {'infowindow': false, 'legends': false, 'searchControl': false, 'loaderControl': true})
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

                setLegends();

                vizLayer.on('featureClick', function(e, latlng, pos, data) {
                    // show popup with spinner to indicate it's loading, hang on...
                    $scope.popupLoading = true;
                    showPopup(latlng);
                    /* jshint camelcase:false */
                    MappingService.featureLookup(data.cartodb_id)
                    /* jshint camelcase:true */
                        .done(function(data) {
                            var row = data.rows[0];
                            setPropertyData(row);
                            $scope.popupLoading = false;
                            showPopup(latlng);
                        }).error(function(errors) {
                            // returns a list
                            console.error('errors fetching property data: ' + errors);
                            setPropertyData(null);
                            $scope.popupLoading = false;
                        });
                    });
            });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();
