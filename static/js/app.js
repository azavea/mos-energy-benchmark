
// Initialization of document here:
// PLEASE: NO VARS IN THE GLOBAL NAMESPACE
$(document).ready(function() {
    'use strict';

    var barchart = new MOS.BarChart({
        id: 'svg#barchart'
    });
    barchart.plot(MOS.Util.seed(15, 100));

});
