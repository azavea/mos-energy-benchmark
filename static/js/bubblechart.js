MOS.BubbleChart = (function(MOS) {
    'use strict'

    /*
     * BubbleChart Constructor
     * @param options Object
     *      id: the selector passed to d3.select()
     *      width: the total width of the chart
     *      height: the total width of the chart
     *      margin: the space, in pixels, from the edge of the chart to
     *              the edge of the axis
     *      padding: the space, in pixels, from the edge of the data to
     *               the edge of the axis
     * @return none
     */
    function BubbleChart(options) {
        var defaults = {
            id: 'mos-bubblechart',
            margin: 25,
            padding: 25
        };
        this.options = $.extend({}, defaults, options);
        this.chart = d3.select(this.options.id)
                .attr('width', this.options.width)
                .attr('height', this.options.height);
        this.leftaxis = d3.svg.axis().orient('left');
        this.leftaxisg = this.chart.append('g')
                        .attr('class', 'y axis')
                        .attr('transform', 'translate(' + this.options.margin + ',0)');
        this.bottomaxis = d3.svg.axis().orient('bottom');
        this.bottomaxisg = this.chart.append('g')
                           .attr('class', 'x axis')
                           .attr('transform', 'translate(0, ' +
                                       (this.options.height - this.options.margin) +
                                       ')');
    }

    /*
     *  Replot the bubble chart with the passed data series
     *  @param data Array values to plot [ [x, y, area], [x, y, area], ... ]
     *  @return none
     */
    BubbleChart.prototype.plot = function(data) {

        var datumX = function(datum) { return datum[0]; };
        var datumY = function(datum) { return datum[1]; };
        var datumA = function(datum) { return datum[2]; };

        var x = d3.scale.linear()
                .domain([0, d3.max(data, datumX)])
                .range([this.options.margin + this.options.padding,
                        this.options.width - this.options.margin -
                        this.options.padding]);

        var y = d3.scale.linear()
                .domain([0, d3.max(data, datumY)])
                .range([this.options.height - this.options.margin -
                        this.options.padding,
                        this.options.margin + this.options.padding]);

        var a = d3.scale.linear()
                .domain([0, d3.max(data, datumA)])
                .range([0, 1000]);

        /* convert a data point's area to a radius for setting 
         * the "r" attribute
         */
        var getR = function(datum) {
            return Math.sqrt(a(datumA(datum))/Math.PI);
        };


        this.leftaxis.scale(y);
        this.bottomaxis.scale(x);
        this.leftaxisg.call(this.leftaxis);
        this.bottomaxisg.call(this.bottomaxis);

        var circles = this.chart.selectAll('circle')
                          .data(data);

        circles.transition().duration(2000)
               .attr('cx', function (d) { return x(datumX(d)); })
               .attr('cy', function (d) { return y(datumY(d)); })
               .attr('r', getR);

        circles.enter().append('circle')
               .attr('cx', function (d) { return x(datumX(d)); })
               .attr('cy', function (d) { return y(datumY(d)); })
               .attr('r', getR);
        circles.exit().remove();
    };

    return BubbleChart;
}(MOS));
