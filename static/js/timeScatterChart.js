MOS.TimeScatterChart = (function(MOS) {
    'use strict';

    /*
     * TimeScatterChart Constructor
     *
     * @param options Object
     *      containerId: String container element selector
     *      width: Int width of the chart
     *      height: Int height of the chart
     *      margins: Array[top, right, bottom, left] margins of the chart
     *      labels: Dictionary lookup dictionary of attribute to label
     *      dimensions: Array[String] the available attributes to be charted
     *      xDefault: String default x-axis dimension
     *      yDefault: String default y-axis dimension
     *      prevLabel: String label for the previous year
     *      currLabel: String label for the current year
     *      prevColor: String hex color for the previous year
     *      currColor: String hex color for the current year
     *      prevRadius: Int radius for the previous year
     *      currRadius: Int radius for the current year
     *      transitionMillis: Int milliseconds of duration between transitions
     *
     * @return none
     */
    function TimeScatterChart(options) {
        var defaults = {
            containerId: '#time-scatter-chart',
            width: 800,
            height: 400,
            margins: [30, 10, 10, 10],
            labels: {
                eui: 'EUI',
                emissions: 'Emissions',
                energystar: 'Energy Star'
            },
            dimensions: ['eui', 'energystar', 'emissions'],
            xDefault: 'eui',
            yDefault: 'emissions',
            prevLabel: 2012,
            currLabel: 2013,
            prevColor: '#33CCFF',
            currColor: '#CC3366',
            prevRadius: 9,
            currRadius: 10,
            transitionMillis: 500
        };
        this.options = $.extend({}, defaults, options);
    }

    /*
     *  Plot the time scatter chart with the passed data
     *
     *  @param data Data to plot as time scatter chart
     *  @return the timeScatterChart object
     */
    TimeScatterChart.prototype.plot = function (data) {
        var containerId = this.options.containerId;
        var chartId = containerId + ' .chart';
        var xAxisId = containerId + ' .controls .axis.x select';
        var yAxisId = containerId + ' .controls .axis.y select';
        var margins = this.options.margins;
        var labels = this.options.labels;
        var width = this.options.width - margins[1] - margins[3];
        var height = this.options.height - margins[0] - margins[2];
        var dimensions = this.options.dimensions;
        var prevColor = this.options.prevColor;
        var currColor = this.options.currColor;
        var prevRadius = this.options.prevRadius;
        var currRadius = this.options.currRadius;
        var prevLabel = this.options.prevLabel;
        var currLabel = this.options.currLabel;
        var xAttr = this.options.xDefault;
        var yAttr = this.options.yDefault;
        var transitionMillis = this.options.transitionMillis;
        var xIndex = dimensions.indexOf(xAttr);
        var yIndex = dimensions.indexOf(yAttr);

        // Create the controls
        var controlsTemplate = ''
                + '<div class="controls">'
                + '  <div class="axis x">'
                + '    X axis'
                + '    <select></select>'
                + '  </div>'
                + '  <div class="axis y">'
                + '    Y axis'
                + '    <select></select>'
                + '  </div>'
                + '</div>';
        $(chartId).after(controlsTemplate);

        // Create the D3 svg graphic element
        var svg = d3.select(chartId)
                .append('g')
                .attr('transform', 'translate(' + margins[3] + ',' + margins[0] + ')');

        // Calculate extents for each dimension
        var extents = _.map(dimensions, function(dimension) {
            return [0, d3.max(data, function(d) {
                return Math.max(d.curr[dimension], d.prev[dimension]);
            })];
        });

        // Create scales
        var x = d3.scale.linear().domain(extents[xIndex]).range([0, width]);
        var y = d3.scale.linear().domain(extents[yIndex]).range([height, 0]);

        // Create axes
        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        var yAxis = d3.svg.axis().scale(y).orient('left');

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end');

        // Add tooltips
        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return '<span class="propertyName">' + d.curr.propertyname + '</span>';
                });
        svg.call(tip);

        // Draw the lines connecting the points
        var circles = svg.selectAll().data(data).enter();
        circles.append('line')
            .attr('class', 'connector')
            .attr('x1', function(d) { return x(d.prev[xAttr]); })
            .attr('y1', function(d) { return y(d.prev[yAttr]); })
            .attr('x2', function(d) { return x(d.curr[xAttr]); })
            .attr('y2', function(d) { return y(d.curr[yAttr]); });

        // Draw the current and previous year points
        drawPoints('curr', currColor, currRadius);
        drawPoints('prev', prevColor, prevRadius);

        // Populate dropdowns
        populateDropdown(xAxisId, xIndex);
        populateDropdown(yAxisId, yIndex);

        // Monitor x-axis dropdown changes
        d3.select(xAxisId).on('change', function() {
            var i = this.selectedIndex;
            xIndex = i;
            xAttr = dimensions[i];
            x.domain(extents[i]);
            refreshData();
        });

        // Monitor y-axis dropdown changes
        d3.select(yAxisId).on('change', function() {
            var i = this.selectedIndex;
            yIndex = i;
            yAttr = dimensions[i];
            y.domain(extents[i]);
            refreshData();
        });

        // Add a legend
        var legendData = [
            {
                label: prevLabel,
                color: prevColor,
                radius: prevRadius
            },
            {
                label: currLabel,
                color: currColor,
                radius: currRadius
            }
        ];
        var legend = svg.append('g')
                .attr('class', 'legend')
                .attr('x', width - 65)
                .attr('y', 25)
                .attr('height', 100)
                .attr('width', 100);

        legend.selectAll('g').data(legendData)
            .enter()
            .append('g')
            .each(function(d, i) {
                var g = d3.select(this);
                g.append('circle')
                    .attr('fill', function(d) { return d.color; })
                    .attr('cx', width - 65)
                    .attr('cy', i * 25)
                    .attr('r', function(d) { return d.radius; });
                g.append('text')
                    .attr('class', 'title')
                    .attr('x', width - 20)
                    .attr('y', i * 25 + 4)
                    .attr('height', 30)
                    .attr('width', 100)
                    .text(function(d) { return d.label; });
            });

        // Helper for drawing points on the chart
        function drawPoints(objName, color, radius) {
            circles.append('circle')
                .attr('class', objName)
                .attr('fill', function(d) { return color; })
                .attr('cx', function(d) { return x(d[objName][xAttr]); })
                .attr('cy', function(d) { return y(d[objName][yAttr]); })
                .attr('r', radius)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }

        // Helper for redrawing the data with transitions
        function refreshData() {
            svg.selectAll('circle.curr')
                .transition()
                .ease('linear')
                .duration(transitionMillis)
                .attr('cx', function(d) { return x(d.curr[xAttr]); })
                .attr('cy', function(d) { return y(d.curr[yAttr]); });

            svg.selectAll('circle.prev')
                .transition()
                .ease('linear')
                .duration(transitionMillis)
                .attr('cx', function(d) { return x(d.prev[xAttr]); })
                .attr('cy', function(d) { return y(d.prev[yAttr]); });

            svg.selectAll('line.connector')
                .transition()
                .ease('linear')
                .duration(transitionMillis)
                .attr('x1', function(d) { return x(d.prev[xAttr]); })
                .attr('y1', function(d) { return y(d.prev[yAttr]); })
                .attr('x2', function(d) { return x(d.curr[xAttr]); })
                .attr('y2', function(d) { return y(d.curr[yAttr]); });

            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);
        }

        // Helper for populating a dropdown
        function populateDropdown(dropdownId, selectedValue) {
            d3.select(dropdownId)
                .selectAll('option')
                .data(dimensions)
                .enter().append('option')
                .attr('value', function(d, i) { return i; })
                .text(function(d) { return labels[d]; })
                .each(function(d, i) {
                    if (i === selectedValue) {
                        d3.select(this).attr('selected', 'yes');
                    }
                });
        }
    };

    return TimeScatterChart;
}(MOS));
