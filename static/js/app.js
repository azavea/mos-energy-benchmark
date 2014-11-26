
// Initialization of document here:
// PLEASE: NO VARS IN THE GLOBAL NAMESPACE
$(document).ready(function() {
    'use strict';

    var barchart = new MOS.BarChart({
        id: 'svg#barchart'
    });
    barchart.plot(MOS.Util.seed(15, 100));

    var bubblechart = MOS.bubblechart("svg#bubble-chart", 800, 400, 50, 25);
    var bubbles = [[0,0,10],
                   [1,1,20],
                   [3,3,100],
                   [1,3,150],
                   [3,1,300]];
    bubblechart.plot(bubbles);
    bubbles = [[10,5,100],
                   [20,9,20],
                   [15,7,100],
                   [12,3,150],
                   [11,1,300]];
    bubblechart.plot(bubbles);

});
