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

            // Force headroom and panel-snap play nicely together
            initHeader();

            // The panel snap logic on the charts page needs to use an
            // alternate element for scroll events. This conflicts with
            // Headroom, and it must be manually initialized.
            function initHeader() {
                var header = $('.header')[0];
                var scroller = element[0];
                var options = {
                    offset: 120,
                    scroller: scroller,
                    onTop: function() {
                        $scope.$broadcast('header:on-top');
                    },
                    onNotTop: function() {
                        $scope.$broadcast('header:on-not-top');
                    }
                };

                // The undefined check is so this doesn't fail in unit tests
                if (typeof Headroom !== 'undefined') {
                    var headroom = new Headroom(header, options);
                    headroom.init();
                }
            }
        };

        return module;
    }

    angular.module('mos.charting')
    .directive('mosPanelSnap', panelSnap);

})();
