
// Initialization of document here:
// PLEASE: NO VARS IN THE GLOBAL NAMESPACE
$(document).ready(function() {
    'use strict';

    // The majority of charts only require current data
    var currData = MOS.Data.getCurrentData();
    currData.fail(function(err) {
        console.error('Error getting current data: ', err);
    });
    currData.done(function(data) {
        var rows = data.rows;

        // TODO: make bar chart use real data
        var barchart = new MOS.BarChart({
            id: 'svg#barchart'
        });
        barchart.plot(MOS.Util.seed(15, 100));

        var scatterchart = new MOS.ScatterChart({
            id: '#scatter-chart',
            width: 800,
            height: 400,
            pointFillColor: '#14bfd6',
            pointStrokeColor: '#2e9ec6',
            margins: {left: 80, right: 10, top: 10, bottom: 30},
            dimensions: ['eui', 'energystar', 'emissions'],
            xDefaultDim: 'eui',
            yDefaultDim: 'emissions',
            areaDefaultDim: 'energystar',
            minRadius: 1,
            maxRadius: 6
        });
        scatterchart.plot(rows);
    });

    // The scatter over time chart requires both previous data and current data
    var prevData = MOS.Data.getPreviousData();
    prevData.fail(function(err) {
        console.error('Error getting previous data: ', err);
    });

    $.when(currData, prevData).done(function(curr, prev) {
        var timeScatterChart = new MOS.TimeScatterChart({
            containerId: '#time-scatter-chart',
            width: 800,
            height: 400,
            margins: {top: 20, right: 20, bottom: 20, left: 100},
            labels: MOS.Config.labels,
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
        });
        timeScatterChart.plot(MOS.Data.getCombinedData(curr, prev));
    });

});
