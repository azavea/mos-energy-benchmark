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
        lazyLoad: false
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

        // Default color to use when a color isn't provided
        var defaultColor = 'DarkGray';

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
                data = _.chain(data) // Filter out less than 1 and return the log10 of values
                        .filter(function (row) { return row[config.valueField] >= 1; })
                        .map(function(d) { return Math.log(d[config.valueField]) / Math.log(10); })
                        .value();
                var maxValue = _.max(data);
                var minValue = _.min(data);
                var height = config.plotHeight - margin.top - margin.bottom;
                var width = config.plotWidth - margin.left - margin.right;

                // Scale for log values
                var xKDE = d3.scale.linear()
                    .domain([minValue, maxValue])
                    .range([0, width]);
                var yKDE = d3.scale.linear()
                    .domain([0, 1])
                    .range([height, 30]);
                // KDEstimator with probability distribution tapering out with a bandwidth of 0.2
                // with the epanechnikov kernel function
                var kde = kernelDensityEstimator(epanechnikovKernel(0.3), xKDE.ticks(100));
                var estimate = kde(data); // Estimated density

                // Plot KDE and callouts
                var plotArea = d3.svg.area()
                    .x(function(d) { return xKDE(d[0]); })
                    .y0(height)
                    .y1(function(d) { return yKDE(d[1]); });
                chart.append('path') // Plot area for KDE
                    .datum(estimate)
                    .attr('class', 'kde plot')
                    .attr('d', plotArea);
                for (var i = 0; i < calloutValues.length; i++) {
                    if (calloutValues[i] !== null) { // Don't plot null vals - null is not 0
                        chart.append('rect') // Callouts - minValue is used for cases below 1 to avoid negInfinity on log10
                            .attr('x', xKDE(calloutValues[i] >= 1 ? Math.log(calloutValues[i]) / Math.log(10) : minValue))
                            .attr('y', 0)
                            .attr('height', height)
                            .attr('width', '2px')
                            .attr('fill', calloutColors[i] || defaultColor);
                    }
                }


                /* Debugging logs
                console.log('Config:', {
                    min: minValue,
                    max: maxValue,
                    callouts: calloutValues
                });
                console.log('Data:', data);
               */
            };
        };

        return module;
    }

    angular.module('mos.charting')
      .constant('HistogramDefaults', HistogramDefaults)
      .directive('mosHistogram', histogram);

})();
