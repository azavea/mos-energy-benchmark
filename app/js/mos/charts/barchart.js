MOS.BarChart = (function(MOS) {
    'use strict';

    /*
     * BarChart Constructor
     *
     * @param options Object
     *      id: the selector passed to d3.select()
     *
     * @return none
     */
    function BarChart(options) {
        var defaults = {
            id: 'mos-barchart'
        };
        this.options = $.extend({}, defaults, options);
    }

    /*
     *  Replot the bar chart with the passed data series
     *
     *  @param data Array Values to plot as barchart
     *  @return none
     */
    BarChart.prototype.plot = function (data) {
        var width = 400,
            barHeight = 20;

        var x = d3.scale.linear()
            .domain([0, d3.max(data)])
            .range([0, width]);

        var chart = d3.select(this.options.id)
            .attr('width', width)
            .attr('height', barHeight * data.length);

        var bar = chart.selectAll('g')
            .data(data)
            .enter().append('g')
            .attr('transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; });

        bar.append('rect')
            .attr('width', x)
            .attr('height', barHeight - 1);

        bar.append('text')
          .attr('x', function(d) { return x(d) - 3; })
          .attr('y', barHeight / 2)
          .attr('dy', '.35em')
          .text(function(d) { return d; });

    };

    return BarChart;

}(MOS));

