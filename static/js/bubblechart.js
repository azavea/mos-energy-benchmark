'use strict'

MOS.bubblechart = function(selector, width, height, margin, padding) {
    var module = {};

    var chart;
    var leftaxis;
    var leftaxisg;
    var bottomaxis;
    var bottomaxisg;

    module.init = function () {
        chart = d3.select(selector)
                .attr("width", width)
                .attr("height", height);
        leftaxis = d3.svg.axis().orient("left");
        leftaxisg = chart.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + (margin) + ",0)");
        bottomaxis = d3.svg.axis().orient("bottom");
        bottomaxisg = chart.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0, " + (height-margin) + ")");


    };
    // data = [ [x, y, area], [x, y, area], ... ]
    module.plot = function(data) {

        var datumX = function(datum) { return datum[0]; };

        var datumY = function(datum) { return datum[1]; };

        var datumA = function(datum) { return datum[2]; };

        var x = d3.scale.linear()
            .domain([0, d3.max(data, datumX)])
            .range([margin+padding, width-margin-padding]);

        var y = d3.scale.linear()
            .domain([0, d3.max(data, datumY)])
            .range([height-margin-padding, margin+padding]);

        var a = d3.scale.linear()
                    .domain([0, d3.max(data, datumA)])
                    .range([0, 1000]);

        /* convert a data point's area to a radius for setting 
         * the "r" attribute
         */
        var getR = function(datum) {
            return Math.sqrt(a(datumA(datum))/Math.PI);
        };


        leftaxis.scale(y);
        bottomaxis.scale(x);
        leftaxisg.call(leftaxis);
        bottomaxisg.call(bottomaxis);

        var circles;

        circles = chart.selectAll("circle")
                  .data(data);

        circles.transition().duration(2000)
               .attr("cx", function (d) { return x(datumX(d)); })
               .attr("cy", function (d) { return y(datumY(d)); })
               .attr("r", getR);

        circles.enter().append("circle")
               .attr("cx", function (d) { return x(datumX(d)); })
               .attr("cy", function (d) { return y(datumY(d)); })
               .attr("r", getR);
        circles.exit().remove();
    };

    module.init();
    return module;
};
