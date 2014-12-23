(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaults = {
        plotWidth: 700,
        plotHeight: 200,
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
            selectedY: '=',
            selectLabel: '=',
            selectUnit: '=',
            plotHeight: '@',
            margin: '&',
            binType: '@',
            lazyLoad: '@',
            transitionMillis: '@'
        };


        // This is a helper function for transforming api data into percentiles based on sqft
        function binBySqFt(data, groups) {
            data = _.filter(data, function(d) { return d.sqfeet > 0; });
            _.forEach(data, function(d) {
                d.log = Math.log(d.sqfeet) / Math.log(10);
            });
            var maxLog = _.max(data, function(d) { return d.log; }).log;
            var binnedBySqFt = {};
            var binSize = maxLog / groups;
            var getBinSize =  function(d) {
                return binSize * i < d.log && (binSize * i) + binSize >= d.log;
            };
            for (var i = 0; i < groups; i++) {
                binnedBySqFt[i] = _.filter(data, getBinSize);
            }
            var output = [];
            _.forEach(binnedBySqFt, function(d, i) {
                // Naive count
                var kCount = d.length;
                // Special counts for fair avging
                var nEnergystar = _.filter(d, function(e) { return !isNaN(e.energystar) && e.energystar > 0; }).length;
                var nEUI = _.filter(d, function(e) { return !isNaN(e.eui) && e.eui > 0; }).length;
                // The bin boundaries
                var lowBound = Math.round(Math.pow(10, (i * binSize))).toLocaleString();
                var highBound = Math.round(Math.pow(10, (i * binSize) + binSize)).toLocaleString();
                // Min and max sq ft
                var minsqft = _.min(d, function(val) { return val.sqfeet; }).sqfeet;
                var maxsqft = _.max(d, function(val) { return val.sqfeet; }).sqfeet;
                output = output.concat({
                    totalemissions: _.reduce(d, function(memo, val) { return val.emissions + memo; }, 0),
                    avgenergystar: nEnergystar > 0 ? _.reduce(d, function(memo, val) { return val.energystar + memo; }, 0) / nEnergystar : 0,
                    avgeui: nEUI > 0 ? _.reduce(d, function(memo, val) { return val.eui + memo; }, 0) / nEUI : 0,
                    minsqft: minsqft ? minsqft : 0,
                    maxsqft: maxsqft ? maxsqft : 0,
                    avgsqft: _.reduce(d, function(memo, val) { return val.sqfeet + memo; }, 0) / kCount,
                    totalsqft: _.reduce(d, function(memo, val) { return val.sqfeet + memo; }, 0),
                    totalenergy: _.reduce(d, function(memo, val) { return (val.sqfeet * val.eui) + memo; }, 0),
                    count: kCount,
                    key: lowBound + ' - ' + highBound,
                    yearRange: _.min(d, function(d) { return d.yearbuilt; }).yearbuilt +
                        '-' + _.max(d, function(d) { return d.yearbuilt; }).yearbuilt
                });
            });
            return _.rest(output, function(d) { return d.count === 0; }).reverse(); // Prune empty head
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
                        return years[0]+' - '+years[1];
                    })
                    .rollup(function(d) {
                        return {
                            totalsqft: d3.mean(d, function(e) { return e.sqfeet; }),
                            avgeui: d3.mean(d, function(e) { return e.eui; }),
                            totalemissions: d3.mean(d, function(e) { return e.emissions; }),
                            avgenergystar: d3.mean(d, function(e) { return e.energystar; }),
                            count: d3.sum(d, function() { return 1; }),
                            totalenergy: d3.sum(d, function(e) { return e.eui * e.sqfeet; })
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
            $scope.configure(BarChartDefaults);
            var config = $scope.config;
            config.margin.left = 0;

            // D3 margin, sizing, and spacing code
            element.addClass(PLOT_CLASS);
            var chart = d3.select('#' + attrs.id + ' .chart')
                    .attr('width', config.plotWidth)
                    .attr('height', config.plotHeight);

            // Overridden ChartingController method
            $scope.plot = function(data) {
                // The dimension of choice for representation along Y
                var yAttr = $scope.selectedY;
                // Chart height
                chart.attr('height', config.plotHeight);

                // Choose appropriate binning algorithm
                if (config.binType === 'temporal') {
                    data = binByYears(data);
                } else if (config.binType === 'area') {
                    data = binBySqFt(data, 62); // 62 is the magic number for generating a
                                                // logarithmically generated set of bins which
                                                // have  32 after pruning the empty head (30 removed)
                }

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
                    .tickValues([]);
                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(' +config.margin.left + ',' + (config.plotHeight - config.margin.bottom) + ')')
                    .call(bottomAxis);

                // Axes should have custom labels to prevent cluttering; tooltips can handle detail
                var labelStart = chart.append('text')
                    .attr('class', 'x startLabel')
                    .attr('x', config.margin.left)
                    .attr('y', config.plotHeight-config.margin.top);
                var labelEnd = chart.append('text')
                    .attr('class', 'x endLabel')
                    .attr('x', config.plotWidth-config.margin.right)
                    .attr('y', config.plotHeight-config.margin.top);
                var labelMiddle = chart.append('text')
                    .attr('class', 'x centerLabel')
                    .attr('x', (config.plotWidth - config.margin.right) / 2)
                    .attr('y', config.plotHeight - config.margin.top);
                // Depending on bin type, our axis labeling should look rather different
                if (config.binType === 'temporal') {
                    labelStart.text('1850');
                    labelEnd.text('2013');
                    labelMiddle.text('Year Built');
                } else if (config.binType === 'area') {
                    labelStart.text(Math.round(data[data.length - 1].minsqft / 1000).toLocaleString() + 'k');
                    labelEnd.text(Math.round(data[0].maxsqft / 1000).toLocaleString() + 'k');
                    labelMiddle.text('Sq. Feet');
                }

                // Tooltips
                var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    var dataLabel = d.key + (config.binType === 'area' ? ' Sq Ft' : '');
                    return '<div class="propertyName">' + dataLabel + '</div><br />' +
                           '<div class="propertyName">' + $scope.selectLabel + ':</div>' +
                           '<div class="propertyName">' + Math.round(d[yAttr]).toLocaleString() + ' ' + $scope.selectUnit + '</div>';
                  });
                chart.call(tip);

                // Bars
                chart.selectAll('bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('transform', function(d) { return 'translate(' + (x(d.key) + config.margin.left).toString() + ',0)'; })
                    .attr('y', config.plotHeight - config.margin.bottom)
                    // Height of zero initially so it can be animated on load
                    .attr('height', 0)
                    .attr('width', x.rangeBand())
                    .attr('opacity', function(d, i) { return 1 - (i / data.length) * 0.3; })
                    .attr('rx', 3) // Rounding of corners
                    .attr('ry', 3)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                // Perform the initial animation
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
                        .attr('class', config.binType)
                        .attr('y', function(d) {
                            var val = isNaN(d[yAttr]) ? 0 : y(d[yAttr]);
                            return val - 10 + config.margin.top; })
                        .attr('height', function(d) {
                            var val = isNaN(d[yAttr]) ? 0 : y(d[yAttr]);
                            return config.plotHeight - val - config.margin.top - config.margin.bottom;
                        });
                }

                $scope.$watch('selectedY', function(newValue) {
                    yAttr = newValue;
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
