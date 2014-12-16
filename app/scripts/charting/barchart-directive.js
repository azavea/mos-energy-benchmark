(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaults = {
        plotWidth: 800,
        plotHeight: 200,
        yDefault: 'avgemissions',
        transitionMillis: 500,
        lazyLoad: true,
        binType: 'temporal'
    };

    /**
     * ngInject
     */
    function barChart (CartoConfig, BarChartDefaults) {

        var PLOT_CLASS = 'mos-barchart';

        // Begin directive module definition
        var module = {};

        module.restrict = 'EA';
        module.templateUrl = 'scripts/charting/barchart-partial.html';
        module.controller = 'ChartingController';

        module.scope = {
            data: '=',              // Required
            id: '@',                // Required
            plotWidth: '@',
            plotHeight: '@',
            margin: '&',
            binType: '@',
            lazyLoad: '@',
            transitionMillis: '@'
        };

        console.log('this far...')

        // This is a helper function for transforming api data into percentiles based on sqft
        function binBySqFt(data, groups) {
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
            var pctileSize = 100 / groups;
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
                    avgemissions: _.reduce(d, function(val, memo) { return memo.emissions + val; }, 0) / kCount,
                    avgenergystar: kCount > 0 ? _.reduce(d, function(val, memo) { return memo.energystar + val; }, 0) / kCount : 0,
                    avgeui: kCount > 0 ? _.reduce(d, function(val, memo) { return memo.eui + val; }, 0) / kCount : 0,
                    minsqft: _.min(d, function(val) { return val.sqfeet; }).sqfeet,
                    maxsqft: _.max(d, function(val) { return val.sqfeet; }).sqfeet,
                    avgsqft: _.reduce(d, function(memo, val) { return val.sqfeet + memo; }, 0) / kCount,
                    mediansqft: _.sortBy(d, function(val) { return val.sqfeet; })[Math.round(kCount / 2)].sqfeet,
                    totalsqft: _.reduce(d, function( memo, val) { return val.sqfeet + memo; }, 0),
                    count: kCount,
                    key: k,
                    yearRange: _.min(d, function(d) { return d.yearbuilt; }).yearbuilt +
                        '-' + _.max(d, function(d) { return d.yearbuilt; }).yearbuilt
                });
            });
            return output.reverse();
        }


        // Helper function for transforming unshaped data into data binned and aggregated over 5 year periods
        function binByYears(data) {
            var filteredData = _.filter(data, function(d) { return d.yearbuilt > 1849; });
            var dateRanges = _.zip(_.range(1849, 2015, 5), _.range(1853, 2019, 5));
            var rolledData =
                d3.nest()
                    .key(function(d) {
                        var years = _.find(dateRanges, function(range) {
                            return range[0] <= d.yearbuilt && d.yearbuilt <= range[1];
                        });
                        return years[0]+'-'+years[1];
                    })
                    .rollup(function(d) {
                        return {
                            'avgsqft': d3.mean(d, function(e) { return e.sqfeet; }),
                            'avgeui': d3.mean(d, function(e) { return e.eui; }),
                            'avgemissions': d3.mean(d, function(e) { return e.emissions; }),
                            'avgenergystar': d3.mean(d, function(e) { return e.energystar; }),
                            'count': d3.sum(d, function() { return 1; })
                        };
                    })
                    .entries(filteredData);
            return _.chain(rolledData)
                    .sortBy(function(d) { return d.key; })
                    .map(function(d) {
                        var obj = d.values;
                        obj.key = d.key;
                        obj.avgenergystar = isNaN(obj.avgenergystar) ? 0 : obj.avgenergystar;
                        return obj;
                    })
                    .reverse()
                    .value();
        }

        module.link = function ($scope, element, attrs) {
        console.log('this far...4')
            $scope.configure(BarChartDefaults);
            var config = $scope.config;
            config.margin.left = 0;
            $scope.selectOptions = {
                'avgsqft': 'Mean Sq Ft: ',
                'avgeui': 'Mean EUI: ',
                'avgemissions': 'Mean Emissions: ',
                'avgenergystar': 'Mean Energystar: '
            };
            var humanLabels = _.merge({ // Keep this separate from selectoptions but DRY
                'key': '',
                'count': 'n = '
            }, $scope.selectOptions);

            // The dimension of choice for representation along Y
            $scope.selectedY = config.yDefault;
            var yAttr = $scope.selectedY;

            // D3 margin, sizing, and spacing code
            element.addClass(PLOT_CLASS);
            var chart = d3.select('#' + attrs.id + ' .chart')
                    .attr('width', config.plotWidth);

            // Overridden ChartingController method
            $scope.plot = function(data) {
                if (config.binType === 'temporal') {
                    data = binByYears(data);
                } else if (config.binType === 'area') {
                    data = binBySqFt(data, 20); // 20 for groupings of 5, 10 for 10, 100 for 1;
                }

                chart.attr('height', config.plotHeight);

                // Axes and scales
                var x = d3.scale.ordinal()
                    .domain(data.map(function(d) { return d.key; }))
                    .rangeRoundBands([config.plotWidth-config.margin.left-config.margin.right, 0], 0.05);
                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d[yAttr]; })])
                    .range([config.plotHeight-config.margin.bottom-config.margin.top, 0]);
                var bottomAxis = d3.svg.axis()
                    .orient('bottom')
                    .scale(x)
                    .tickSize(3,1)
                    .tickValues([])
                var bottomAxisG = chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(' +config.margin.left + ',' + (config.plotHeight - config.margin.bottom) + ')')
                    .call(bottomAxis);

                // Axes should have custom labels to prevent cluttering; tooltips can handle detail
                var labelStart = chart.append('text')
                    .attr('class', 'x startLabel')
                    .attr('text-anchor', 'start')
                    .attr('y', config.plotHeight-config.margin.top)
                    .text('0th Percentile');
                var labelMid = chart.append('text')
                    .attr('class', 'x endLabel')
                    .attr('text-anchor', 'end')
                    .attr('x', config.plotWidth/2)
                    .attr('y', config.plotHeight-config.margin.top);
                var labelEnd = chart.append('text')
                    .attr('class', 'x endLabel')
                    .attr('text-anchor', 'end')
                    .attr('x', config.plotWidth-config.margin.right)
                    .attr('y', config.plotHeight-config.margin.top)
                    .text('100th Percentile');
                // Depending on bin type, our axis labeling should look rather different
                if (config.binType === 'temporal') {
                    labelStart.text('1850');
                    labelEnd.text('2013');
                } else if (config.binType === 'area') {
                    labelStart.text('0th Percentile');
                    labelEnd.text('100th Percentile');
                }

                // Tooltips
                var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    var dataLabel = d.key + (config.binType === 'area' ? 'th Percentile' : '');
                    return '<div class="propertyName">' + dataLabel + '</div>' +
                           '<div class="propertyname">' + humanLabels[yAttr] + Math.round(d[yAttr]).toLocaleString() + '</div>';
                  });
                chart.call(tip);

                // Bars
                chart.selectAll('bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('transform', function(d) { return 'translate(' + (x(d.key) + config.margin.left).toString() + ',0)'; })
                    .attr('y', function(d) { return y(d[yAttr]) + config.margin.top; })
                    // Height of zero initially so it can be animated on load
                    .attr('height', 0)
                    .attr('width', x.rangeBand())
                    .attr('rx', 3)
                    .attr('ry', 3)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                // Perform the initial animation
                // TODO: the bars draw from the top down. Would probably look better in reverse.
                refreshData();

                // Animation functions
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
                        .attr('y', function(d) {
                            var val = isNaN(d[yAttr]) ? 0 : y(d[yAttr]);
                            return val-10 + config.margin.top; })
                        .attr('height', function(d) {
                            var val = isNaN(d[yAttr]) ? 0 : y(d[yAttr]);
                            return config.plotHeight - val - config.margin.top - config.margin.bottom;
                        });
                }
                console.log($scope.$parent);

                $scope.$watch(function(scope) {
                    return scope.$parent.selectedY;
                }, function() {
                    yAttr = $scope.$parent.selectedY;
                    refreshData();
                });
            };
        };

        return module;
    }

    angular.module('mos.charting')
      .constant('BarChartDefaults', BarChartDefaults)
      .directive('mosBarchart', barChart);

})();
