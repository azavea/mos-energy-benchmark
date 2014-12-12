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
        minRadius: 1,
        maxRadius: 6
    };

    /**
     * ngInject
     */
    function scatterPlot (ScatterPlotDefaults, Utils) {

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
        module.template = '<svg class="chart"></svg>';
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
            minRadius: '@',
            maxRadius: '@',
            margin: '&'
        };

        module.link = function ($scope, element, attrs) {
            $scope.configure(ScatterPlotDefaults);

            var config = $scope.config;

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

            Utils.onPanelSnap(element, function () {
                $scope.redraw($scope.data);
            });

            // Overridden ChartingController method
            $scope.plot = function(data) {
                if ($scope.plotComplete || !Utils.inViewPort(element)) {
                    return;
                }

                var xDim = config.xDefaultDim;
                var yDim = config.yDefaultDim;
                var areaDim = config.areaDefaultDim;

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

                $scope.plotComplete = true;
            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('ScatterPlotDefaults', ScatterPlotDefaults)
    .directive('mosScatterplot', scatterPlot);

})();
