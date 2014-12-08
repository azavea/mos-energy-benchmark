(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaultsSqft = {
        plotWidth: 800,
        plotHeight: 200,
        yLabel: 'emissions',
        xLabel: 'avgsqfeet',
    };

    /**
     * ngInject
     */
    function barChartSqft (BarChartDefaultsSqft) {

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
            xLabel: '@',              // Required
            plotWidth: '@',
            plotHeight: '@',
            margin: '&',
        };

        module.link = function ($scope, element, attrs) {
            $scope.configure(BarChartDefaultsSqft);

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
                // This annoying junk is to logarithmically bin years - we have fewer old buildings
                var orderedData = _.sortBy(
                    _.filter(data, function(q) {
                        return q.sqfeet > 0;
                    }), function(p) {
                            return p.sqfeet;
                        });

                var pctiles = function(vals, groupCount) {
                    var reverseVals = vals.reverse();
                    var dataCount = vals.length;
                    var divider = Math.ceil(dataCount/groupCount);
                    var binnedByPctile = {};
                    var pctileSize = 100/groupCount;
                    var pctileHolder;
                    for (var i = 0; i < groupCount; i++) {
                        pctileHolder = [];
                        for (var j = 0; j < divider; j++) {
                            pctileHolder = pctileHolder.concat(reverseVals.pop());
                        }
                        binnedByPctile[pctileSize*i] = pctileHolder;
                    }

                    var trashCount = divider-dataCount%divider; // count of undefined in last array
                    for (i = 0; i < trashCount; i++) {
                        binnedByPctile[pctileSize*(groupCount-1)].pop();
                    }
                    var output = [];
                    _.forEach(binnedByPctile, function(d, k) {
                        var kCount = d.length;
                        output = output.concat({
                            emissions: _.reduce(d, function(val, memo) { return memo.emissions + val; }, 0) / kCount,
                            energystar: kCount > 0 ? _.reduce(d, function(val, memo) { return memo.energystar + val; }, 0) / kCount : 0,
                            eui: kCount > 0 ? _.reduce(d, function(val, memo) { return memo.eui + val; }, 0) / kCount : 0,
                            minsqfeet: _.min(d, function(val) { return val.sqfeet; }).sqfeet,
                            maxsqfeet: _.max(d, function(val) { return val.sqfeet; }).sqfeet,
                            avgsqfeet: _.reduce(d, function(memo, val) { return val.sqfeet + memo; }, 0) / kCount,
                            mediansqfeet: _.sortBy(d, function(val) { return val.sqfeet; })[Math.round(kCount/2)].sqfeet,
                            totalsqfeet: _.reduce(d, function( memo, val) { return val.sqfeet + memo; }, 0),
                            count: kCount,
                            pctile: k,
                            yearRange: _.min(d, function(d) { return d.yearbuilt; }).yearbuilt + '-' + _.max(d, function(d) { return d.yearbuilt; }).yearbuilt
                        });
                    });
                    return output.reverse();
                };
                data = pctiles(orderedData, 20);

                chart.attr('height', config.plotHeight);

                // Axes
                var x = d3.scale.ordinal()
                    .domain(data.map(function(d) { return d.pctile; }))
                    .rangeRoundBands([config.plotWidth-config.margin.left-config.margin.right, 0], 0.05);
                bottomAxis.scale(x);
                bottomAxisG.call(bottomAxis);

                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d[config.yLabel]; })])
                    .range([config.plotHeight-config.margin.bottom-config.margin.top, 0]);
                leftAxis.scale(y);
                //leftAxisG.call(leftAxis);

                // Tooltips
                var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) { return '<span class="propertyName">' + d.pctile+'th percentile</span>'; });
                chart.call(tip);

                // Bars
                var bars = chart.selectAll('bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('transform', function(d) { return 'translate(' + (x(d.pctile) + config.margin.left).toString() + ',0)'; })
                    .attr('y', function(d) {return y(d[config.yLabel]) + config.margin.top; })
                    .attr('height', function(d) { return config.plotHeight - y(d[config.yLabel]) - config.margin.top - config.margin.bottom; })
                    .attr('width', x.rangeBand())
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('BarChartDefaultsSqft', BarChartDefaultsSqft)
    .directive('mosBarchartSqft', barChartSqft);

})();
