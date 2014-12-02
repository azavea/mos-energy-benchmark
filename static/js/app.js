
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

        // TODO: make bubble chart use real data
        var bubblechart = new MOS.BubbleChart({
            id: 'svg#bubble-chart',
            width: 800,
            height: 400
        });
        var bubbles = [[0,0,10], [1,1,20], [3,3,100], [1,3,150], [3,1,300]];
        bubblechart.plot(bubbles);
        bubbles = [[10,5,100], [20,9,20], [15,7,100], [12,3,150], [11,1,300]];
        bubblechart.plot(bubbles);
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
            margins: [20, 20, 20, 100],
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
