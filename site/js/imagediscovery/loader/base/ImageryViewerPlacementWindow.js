define([
    "dojo/_base/declare",
    "dojo/topic",
    "esriviewer/loader/base/ViewerPlacementWindow",
    "./BaseImageryViewerPlacement"

],
    function (declare, topic, ViewerPlacementWindow, BaseImageryViewerPlacement) {
        return declare(
            [BaseImageryViewerPlacement, ViewerPlacementWindow],
            {
                placeDiscoveryWidget: function (discoveryWidget) {
                    topic.publish(VIEWER_GLOBALS.EVENTS.TOOLS.ACCORDION.ADD_ITEM, discoveryWidget);
                }

            }
        );
    });