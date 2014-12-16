(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var ScatterPlotDefaults = {
        plotWidth: 800,
        plotHeight: 400,
        pointFillColor: '#14bfd6',
        pointStrokeColor: '#2e9ec6',
        xDefaultDim: 'eui',
        yDefaultDim: 'emissions',
        areaDefaultDim: 'energystar',
        colorDefaultDim: 'sector',
        minRadius: 1,
        maxRadius: 6
    };

    /**
     * ngInject
     */
    function scatterPlot (CartoConfig, ScatterPlotDefaults) {

        var PLOT_CLASS = 'mos-scatterplot';

        // Private vars
        var chart = null;
        var leftaxis = null;
        var leftaxisg = null;
        var bottomaxis = null;
        var bottomaxisg = null;

        // Begin directive module definition
        var module = {};

        module.restrict = 'EA';
        module.templateUrl = 'scripts/charting/scatterplot-partial.html';
        //module.template = '<svg class="chart"></svg>';
        module.controller = 'ChartingController';

        module.scope = {
            data: '=',              // Required
            id: '@',                // Required
            plotWidth: '@',
            plotHeight: '@',
            pointFillColor: '@',
            pointStrokeColor: '@',
            xDefaultDim: '@',
            yDefaultDim: '@',
            areaDefaultDim: '@',
            colorDefaultDim: '@',
            minRadius: '@',
            maxRadius: '@',
            margin: '&'
        };

        module.link = function ($scope, element, attrs) {
            $scope.configure(ScatterPlotDefaults);

            var config = $scope.config;

            $scope.axisOptions = _.omit(CartoConfig.labels, 'squarefeet');
            $scope.colorOptions = {'sector': 'Building Type',
                                   'year': 'Year Built',
                                   'squarefeet': 'Sq Ft'};

            $scope.selected = {
                x: config.xDefaultDim,
                y: config.yDefaultDim,
                color: config.colorDefaultDim,
                area: config.areaDefaultDim
            };

            $scope.changeSelectedOption = function (option, key) {
                $scope.selected[option] = key;
                // TODO: redraw
                $scope.plotComplete = false;
                $scope.redraw($scope.data);
            };

            element.addClass(PLOT_CLASS);
            chart = d3.select('#' + attrs.id + ' .chart')
                    .attr('width', config.plotWidth)
                    .attr('height', config.plotHeight);
            leftaxis = d3.svg.axis().orient('left');
            leftaxisg = chart.append('g')
                            .attr('class', 'y axis')
                            .attr('transform', 'translate(' + config.margin.left + ',0)');
            bottomaxis = d3.svg.axis().orient('bottom');
            bottomaxisg = chart.append('g')
                               .attr('class', 'x axis')
                               .attr('transform', 'translate(0, ' +
                                           (config.plotHeight - config.margin.bottom) +
                                           ')');

            // Overridden ChartingController method
            $scope.plot = function(data) {
                var xDim = $scope.selected.x;
                var yDim = $scope.selected.y;
                var areaDim = $scope.selected.area;
                // TODO: get color ramp from map options
                //var colorDim = $scope.selected.color;

                // Need to make sure that all values are at least 1 for a log scale.
                var datumX = function(datum) { return datum[xDim] < 1 ? 1 : datum[xDim]; };
                var datumY = function(datum) { return datum[yDim] < 1 ? 1 : datum[yDim]; };
                // Return the radius of a circle with area of this item
                var datumR = function(datum) {
                    return Math.sqrt(datum[areaDim] / Math.PI);
                };

                // Create SVG element inside container
                // Set up scaling and axes
                var x = d3.scale.log()
                        .domain([1, d3.max(data, datumX)])
                        .range([config.margin.left,
                                config.plotWidth - config.margin.right]);

                var y = d3.scale.log()
                        .domain([1, d3.max(data, datumY)])
                        .range([config.plotHeight - config.margin.bottom,
                                config.margin.top]);

                var r = d3.scale.linear()
                        .domain([0, d3.max(data, datumR)])
                        .range([config.minRadius, config.maxRadius]);

                leftaxis.scale(y);
                bottomaxis.scale(x);
                leftaxisg.call(leftaxis);
                bottomaxisg.call(bottomaxis);

                // Add tooltips
                var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            return '<span class="propertyName">' + d.propertyname + '</span>';
                        });
                chart.call(tip);

                // Create circles
                var circles = chart.selectAll('circle')
                                  .data(data);

                circles.enter().append('circle')
                       .attr('cx', function (d) { return x(datumX(d)); })
                       .attr('cy', function (d) { return y(datumY(d)); })
                        // Radius of zero initially so it can be animated on load
                       .attr('r', 0)
                       .attr('fill', config.pointFillColor)
                       .attr('stroke', config.pointStrokeColor)
                       .on('mouseover', tip.show)
                       .on('mouseout', tip.hide);
                circles.exit().remove();

                circles.transition().duration(2000)
                       .attr('cx', function (d) { return x(datumX(d)); })
                       .attr('cy', function (d) { return y(datumY(d)); })
                       .attr('r', function (d) { return r(datumR(d)); });
            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('ScatterPlotDefaults', ScatterPlotDefaults)
    .directive('mosScatterplot', scatterPlot);

})();
