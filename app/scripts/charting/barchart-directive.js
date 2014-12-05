(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaults = {
        plotWidth: 800,
        barHeight: 20
    };

    /**
     * ngInject
     */
    function barChart (BarChartDefaults) {

        var PLOT_CLASS = 'mos-barchart';

        // Private vars
        var chart = null;

        // Begin directive module definition
        var module = {};

        module.restrict = 'EA';
        module.template = '<svg class="chart"></svg>';
        module.controller = 'ChartingController';

        module.scope = {
            data: '=',              // Required
            id: '@',                // Required
            plotWidth: '@',
            barHeight: '@'
        };

        module.link = function ($scope, element, attrs) {
            $scope.configure(BarChartDefaults);

            var config = $scope.config;

            element.addClass(PLOT_CLASS);
            chart = d3.select('#' + attrs.id + ' .chart')
                    .attr('width', config.plotWidth);

            // Overridden ChartingController method
            $scope.plot = function(data) {
                var barHeight = config.barHeight;

                chart.attr('height', barHeight * data.length);
                var x = d3.scale.linear()
                    .domain([0, d3.max(data)])
                    .range([0, config.plotWidth]);

                var bar = chart.selectAll('g')
                    .data(data)
                    .enter().append('g')
                    .attr('transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; });

                bar.append('rect')
                    .attr('width', x)
                    .attr('height', barHeight - 1);

                bar.append('text')
                  .attr('x', function(d) { return x(d) - 3; })
                  .attr('y', barHeight / 2)
                  .attr('dy', '.35em')
                  .text(function(d) { return d; });
            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('BarChartDefaults', BarChartDefaults)
    .directive('mosBarchart', barChart);

})();