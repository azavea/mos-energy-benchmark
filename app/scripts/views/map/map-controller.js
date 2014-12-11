(function () {
    'use strict';

    /*
     * ngInject
     */
    function MapController($compile, $scope, $state, BuildingCompare, MappingService) {

        // indicate that map is loading, hang on..
        $scope.mapLoading = true;

        // initialization
        var vizLayer = null;
        var nativeMap = null;

        $scope.propertyData = {
            cartodbId: '',
            propertyName: '',
            address: '',
            siteEui: '',
            energyStar: '',
            sector: '',
            sectorColor: 'transparent'
        };

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

        // options for changing field for controlling viz feature color
        // 'category' is name for display; 'field' is field name in DB
        $scope.colorByTypes = [
            {'category': 'Building Type', 'field': 'sector'},
            {'category': 'Year Built', 'field': 'year_built'},
            {'category': 'Square footage', 'field': 'floor_area'}
        ];

        // default to sector for feature color
        $scope.colorType = $scope.colorByTypes[0];

        // options for changing field for controlling viz feature size
        // 'category' is name for display; 'field' is field name in DB
        $scope.sizeByTypes = [
            {'category': 'Total Energy Use', 'field': 'site_eui'},
            {'category': 'Greenhouse Gases', 'field': 'total_ghg'},
            {'category': 'Electricity', 'field': 'electricity'},
            {'category': 'Fuel Oil', 'field': 'fuel_oil'},
            {'category': 'Water Use', 'field': 'water_use'},
            {'category': 'Steam Use', 'field': 'steam'},
            {'category': 'Natural Gas', 'field': 'natural_gas'}
        ];

        // default to EUI for feature size
        $scope.sizeType = $scope.sizeByTypes[0];

        $scope.searchMap = function() {

            // TODO: how to display an error? modal?  what if multiple results found?

            console.log($scope.searchText);

            if (!$scope.searchText) {
                console.log('nothing to search for');
                return;
            }

            // if entered search text is numeric, try searching by property ID
            if (!isNaN($scope.searchText)) {
                console.log('that looks like a property ID');
                // TODO: look up property, zoom to it if found, and open pop-up
            } else {
                console.log('I guess that must be an address');
                // TODO: geocode address and zoom to the spot
                MappingService.geocode($scope.searchText).then(function(data) {
                    if (!data.data || data.data.length < 1) {
                        console.error('Could not find address!');
                        return;
                    }
                    
                    var result = data.data[0];

                    console.log(result['display_name']);
                    console.log(result.lat + ', ' + result.lon);
                }, function(err) {
                    console.error(err);
                });
            }

        };

        $scope.filterBy = function(sector) {
            $scope.filterType = sector;
            MappingService.filterViz(vizLayer, sector);
        };

        $scope.colorBy = function(selection) {
            $scope.colorType = selection;
            MappingService.setVizCartoCSS(vizLayer, $scope.colorType.field, $scope.sizeType.field);
            setSecondLegend();
        };

        $scope.sizeBy = function(selection) {
            $scope.sizeType = selection;
            MappingService.setVizCartoCSS(vizLayer, $scope.colorType.field, $scope.sizeType.field);
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
          '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
          '<div ng-hide="popupLoading"><div class="headerPopup" ',
          'style="background-color: {{::propertyData.sectorColor}}">',
          '<h4>{{::propertyData.propertyName}}</h4>',
          '<h4>{{::propertyData.address}}</h4></div>',
          '<p><b>Total Energy Use: </b>{{::propertyData.siteEui}}</p>',
          '<p><b>Emissions: </b>{{::propertyData.totalGhg}}</p>',
          '<p ng-show="energyStar"><b>Energy Star: </b>{{::propertyData.energyStar}}</p>',
          '<p><input type="checkbox" ng-model="compare.isChecked" ng-disabled="compare.disabled" ',
          'ng-change="setCompare(propertyData.cartodbId)" /><em>Compare</em>',
          '<button class="pull-right report-btn" ',
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
                minWidth: 150
            }).setLatLng(coords).setContent(popup[0]).openOn(nativeMap);
        };

        // fetch building categories for drop-down
        MappingService.getBldgCategories()
            .done(function(data) {
                $scope.buildingTypes = [{'sector': MappingService.FILTER_NONE}];
                $scope.buildingTypes = $scope.buildingTypes.concat(data.rows);
            }).error(function(errors) {
                // returns a list
                console.error('errors fetching property types: ' + errors);
                $scope.buildingTypes = [{'sector': module.FILTER_NONE}];
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

            if ($scope.colorType.field === 'sector') {
                // categorize by sector
                legend = new cartodb.geo.ui.Legend({
                   type: 'custom',
                   data: $scope.sectorColors
                 });
            } else {
                // choropleth legend
                var opts = MappingService.getLegendOptions($scope.colorType.field);

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
                        .done(function(data) {
                            var row = data.rows[0];
                            $scope.propertyData.cartodbId = row.cartodb_id.toString();
                            $scope.propertyData.propertyName = row.property_name;
                            $scope.propertyData.address = row.address;
                            $scope.propertyData.totalGhg = row.total_ghg;
                            $scope.propertyData.siteEui = row.site_eui;
                            $scope.propertyData.energyStar = row.energy_star;
                            $scope.propertyData.sector = row.sector;

                            $scope.popupLoading = false;

                            // get the color for this location's sector
                            $scope.propertyData.sectorColor = 
                                MappingService.findSectorColor($scope.propertyData.sector);

                            showPopup(latlng);
                        }).error(function(errors) {
                            // returns a list
                            console.error('errors fetching property data: ' + errors);
                            $scope.propertyData.cartodbId = '';
                            $scope.propertyData.propertyName = '';
                            $scope.propertyData.address = '';
                            $scope.propertyData.totalGhg = '';
                            $scope.propertyData.siteEui = '';
                            $scope.propertyData.energyStar = '';
                            $scope.propertyData.sector = '';
                            $scope.propertyData.sectorColor = 'transparent';

                            $scope.popupLoading = false;
                        });
                    });
                    /* jshint camelcase:false */
            });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();
