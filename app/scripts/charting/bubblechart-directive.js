(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BubbleChartDefaults = {
        plotWidth: 400,
        plotHeight:400,
        bubblePadding: 25,
        transitionTime: 500
    };

    /**
     * ngInject
     */
    function bubbleChart (BubbleChartDefaults, CartoConfig, Utils) {

        var PLOT_CLASS = 'mos-bubblechart';
        var SELECT_CLASS = PLOT_CLASS + '-select';

        // Private vars
        var chart = null;
        var pack = null;
        var tip = null;

        // Begin directive module definition
        var module = {};

        module.restrict = 'EA';
        module.template = [
            '<svg class="chart"></svg>',
            '<select class="' + SELECT_CLASS + '" ng-model="bubbleSeries" ng-options="key as value for (key, value) in selectOptions">'
        ].join('');

        module.controller = 'ChartingController';

        module.scope = {
            data: '=',              // Required
            id: '@',                // Required
            plotWidth: '@',
            plotHeight: '@',
            bubblePadding: '@',
            transitionTime: '@'
        };

        module.link = function ($scope, element, attrs) {
            $scope.configure(BubbleChartDefaults);
            var config = $scope.config;

            $scope.bubbleSeries = 'eui';
            $scope.selectOptions = _.omit(CartoConfig.labels, 'squarefeet');

            element.addClass(PLOT_CLASS);
            chart = d3.select('#' + attrs.id + ' .chart')
                    .attr('width', config.plotWidth)
                    .attr('height', config.plotHeight);

            pack = d3.layout.pack()
                    .size([config.plotWidth, config.plotHeight])
                    .padding(config.bubblePadding);
            tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0]);
            chart.call(tip);

            $scope.$watch('bubbleSeries', function () {
                $scope.plotComplete = false;
                $scope.redraw($scope.data);
            });
            // Overridden ChartingController method
            $scope.plot = function(data) {
                var color = d3.scale.category20();
                var node;
                var series = $scope.bubbleSeries;
                if (!series) {
                    return;
                }

                tip.html(function (d) {
                    return '<div>' + d.name + '</div>' +
                           '<div>' +
                           CartoConfig.labels[series] + ': ' +
                           Math.round(d[series]) + '</div>';
                });
                pack.sort(null)
                    .value(function (d) { return d[series] || 0; });

                node = chart.selectAll('g')
                                 .data(pack.nodes({ children: data }));

                // Add
                node.enter().append('g')
                        .filter(function (d) { return d.depth === 1; })
                        .attr('transform', function(d) { return 'translate(' + d.x +
                                                                ',' + d.y + ')'; })
                        .append('circle')
                        // Radius of zero initially so it can be animated on load
                        .attr('r', 0)
                        .attr('class', 'bubble')
                        .style('fill', function (d, i) { return color(i); })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                // Update
                node.transition().duration(config.transitionTime)
                    .attr('transform', function(d) { return 'translate(' + d.x +
                                                            ',' + d.y + ')'; })
                    .selectAll('circle')
                    .attr('r', function (d) { return d.r; });
            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('BubbleChartDefaults', BubbleChartDefaults)
    .directive('mosBubblechart', bubbleChart);

})();
