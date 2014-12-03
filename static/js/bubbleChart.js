MOS.BubbleChart = (function(MOS) {
    'use strict'

    /*
     * BubbleChart Constructor
     * @param options Object
     *      id: the selector passed to d3.select()
     *      width: the total width of the chart
     *      height: the total width of the chart
     *      padding: the space between bubbles
     *      transitionTime: the amount of msec a transition animation takes
     * @return none
     */
    function BubbleChart(options) {
        var defaults = {
            id: 'mos-bubblechart',
            padding: 25,
            transitionTime: 500
        };
        this.options = $.extend({}, defaults, options);
        this.chart = d3.select(this.options.id)
                .attr('width', this.options.width)
                .attr('height', this.options.height);
        this.pack = d3.layout.pack()
                .size([this.options.width, this.options.height])
                .padding(this.options.padding);
        this.tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0]);
        this.chart.call(this.tip);
    }

    /*
     *  Load data into the BubbleChart instance
     *  @param data Array values to plot [ { name: "Hello", series_value: 1234 }, ... ]
     *  @return none
     */
    BubbleChart.prototype.data = function(data) {
        this.data = data;
    };

    /*
     *  Replot the bubble chart with the passed data series
     *  @param series The series property of the data to select
     *  @return none
     */
    BubbleChart.prototype.plot = function(series) {
        var opts = this.options;
        var color = d3.scale.category20();
        var node;

        this.tip.html(function (d) {
            return '<div>' + d.name + '</div>' +
                   '<div>' +
                   MOS.Config.labels[series] + ': ' +
                   Math.round(d[series]) + '</div>';
        });
        this.pack
            .sort(null)
            .value(function (d) { return d[series] || 0; });

        node = this.chart.selectAll('g')
                         .data(this.pack.nodes({ children: this.data }));

        // Update
        node.transition().duration(opts.transitionTime)
            .attr('transform', function(d) { return 'translate(' + d.x +
                                                    ',' + d.y + ')'; })
            .selectAll('circle')
            .attr('r', function (d) { return d.r; });

        // Add
        node.enter().append('g')
                .filter(function (d) { return d.depth === 1; })
                .attr('transform', function(d) { return 'translate(' + d.x +
                                                        ',' + d.y + ')'; })
                .append('circle')
                .attr('r', function (d) { return d.r; })
                .attr('class', 'bubble')
                .style('fill', function (d, i) { return color(i); })
                .on('mouseover', this.tip.show)
                .on('mouseout', this.tip.hide);
    };

    return BubbleChart;
}(MOS));
