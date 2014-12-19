(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var HistogramDefaults = {
        plotWidth: 200,
        plotHeight: 80,
        plotWidthPercentage: 0.8,
        barRadius: 4,
        valueField: '',
        transitionMillis: 500,
        lazyLoad: false,
        bgFillColor: '#F0F1F2'
    };

    function kernelDensityEstimator(kernel, x) {
        return function(sample) {
            return x.map(function(x) {
                return [x, d3.mean(sample, function(v) { return kernel(x - v); })];
            });
        };
    }

    function epanechnikovKernel(scale) {
        return function(u) {
            return Math.abs(u /= scale) <= 1 ? 0.75 * (1 - u * u) / scale : 0;
        };
    }

    /**
     * ngInject
     */
    function histogram (CartoConfig, HistogramDefaults) {

        var PLOT_CLASS = 'mos-histogram';

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
            plotWidthPercentage: '@',
            barRadius: '@',
            valueField: '@',         // Required
            bgFillColor: '@',
            margin: '&',
            calloutValues: '=',
            calloutColors: '=',
            transitionMillis: '@',
            allowRedraw: '@',
            lazyLoad: '@'
        };


        module.link = function ($scope, element, attrs) {
            $scope.setDefaultMargins(10);
            $scope.configure(HistogramDefaults);
            var config = $scope.config;
            var margin = config.margin;
            var calloutValues = $scope.calloutValues;
            var calloutColors = $scope.calloutColors;

            // D3 margin, sizing, and spacing code
            element.addClass(PLOT_CLASS);
            var chartId = attrs.id;
            if (!chartId) {
                chartId = 'mos-histogram-' + Math.floor(Math.random() * 1000000001).toString();
                element.attr('id', chartId);
            }
            var chart = d3.select('#' + chartId + ' .chart')
                    .attr('width', config.plotWidth)
                    .attr('height', config.plotHeight)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            $scope.$watch('calloutValues', function (newValue) {
                calloutValues = newValue;
                $scope.redraw($scope.data);
            });

            // Overridden ChartingController method
            /**
                Data structure:
            */
            $scope.plot = function(data) {

                // Clear all drawn chart elements before redrawing
                d3.selectAll('#' + chartId + ' .chart > g > *').remove();

                // Filter values < 1 for log scale
                data = _.filter(data, function (row) {
                    return row[config.valueField] >= 1;
                });
                var values = _.map(data, config.valueField);
                var maxValue = _.max(values);
                var minValue = _.min(values);
                var height = config.plotHeight - margin.top - margin.bottom;
                var width = config.plotWidth - margin.left - margin.right;

                var x = d3.scale.log()
                    .domain([minValue, maxValue])
                    .range([0, width]);

                var logScale = x.ticks();
                var numBins = logScale.length;
                var histogramData = d3.layout.histogram()
                    .bins(logScale)(values);

                var y = d3.scale.linear()
                    .domain([0, d3.max(histogramData, function (d) { return d.y; })])
                    .range([height, 0]);

                var index = 0;
                var dx = width / numBins;
                /*
                var bar = chart.selectAll('.bar')
                    .data(histogramData)
                    .enter().append('g')
                    .attr('class', 'bar')
                    .attr('transform', function (d) {
                        var xOffset = index * dx;
                        index++;
                        return 'translate(' + xOffset + ', ' + y(d.y) + ')';
                    });
                   */

                var percentageWidth = dx * config.plotWidthPercentage;
                var xOffset = (dx - percentageWidth) / 2;
                /*
                bar.append('rect')
                    .attr('x', xOffset)       // Start x is relative to left edge of parent bar element
                    .attr('width', percentageWidth)
                    .attr('rx', config.barRadius)
                    .attr('ry', config.barRadius)
                    .attr('height', function (d) { return height - y(d.y); })
                    .attr('fill', function (d) {
                        var minValue = d.x;
                        var maxValue = d.x + d.dx;
                        var highlightColor = config.bgFillColor;
                        for (var i = 0; i < calloutValues.length; i++) {
                            var value = calloutValues[i];
                            // Set highlight color if:
                            // first bin and value < x + dx for that bin OR
                            // last bin (length - 2 for d3 reasons) and value > x for that bin OR
                            // any other bin and x <= value < x + dx
                            if ((_.indexOf(logScale, minValue) === 0 && value < maxValue) ||
                                (_.indexOf(logScale, minValue) === logScale.length - 2 && value > minValue) ||
                                (minValue <= value && value < maxValue) ) {
                                highlightColor = calloutColors[i];
                            }
                        }
                        return highlightColor;
                    });
                   */

                var xKDE = d3.scale.linear()
                    .domain([Math.log10(minValue), Math.log10(maxValue)])
                    .range([0, width]);
                var kde = kernelDensityEstimator(epanechnikovKernel(.2), xKDE.ticks(50));
                var estimate = kde(_.map(values, function(d) { return Math.log10(d); }));
                var yKDE = d3.scale.linear()
                    .domain([0, 1])
                    .range([height, 30]);
                var plotArea = d3.svg.area()
                    .x(function(d) { return xKDE(d[0]); })
                    .y0(height)
                    .y1(function(d) { return yKDE(d[1]); });
                var overlayArea = d3.svg.area()
                    .x(function(d) { return xKDE(d[0]); })
                    .y0(0)
                    .y1(function(d) { return yKDE(d[1]); });
                chart.append('path') // Actual plot area for KDE
                    .datum(estimate)
                    .attr('class', 'kde plot')
                    .attr('d', plotArea);
                for (var i = 0; i < calloutValues.length; i++) {
                    if (calloutValues[i] !== null) {
                        chart.append('rect') // callouts
                            .attr('x', xKDE(Math.log10(calloutValues[i])))
                            .attr('y', 0)
                            .attr('height', height)
                            .attr('width', width / 50)
                            .attr('fill', calloutColors[i]);
                    }
                }
                chart.append('path') // Overlay for callouts
                    .datum(estimate)
                    .attr('class', 'overlay')
                    .attr('d', overlayArea);

                console.log('Config:', {
                    min: minValue,
                    max: maxValue,
                    dx: dx,
                    percentWidth: percentageWidth,
                    xOffset: xOffset,
                    callouts: calloutValues
                });
                console.log('Scale:', logScale);
                console.log('Data:', histogramData);
            };
        };

        return module;
    }

    angular.module('mos.charting')
      .constant('HistogramDefaults', HistogramDefaults)
      .directive('mosHistogram', histogram);

})();
