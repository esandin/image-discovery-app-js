define([
    "dojo/_base/declare",
    "dojo/Evented"
],
    function (declare, Evented) {
        return declare(
            [Evented],
            {
                SHRINK_GRID: "shrinkGrid",
                EXPAND_GRID: "expandGrid",
                cart: ko.observable(true),
                results: ko.observable(true),
                expanded: ko.observable(false),
                zoomToSelected: ko.observable(false),
                timeSlider: ko.observable(true),
                reportIcon: ko.observable(false),
                filterIcon: ko.observable(false),
                toolsActive: ko.observable(false),
                resultCount: ko.observable(0),
                drawActive: ko.observable(false),
                forceSourceFilterHide: ko.observable(false),
                constructor: function () {
                    var self = this;
                    var showTrashIconAnon = function () {
                        return  self.results();
                    };
                    this.showTrashIcon = ko.computed(showTrashIconAnon);
                    var showTimeSliderAnon = function () {
                        return self.results() && self.timeSlider()  && self.toolsActive();
                    };
                    this.showTimeSlider = ko.computed(showTimeSliderAnon);


                    var showLayerTransparencyAnon = function () {
                        return self.results();
                    };
                    this.showLayerTransparency = ko.computed(showLayerTransparencyAnon);


                    var showSourcesIconAnon = function () {
                        return  self.results() && !self.forceSourceFilterHide();
                    };
                    this.showSourcesIcon = ko.computed(showSourcesIconAnon);


                    var showFilterResetIconAnon = function () {
                        return  self.filterIcon() && self.results();
                    };
                    this.showFilterResetIcon = ko.computed(showFilterResetIconAnon);
                    var resultsVisible = function () {
                        return self.results();
                    };
                    this.resultsVisible = ko.computed(resultsVisible);
                },
                toggleGrid: function () {
                    if (this.cart()) {
                        this.results(true);
                        this.cart(false);
                    }
                    else {
                        this.cart(true);
                        this.results(false);
                    }
                },
                gridLabel: function () {
                    return this.results() ? "Results" : "";
                },
                cartClick: function () {
                    this.cart(true);
                    this.results(false);
                },
                resultsClick: function () {
                    this.cart(false);
                    this.results(true);
                },
                toggleExpand: function () {
                    this.expanded(!this.expanded());
                },
                setFilterIconHidden: function () {
                    this.filterIcon(false);
                },
                setFilterIconVisible: function () {
                    this.filterIcon(true);
                }
                /*
                 toggleRectangleResultsSelection: function () {
                 var stateBeforeClear = this.rectangleSelectionActive();
                 this.emit(this.CLEAR_DRAW);
                 if (!stateBeforeClear) {
                 this.emit(this.ACTIVATE_RECTANGLE_SELECT);
                 this.drawActive(true);
                 }
                 this.rectangleSelectionActive(!stateBeforeClear);
                 },
                 clearRectangleDraw: function () {
                 this.rectangleSelectionActive(false);
                 },

                 clearAllDraw: function () {
                 this.clearRectangleDraw();
                 this.drawActive(false);
                 topic.publish(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.CLEAR_HIGHLIGHTED_RESULTS);

                 },
                 clearHighlights: function () {
                 this.emit(this.CLEAR_DRAW);
                 }
                 */
            });
    });