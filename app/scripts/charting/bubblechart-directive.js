(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BubbleChartDefaults = {
        plotWidth: 500,
        plotHeight: 400,
        bubblePadding: 25,
        lazyLoad: true,
        transitionTime: 500
    };

    /**
     * ngInject
     */
    function bubbleChart (BubbleChartDefaults, CartoConfig, MOSColors) {

        var PLOT_CLASS = 'mos-bubblechart';

        // Private vars
        var chart = null;
        var pack = null;
        var tip = null;

        // Begin directive module definition
        var module = {};

        module.restrict = 'EA';
        module.templateUrl = 'scripts/charting/bubblechart-partial.html';

        module.controller = 'ChartingController';

        module.scope = {
            data: '=',              // Required
            id: '@',                // Required
            plotWidth: '@',
            plotHeight: '@',
            bubblePadding: '@',
            lazyLoad: '@',
            transitionTime: '@'
        };

        module.link = function ($scope, element, attrs) {
            $scope.SELECT_CLASS = PLOT_CLASS + '-select';

            $scope.configure(BubbleChartDefaults);
            var config = $scope.config;

            $scope.bubbleSeries = 'count'; // Default to number of buildings in bubble
            $scope.selectOptions = { // CartoConfig labels require more config than they're worth
                count: 'Building Count',
                totalenergy: 'Total Energy (kBtu)',
                emissions: 'Total Emissions (MtCO2e)',
                energystar: 'Mean Energy Star',
            };

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

            $scope.changeSeries = function (key) {
                $scope.bubbleSeries = key;
            };

            $scope.$watch('bubbleSeries', function () {
                $scope.plotComplete = false;
                $scope.redraw($scope.data);
            });
            // Overridden ChartingController method
            $scope.plot = function(data) {
                var node;
                var series = $scope.bubbleSeries;
                if (!series) {
                    return;
                }

                tip.html(function (d) {
                    return '<div>' + d.name + '</div>' +
                           '<div>' +
                           $scope.selectOptions[series] + ': ' +
                           Math.round(d[series]).toLocaleString() + '</div>';
                });
                pack.sort(null)
                    .value(function (d) { return d[series] || 0; });

                node = chart.selectAll('g')
                                 .data(pack.nodes({ children: data }));

                // Add
                var nodeEnter = node.enter().append('g')
                    .filter(function (d) { return d.depth === 1; })
                        .attr('transform', function(d) {
                            return 'translate(' + d.x + ',' + d.y + ')';
                        })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                nodeEnter.append('circle')
                    // Radius of zero initially so it can be animated on load
                    .attr('r', 0)
                    .attr('class', 'bubble')
                    .style('fill', function (d) { return MOSColors[d.name] || MOSColors.Unknown; });

                nodeEnter.append('text')
                    .attr('dy', '.35em')
                    .attr('text-anchor', 'middle')
                    .text(function (d) { return d.name; })
                    .style('opacity', 0);

                // Update
                node.transition().duration(config.transitionTime)
                    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
                    .selectAll('circle')
                    .attr('r', function (d) { return d.r; });

                node.select('text').transition().duration(config.transitionTime).style('opacity', function (d) {
                        // only show sector labels on bubble if bubble is bigger than text box
                        var bbox = this.getBBox();
                        return bbox.width < ((d.r * 2) - 5) ? 1 : 0;
                    });
            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('BubbleChartDefaults', BubbleChartDefaults)
    .directive('mosBubblechart', bubbleChart);

})();
