(function () {
    'use strict';

    /**
     * ngInject
     */
    function panelSnap () {
        // Begin directive module definition
        var module = {};

        module.restrict = 'A';

        module.link = function ($scope, element, attrs) {
            element.panelSnap();

            // Clicking any "mos-panel-snap-next" element will
            // advance the chart page to the next section
            element.find('[mos-panel-snap-next]').click(function(event){
                event.preventDefault();
                event.stopPropagation();
                element.panelSnap('snapTo', 'next');
            });
        };

        return module;
    }

    angular.module('mos.charting')
    .directive('mosPanelSnap', panelSnap);

})();
