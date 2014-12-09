(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaultsSqft = {
        plotWidth: 800,
        plotHeight: 200,
        yDefault: 'energystar',
        xDefault: 'avgsqfeet',
        transitionMillis: 500,
    };

    /**
     * ngInject
     */
    function barChartSqft (CartoConfig, BarChartDefaultsSqft) {

        var PLOT_CLASS = 'mos-barchart';

        // Begin directive module definition
        var module = {};

        module.restrict = 'EA';
        module.template = [
            '<svg class="chart"></svg>',
            '<div class="controls">',
            '  <div class="axis y">',
            '    Y axis',
            '    <select ng-model="selectedY" ng-options="key as value for (key, value) in selectOptions" ng-change="selectedYChanged()"></select>',
            '  </div>',
            '</div>'
        ].join('');
        module.controller = 'ChartingController';

        module.scope = {
            data: '=',              // Required
            id: '@',                // Required
            xDefault: '@',              // Required
            plotWidth: '@',
            plotHeight: '@',
            margin: '&',
        };

        module.link = function ($scope, element, attrs) {
            $scope.configure(BarChartDefaultsSqft);
            var config = $scope.config;
            config.margin.left = 0;
            $scope.selectOptions = _.merge(_.omit(CartoConfig.labels, 'squarefeet'), {
                'avgsqfeet': 'Avg Sq. Ft.',
                'mediansqfeet': 'Median Sq. Ft.',
            });
            $scope.selectedY = config.yDefault;
            var yAttr = $scope.selectedY;



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


            // This is a helper function for transforming api data into percentiles based on sqft
            function transformData(data, groups) {
                var orderedData = _.sortBy(
                    _.filter(data, function(q) {
                        return q.sqfeet > 0;
                    }), function(p) {
                            return p.sqfeet;
                        });

                var reverseData = orderedData.reverse();
                var dataCount = orderedData.length;
                var divider = Math.ceil(dataCount/groups);
                var binnedByPctile = {};
                var pctileSize = 100/groups;
                var pctileHolder;
                for (var i = 0; i < groups; i++) {
                    pctileHolder = [];
                    for (var j = 0; j < divider; j++) {
                        pctileHolder = pctileHolder.concat(reverseData.pop());
                    }
                    binnedByPctile[pctileSize*i] = pctileHolder;
                }

                var trashCount = divider-dataCount%divider; // count of undefined in last array
                for (i = 0; i < trashCount; i++) {
                    binnedByPctile[pctileSize*(groups-1)].pop();
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
            }


            // Overridden ChartingController method
            $scope.plot = function(data) {
                data = transformData(data, 20);

                chart.attr('height', config.plotHeight);

                // Axes
                var x = d3.scale.ordinal()
                    .domain(data.map(function(d) { return d.pctile; }))
                    .rangeRoundBands([config.plotWidth-config.margin.left-config.margin.right, 0], 0.05);
                bottomAxis.scale(x);
                bottomAxisG.call(bottomAxis);

                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d[yAttr]; })])
                    .range([config.plotHeight-config.margin.bottom-config.margin.top, 0]);
                leftAxis.scale(y);

                // Tooltips
                var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                      return '<div class="propertyName">' +
                          d.pctile + 'th percentile</div><div class="propertyName y">\n' +
                          yAttr + ': ' + Math.round(y(d[yAttr])) + '</div>';
                  });
                chart.call(tip);

                // Bars
                var bars = chart.selectAll('bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('transform', function(d) { return 'translate(' + (x(d.pctile) + config.margin.left).toString() + ',0)'; })
                    .attr('y', function(d) {return y(d[yAttr]) + config.margin.top; })
                    .attr('height', function(d) { return config.plotHeight - y(d[yAttr]) - config.margin.top - config.margin.bottom; })
                    .attr('width', x.rangeBand())
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                // Animation
                function refreshScale() {
                    y.domain([0, d3.max(data, function(d) { return d[yAttr]; })]);
                }

                function refreshData() {
                    var transitionMillis = config.transitionMillis;
                    refreshScale();

                    chart.selectAll('rect')
                        .transition()
                        .ease('linear')
                        .duration(transitionMillis)
                        .attr('y', function(d) {return y(d[yAttr]) + config.margin.top; })
                        .attr('height', function(d) { return config.plotHeight - y(d[yAttr]) - config.margin.top - config.margin.bottom; });
                }
                $scope.selectedYChanged = function() {
                    yAttr = $scope.selectedY;
                    refreshData();
                };
            };
        };

        return module;
    }

    angular.module('mos.charting')
    .constant('BarChartDefaultsSqft', BarChartDefaultsSqft)
    .directive('mosBarchartSqft', barChartSqft);

})();
