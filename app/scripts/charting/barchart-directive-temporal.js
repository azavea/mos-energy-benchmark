(function () {
    'use strict';

    // Define object config of properties for this chart directive
    var BarChartDefaultsTemporal = {
        plotWidth: 800,
        plotHeight: 200,
        yDefault: 'avgemissions',
    };

    /**
     * ngInject
     */
    function barChartTemporal (CartoConfig, BarChartDefaultsTemporal) {

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
            plotWidth: '@',
            plotHeight: '@',
            margin: '&',
        };

        // Helper function for transforming unshaped data into data binned and aggregated over 5 year periods
        function transformData(data) {
            var filteredData = _.filter(data, function(d) { return d.yearbuilt > 1849 ; });
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
                            'avgsqft': d3.mean(d, function(e) { return +e.sqfeet; }),
                            'avgeui': d3.mean(d, function(e) { return +e.eui; }),
                            'avgemissions': d3.mean(d, function(e) { return +e.emissions; }),
                            'avgenergystar': d3.mean(d, function(e) { return +e.energystar; }),
                            'count': d3.sum(d, function() { return +1; })
                        };
                    })
                    .entries(filteredData);
            return _.sortBy(rolledData, function(d) { return d.key; }).reverse();
        }

        module.link = function ($scope, element, attrs) {
            $scope.configure(BarChartDefaultsTemporal);
            var config = $scope.config;
            config.margin.left = 0;
            $scope.selectOptions = {
                'avgsqft': 'Avg Sq. Ft.',
                'avgeui': 'Avg EUI',
                'avgemissions': 'Avg Emissions',
                'avgenergystar': 'Avg Energystar',
            };
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

            // Overridden ChartingController method
            $scope.plot = function(data) {
                data = transformData(data);

                chart.attr('height', config.plotHeight);

                // Axes
                var x = d3.scale.ordinal()
                    .domain(data.map(function(d) { return d.key; }))
                    .rangeRoundBands([config.plotWidth-config.margin.left-config.margin.right, 0], 0.05);
                bottomAxis.scale(x);
                bottomAxisG.call(bottomAxis);

                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) { return d.values[yAttr]; })])
                    .range([config.plotHeight-config.margin.bottom-config.margin.top, 0]);
                leftAxis.scale(y);

                // Tooltips
                var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) { return '<div class="propertyName">' + d.key +
                      '</div><div class="propertyname">' + yAttr + ': ' +
                      d.values[yAttr] + '</div>'; });
                chart.call(tip);

                // Bars
                var bars = chart.selectAll('bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('transform', function(d) { return 'translate(' + (x(d.key) + config.margin.left).toString() + ',0)'; })
                    .attr('y', function(d) {return y(d.values[yAttr]) + config.margin.top; })
                    .attr('height', function(d) { return config.plotHeight - y(d.values[yAttr]) - config.margin.top - config.margin.bottom; })
                    .attr('width', x.rangeBand())
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                // Animation
                function refreshScale() {
                    y.domain([0, d3.max(data, function(d) { return d.values[yAttr]; })]);
                }

                function refreshData() { // This thing doesn't work properly; complains of NaNs and I can't figure out where/how
                    var transitionMillis = config.transitionMillis;
                    refreshScale();
                    chart.selectAll('rect')
                        .transition()
                        .ease('linear')
                        .duration(transitionMillis)
                        .attr('height', function(d) { return config.plotHeight - y(d.values[yAttr]) - config.margin.top - config.margin.bottom; });
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
    .constant('BarChartDefaultsTemporal', BarChartDefaultsTemporal)
    .directive('mosBarchartTemporal', barChartTemporal);

})();
