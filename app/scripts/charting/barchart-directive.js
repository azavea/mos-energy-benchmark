(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaults = {
        plotWidth: 800,
        plotHeight: 400,
        defaultX: 'age',
        defaultY: 'sqft',
    };

    /**
     * ngInject
     */
    function barChart (BarChartDefaults) {

        var PLOT_CLASS = 'mos-barchart';

        // Private vars
        var leftAxisG = null;
        var bottomAxisG = null;

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
            margin: '&',
        };

        module.link = function ($scope, element, attrs) {
            $scope.configure(BarChartDefaults);

            var config = $scope.config;
            config.margin.left = 0;


            element.addClass(PLOT_CLASS);
            var chart = d3.select('#' + attrs.id + ' .chart')
                    .attr('width', config.plotWidth);
            var leftAxis = d3.svg.axis().orient('left');
            var leftAxisG = chart.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
            var bottomAxis = d3.svg.axis().orient('bottom');
            var bottomAxisG = chart.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + config.margin.left + ',' + (config.plotHeight - config.margin.bottom) + ')');


            // Overridden ChartingController method
            $scope.plot = function(data) {
                var barHeight = config.barHeight;

                chart.attr('height', config.plotHeight);

                // Axes
                var x = d3.scale.ordinal()
                    .domain(data.map(function(d, i) { return i; }))
                    .rangeRoundBands([0, config.plotWidth-config.margin.left-config.margin.right], 0.05);
                bottomAxis.scale(x);
                bottomAxisG.call(bottomAxis);

                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d; })])
                    .range([config.plotHeight-config.margin.bottom-config.margin.top, 0]);
                leftAxis.scale(y);
                //leftAxisG.call(leftAxis);

                // Tooltips
                var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d, i) { return '<span class="propertyName">' + d + '</span>'; });
                chart.call(tip);

                // Bars
                var bars = chart.selectAll('bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('transform', function(d, i) { return 'translate(' + (x(i) + config.margin.left) + ',0)'; })
                    .attr('y', function(d) {return y(d) + config.margin.top; })
                    .attr('height', function(d) { return config.plotHeight - y(d) - config.margin.top - config.margin.bottom; })
                    .attr('width', x.rangeBand())
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('BarChartDefaults', BarChartDefaults)
    .directive('mosBarchart', barChart);

})();
