MOS.Data = (function(MOS) {
    'use strict';

    var module = {};

    // Retrieves the current data and returns a promise
    module.getCurrentDataPromise = function () {
        return getDataPromise(MOS.Config.data.currQuery);
    };

    // Retrieves the previous data and returns a promise
    module.getPreviousDataPromise = function () {
        return getDataPromise(MOS.Config.data.prevQuery);
    };

    // Combines the rows, keeps the ones where data exists for both years, and returns an array
    module.getCombinedData = function (currData, prevData) {
        var currRows = currData[0].rows;
        var prevRows = prevData[0].rows;

        var data = {};
        var dataArr = [];
        $(prevRows).each(function(i, row) {
            data[row.id] = {
                prev: row
            };
        });
        $(currRows).each(function(i, row) {
            if (data[row.id]) {
                data[row.id].curr = row;
            }
        });
        $(prevRows).each(function(i, row) {
            if (!data[row.id].curr) {
                delete data[row.id];
            } else {
                dataArr.push(data[row.id]);
            }
        });

        return dataArr;
    };

    // Helper for getting data and returning a promise
    function getDataPromise(query) {
        return $.ajax({
            type: 'GET',
            url: MOS.Config.data.url,
            data: {
                q: query
            }
        });
    }

    return module;

}(MOS));
