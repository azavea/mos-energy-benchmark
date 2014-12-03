MOS.ScatterChart = (function(MOS) {
    'use strict'

    /*
     * ScatterChart Constructor
     * @param options Object
     *      id: id of node in which chart will be created
     *      width: the total width of the chart
     *      height: the total height of the chart
     *      pointFillColor: The color to fill points with
     *      pointStrokeColor: The color to stroke points with
     *      margins: object specifying distance from chart to edges of axes.
     *               Formatted: {left: x1, right: x2, top: y1, bottom: y2}
     *      xDefaultDim: The default dimension to use on the x-axis
     *      yDefaultDim: The default dimension to use on the y-axis
     *      areaDefaultDim: The default dimension to use for scaling point area
     *      minRadius: The minimum point radius
     *      maxRadius: The maximum point radius
     * @return none
     */
    function ScatterChart(options) {
        var defaults = {
            id: '#scatter-chart',
            width: 800,
            height: 400,
            pointFillColor: '#14bfd6',
            pointStrokeColor: '#2e9ec6',
            margins: {top: 10, right: 10, bottom: 30, left: 30},
            xDefaultDim: 'eui',
            yDefaultDim: 'emissions',
            areaDefaultDim: 'energystar',
            minRadius: 1,
            maxRadius: 6
        };
        this.options = $.extend({}, defaults, options);
        // Create SVG element in container
        $(this.options.id).append('<svg class="chart"></svg>');
        this.chart = d3.select(this.options.id + ' .chart')
                .attr('width', this.options.width)
                .attr('height', this.options.height);
        this.leftaxis = d3.svg.axis().orient('left');
        this.leftaxisg = this.chart.append('g')
                        .attr('class', 'y axis')
                        .attr('transform', 'translate(' + this.options.margins.left + ',0)');
        this.bottomaxis = d3.svg.axis().orient('bottom');
        this.bottomaxisg = this.chart.append('g')
                           .attr('class', 'x axis')
                           .attr('transform', 'translate(0, ' +
                                       (this.options.height - this.options.margins.bottom) +
                                       ')');
    }

    /*
     *  Replot the scatter chart with the passed data series
     *  @param data Array values to plot [ {eui: ..., energystar: ..., emissions: ...} ...]
     *  @return none
     */
    ScatterChart.prototype.plot = function(data) {
        var opts = this.options;
        var xDim = opts.xDefaultDim;
        var yDim = opts.yDefaultDim;
        var areaDim = opts.areaDefaultDim;

        // Need to make sure that all values are at least 1 for a log scale.
        var datumX = function(datum) { return datum[xDim] < 1 ? 1 : datum[xDim]; };
        var datumY = function(datum) { return datum[yDim] < 1 ? 1 : datum[yDim]; };
        // Return the radius of a circle with area of this item
        var datumR = function(datum) {
            return Math.sqrt(datum[areaDim] / Math.PI);
        };

        // Create SVG element inside container
        // Set up scaling and axes
        var x = d3.scale.log()
                .domain([1, d3.max(data, datumX)])
                .range([opts.margins.left,
                        opts.width - opts.margins.right]);

        var y = d3.scale.log()
                .domain([1, d3.max(data, datumY)])
                .range([opts.height - opts.margins.bottom,
                        opts.margins.top]);

        var r = d3.scale.linear()
                .domain([0, d3.max(data, datumR)])
                .range([opts.minRadius, opts.maxRadius]);

        this.leftaxis.scale(y);
        this.bottomaxis.scale(x);
        this.leftaxisg.call(this.leftaxis);
        this.bottomaxisg.call(this.bottomaxis);

        // Add tooltips
        var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return '<span class="propertyName">' + d.propertyname + '</span>';
                });
        this.chart.call(tip);

        // Create circles
        var circles = this.chart.selectAll('circle')
                          .data(data);

        circles.transition().duration(2000)
               .attr('cx', function (d) { return x(datumX(d)); })
               .attr('cy', function (d) { return y(datumY(d)); })
               .attr('r', function (d) { return r(datumR(d)); });

        circles.enter().append('circle')
               .attr('cx', function (d) { return x(datumX(d)); })
               .attr('cy', function (d) { return y(datumY(d)); })
               .attr('r', function (d) { return r(datumR(d)); })
               .attr('fill', opts.pointFillColor)
               .attr('stroke', opts.pointStrokeColor)
               .on('mouseover', tip.show)
               .on('mouseout', tip.hide);
        circles.exit().remove();
    };

    return ScatterChart;
}(MOS));
