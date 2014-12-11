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

        $scope.cartodbId = '';
        $scope.propertyName = '';
        $scope.address = '';
        $scope.totalGhg = '';
        $scope.siteEui = '';
        $scope.energyStar = '';
        $scope.sector = '';
        $scope.sectorColor = 'transparent';
        $scope.popupLoading = true;

        $scope.compare = {
            count: BuildingCompare.count(),
            isChecked: false,
            disabled: false
        };
        
        $scope.buildingTypes = [];
        $scope.filterType = MappingService.FILTER_NONE;

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
            {'category': 'Natural Gas', 'field': 'natural_gas'}
        ];

        // default to EUI for feature size
        $scope.sizeType = $scope.sizeByTypes[0];

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
          '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>',
          '</div>',
          '<div ng-hide="popupLoading"><div class="headerPopup" style="background-color: {{::sectorColor}}">',
          '<h4>{{::propertyName}}</h4>',
          '<h4>{{::address}}</h4></div>',
          '<p><b>Total Energy Use: </b>{{::siteEui}}</p>',
          '<p><b>Emissions: </b>{{::totalGhg}}</p>',
          '<p ng-show="energyStar"><b>Energy Star: </b>{{::energyStar}}</p>',
          '<p><input type="checkbox" ng-model="compare.isChecked" ng-disabled="compare.disabled" ',
          'ng-change="setCompare(cartodbId)" /><em>Compare</em>',
          '<button class="pull-right report-btn" ui-sref="detail({buildingId: cartodbId})">Full Report</button></p>',
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
                            $scope.cartodbId = row.cartodb_id.toString();
                            $scope.propertyName = row.property_name;
                            $scope.address = row.address;
                            $scope.totalGhg = row.total_ghg;
                            $scope.siteEui = row.site_eui;
                            $scope.energyStar = row.energy_star;
                            $scope.sector = row.sector;
                            $scope.popupLoading = false;

                            // get the color for this location's sector
                            $scope.sectorColor = MappingService.findSectorColor($scope.sector);

                            showPopup(latlng);
                        }).error(function(errors) {
                            // returns a list
                            console.error('errors fetching property data: ' + errors);
                            $scope.cartodbId = '';
                            $scope.propertyName = '';
                            $scope.address = '';
                            $scope.totalGhg = '';
                            $scope.siteEui = '';
                            $scope.energyStar = '';
                            $scope.sector = '';
                            $scope.sectorColor = 'transparent';
                            $scope.popupLoading = false;
                        });
                    });
                    /* jshint camelcase:false */
            });
    }

    angular.module('mos.views.map')
    .controller('MapController', MapController);

})();
