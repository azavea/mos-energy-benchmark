MOS.Data = (function(MOS) {
    'use strict';

    var module = {};

    /*
     *  Retrieves the current data from CartoDB
     *
     *  @return jQuery.Deferred object
     */
    module.getCurrentData = function () {
        return makeCartoDBRequest(MOS.Config.data.currQuery);
    };

    /*
     *  Retrieves the previous data from CartoDB
     *
     *  @return jQuery.Deferred object
     */
    module.getPreviousData = function () {
        return makeCartoDBRequest(MOS.Config.data.prevQuery);
    };

    /*
     *  Retrieves the grouped data from CartoDB
     *
     *  @return jQuery.Deferred object
     */
    module.getGroupedData = function () {
        return makeCartoDBRequest(MOS.Config.data.groupedQuery);
    };

    /*
     * Combines the rows, keeps the ones where data exists for both years
     *
     * @param currData Object returned from CartoDB representing current data
     *     prevData Object returned from CartoDB representing previous data
     *
     * @return Array of merged data
     */
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

    // Helper for getting data from CartoDB and returning a promise
    function makeCartoDBRequest(query) {
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
