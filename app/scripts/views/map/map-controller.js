(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($compile, $scope, $state, BuildingCompare, MappingService, MapColorService) {

        // indicate that map is loading, hang on..
        $scope.mapLoading = true;

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
        $scope.buildingIds = [];
        $scope.filterType = MappingService.FILTER_NONE;
        $scope.searchText = '';
        $scope.noResults = false;
        $scope.amSearching = false;

        $scope.colorByTypes = MapColorService.getColorByFields();
        $scope.sizeByTypes = MapColorService.getSizeByFields();
        $scope.colorType = 'sector';
        $scope.sizeType = 'site_eui';

        // helper function to set or unset property data from a result row
        var setPropertyData = function(row) {
            if (row) {
                /* jshint camelcase:false */
                $scope.propertyData = {
                    cartodbId: row.cartodb_id.toString(),
                    propertyName: row.property_name,
                    address: row.address,
                    totalGhg: row.total_ghg,
                    siteEui: row.site_eui,
                    energyStar: row.energy_star,
                    sector: row.sector
                };
                /* jshint camelcase:true */

            // get the color for this location's sector
            $scope.propertyData.sectorColor = 
                MappingService.findSectorColor($scope.propertyData.sector);

            } else {
                // row is null; unset property data
                $scope.propertyData = {
                    cartodbId: '',
                    propertyName: '',
                    address: '',
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
                    if (!data.data || data.data.length < 1) {
                        console.error('Could not find address!');
                        $scope.noResults = true;
                        $scope.amSearching = false;
                        return;
                    }
                    
                    var result = data.data[0];
                    $scope.noResults = false;
                    $scope.amSearching = false;

                    // show popup with found addresss display name
                    var latlng = L.latLng(result.lat, result.lon);
                    nativeMap.panTo(latlng);
                    var geocodePopupTemplate = [
                        '<span class="featurePopup"><div class="headerPopup"></div>',
                        '<p>{{::geocodedDisplayName}}</p></span>'
                    ].join('');
                    /* jshint camelcase:false */
                    $scope.geocodedDisplayName = result.display_name;
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
            $scope.filterType = sector;
            MappingService.filterViz(vizLayer, sector);
        };

        $scope.colorBy = function(selection) {
            $scope.colorType = selection;
            MappingService.setVizCartoCSS(vizLayer, $scope.colorType, $scope.sizeType);
            setSecondLegend();
        };

        $scope.sizeBy = function(selection) {
            $scope.sizeType = selection;
            MappingService.setVizCartoCSS(vizLayer, $scope.colorType, $scope.sizeType);
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
          'style="background-color: {{::propertyData.sectorColor}}">',
          '<h4>{{::propertyData.propertyName}}</h4>',
          '<h4>{{::propertyData.address}}</h4></div>',
          '<p><b>Total Energy Use: </b>{{::propertyData.siteEui}}</p>',
          '<p><b>Emissions: </b>{{::propertyData.totalGhg}}</p>',
          '<p ng-show="energyStar"><b>Energy Star: </b>{{::propertyData.energyStar}}</p>',
          '<p><input type="checkbox" ng-model="compare.isChecked" ng-disabled="compare.disabled" ',
          'ng-change="setCompare(propertyData.cartodbId)" /><em> Compare</em>',
          '<button type="button" class="pull-right btn" ',
          'ui-sref="detail({buildingId: propertyData.cartodbId})">Full Report</button></p>',
          '</div></span>'].join('');

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

        // fetch building IDs for autocomplete
        MappingService.getBuildingIds()
            .done(function(data) {
                $scope.buildingIds = data.rows;
            }).error(function(errors) {
                // returns a list
                console.error('errors fetching building IDs: ' + errors);
                $scope.buildingIds = [];
            });

        // get colors to display in legend
        $scope.sectorColors = MappingService.getSectorColors();

        // add second legend for feature color, above size legend
        var setSecondLegend = function() {
            var legend = null;

            // first remove previous second legend
            $('div.cartodb-legend.choropleth').remove();
            $('div.cartodb-legend.custom').remove();

            if ($scope.colorType === 'sector') {
                // categorize by sector
                legend = new cartodb.geo.ui.Legend({
                   type: 'custom',
                   data: $scope.sectorColors
                 });
            } else {
                // choropleth legend
                var opts = MappingService.getLegendOptions($scope.colorType);
                legend = new cartodb.geo.ui.Legend.Choropleth({
                    left: opts.left,
                    right: opts.right,
                    colors: opts.colors
                });
            }

            $('#mymap').append(legend.render().el);
        };

        // load map visualization
        cartodb.createVis('mymap', 'http://azavea-demo.cartodb.com/api/v2/viz/c5a9af6e-7f12-11e4-8f24-0e018d66dc29/viz.json',
                          {'infowindow': false, 'legends': true, 'searchControl': false, 'loaderControl': false})
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

                setSecondLegend();
                
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
