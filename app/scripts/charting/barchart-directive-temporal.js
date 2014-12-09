(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaultsTemporal = {
        plotWidth: 800,
        plotHeight: 200,
        yLabel: 'emissions',
        xLabel: 'yearbuilt',
    };

    /**
     * ngInject
     */
    function barChartTemporal (BarChartDefaultsTemporal) {

        var PLOT_CLASS = 'mos-barchart';

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
            $scope.configure(BarChartDefaultsTemporal);

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
                console.log(data);
                console.log(config.xLabel)
                // This annoying junk is to logarithmically bin years - we have fewer old buildings
                var nestedByLog = d3.nest()
                    .key(function(d) {
                        return (2014 - d[config.xLabel]);
                    })
                    .rollup(function(d) {
                        return {
                            emissions: d3.sum(d, function(g) { return +g.emissions; }),
                            energystar: d3.sum(d, function(g) { return +g.energystar; }),
                            eui: d3.sum(d, function(g) { return +g.eui; }),
                            sqfeet: d3.sum(d, function(g) { return +g.sqfeet; }),
                            count: d3.sum(d, function() { return +1; }),
                            yearbuilt: d[0].yearbuilt
                        };
                    })
                    .entries(data);
                console.log(nestedByLog);
                var groupUp = function(vals, groupCount) {
                    var maxVal = _.max(_.map(vals, function(d) { return d.key; }));
                    var divider = maxVal/groupCount;
                    var binstarts = d3.range(0, maxVal, divider);
                    var binnedByLog = {};
                    for (var i = 0; i < binstarts.length - 1; i++) {
                        binnedByLog[binstarts[i]] = _.filter(vals, function(d) {
                            return binstarts[i] <= parseFloat(d.key) && parseFloat(d.key) < binstarts[i+1];
                        });
                    }
                    var output = [];
                    _.forEach(binnedByLog, function(v, k) {
                        var kCount = _.reduce(v, function(val, memo) {return memo.values.count + val; }, 0);
                        output = output.concat({
                            key: k,
                            emissions: _.reduce(v, function(val, memo) { return memo.values.emissions + val; }, 0) / kCount,
                            energystar: v.length > 0 ? _.reduce(v, function(val, memo) { return memo.values.energystar + val; }, 0) / kCount : 0,
                            eui: v.length > 0 ? _.reduce(v, function(val, memo) { return memo.values.eui + val; }, 0) / kCount : 0,
                            sqfeet: _.reduce(v, function(val, memo) { return memo.values.sqfeet + val; }, 0) / kCount,
                            count: kCount,
                            yearRange: v.length > 0 ? _.min(v, function(d) { return d.values.yearbuilt; }).values.yearbuilt + '-' + _.max(v, function(d) { return d.values.yearbuilt; }).values.yearbuilt : null,
                        });
                    });
                    return _.filter(output, function(d) { return d.yearRange !== null; });
                };
                data = groupUp(nestedByLog, 25);
                console.log(data);

                chart.attr('height', config.plotHeight);

                // Axes
                var x = d3.scale.ordinal()
                    .domain(data.map(function(d) { return d.yearRange; }))
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
                  .html(function(d) { return '<span class="propertyName">' + d.yearRange + '</span>'; });
                chart.call(tip);

                // Bars
                var bars = chart.selectAll('bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('transform', function(d) { return 'translate(' + (x(d.yearRange) + config.margin.left).toString() + ',0)'; })
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
    .constant('BarChartDefaultsTemporal', BarChartDefaultsTemporal)
    .directive('mosBarchartTemporal', barChartTemporal);

})();
