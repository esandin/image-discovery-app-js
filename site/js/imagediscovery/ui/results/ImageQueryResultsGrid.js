define([
    "dojo/_base/declare",
    "dojo/dom-geometry",
    "dojo/topic",
    "dojo/on",
    "dijit/registry",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/store/Observable",
    "dojo/store/Memory",
    "dijit/form/Button",
    "../base/grid/ImageryGrid",
    "dijit/TooltipDialog",
    "../filter/UserAppliedFiltersManager"

],
    function (declare, domGeometry, topic, on, registry, query, lang, domConstruct, domClass, domStyle, Observable, Memory, Button, ImageryGrid, TooltipDialog, UserAppliedFiltersManager) {
        return declare(
            [ImageryGrid],
            {
                constructor: function (params) {
                    this.currentVisibleFilterTooltipObject = null;
                    //lookup for the filter popups to map to the filter icon
                    this.filterPopupLookup = {};
                    //lookup for the filter widgets
                    this.filterWidgetLookup = {};
                    //lookup for the filter icon in the grid header
                    this.filterIconLookup = {};
                    this.responseFeatures = [];
                },
                postCreate: function () {
                    this.inherited(arguments);
                    this.userAppliedFiltersManager = new UserAppliedFiltersManager();
                },
                initListeners: function () {
                    this.inherited(arguments);
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.COMPLETE, lang.hitch(this, this.handleQueryComplete));
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.HIGHLIGHT_RESULTS_FOM_POINT_INTERSECT, lang.hitch(this, this.highlightResultsFromPointIntersect));
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.HIGHLIGHT_RESULTS_FOM_RECTANGLE_INTERSECT, lang.hitch(this, this.highlightResultsFromRectangleIntersect));
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.SHOW_IMAGE_FROM_POINT_INTERSECT, lang.hitch(this, this.showCorrespondingImageFromPointIntersect));
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.CLEAR_HIGHLIGHTED_RESULTS, lang.hitch(this, this.clearHighlightedResults));

                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.ORDER_BY_LOCK_RASTER, lang.hitch(this, this.orderByLockRaster));

                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.GRAY_OUT_RESULTS_BY_FUNCTION, lang.hitch(this, this.grayOutRowsByFunction));

                    //todo: this needs to be in a manager that keeps count of how many disable requests there are
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.DISABLE_THUMBNAIL_CHECKBOXES, lang.hitch(this, this.disableThumbnailToggle));
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.ENABLE_THUMBNAIL_CHECKBOXES, lang.hitch(this, this.enableThumbnailToggle));


                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.CLEAR_GRAYED_OUT_RESULTS, lang.hitch(this, this.clearGrayedOutRows));
                    topic.subscribe(VIEWER_GLOBALS.EVENTS.FOOTER.COLLAPSED, lang.hitch(this, this.handleFooterCollapsed));
                    topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.FILTER.ADDED, lang.hitch(this, this.handleFilterAdded));
                    this.clearQueryResultsHandle = topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.RESULT.CLEAR, lang.hitch(this, this.clearGrid));
                    this.setFilterResultsHandle = topic.subscribe(IMAGERY_GLOBALS.EVENTS.QUERY.FILTER.SET, lang.hitch(this, this.handleApplyFilter));
                    this.itemRemovedFromCartHandle = topic.subscribe(IMAGERY_GLOBALS.EVENTS.CART.REMOVED_FROM_CART, lang.hitch(this, this.handleItemRemovedFromCart));
                },
                orderByLockRaster: function(){

                },
                handleShowThumbNailToggle: function (object, checked) {
                    this.inherited(arguments);
                    if (!checked) {
                        var row = this.grid.row(object);
                      //  if (row && row.element && domClass.contains(row.element, "yellowGridRow")) {
                     //       domClass.remove(row.element, "yellowGridRow");
                      //  }
                    }
                },
                clearHighlightedResults: function () {
                    var row;
                    var highlightedItems = this.store.query({isHighlighted: true});
                    for (var i = 0; i < highlightedItems.length; i++) {
                        row = this.grid.row(highlightedItems[i]);
                        console.dir(row);
                        if (row && row.element) {
                            this.grid.unhighlightYellowRow(row);
                            highlightedItems[i].isHighlighted = false;
                        }
                    }
                },
                highlightResultsFromRectangleIntersect: function (envelope) {
                    var scrolledIntoView = false;
                    var unfilteredResults = this.store.query({isGrayedOut: false, isFiltered: false,showFootprint: true});
                    var currentVisibleItem;
                    var currentGeometry;
                    var row;
                    for (var i = 0; i < unfilteredResults.length; i++) {
                        currentVisibleItem = unfilteredResults[i];
                        currentGeometry = currentVisibleItem.geometry;
                        row = this.grid.row(currentVisibleItem);
                        if (envelope.contains(currentGeometry.getExtent())) {
                            if (row && row.element) {
                                this.grid.highlightRowYellow(row);
                                if (!scrolledIntoView) {
                                    var geom = {y: row.element.offsetTop};
                                    console.dir(geom);
                                    this.grid.scrollTo(geom);
                                    scrolledIntoView = true;
                                }
                                currentVisibleItem.isHighlighted = true;
                            }
                        }
                        else {
                            if (row && row.element && domClass.contains(row.element, "yellowGridRow")) {
                                this.grid.unhighlightYellowRow(row);
                                currentVisibleItem.isHighlighted = false;
                            }
                        }
                    }
                },
                highlightResultsFromPointIntersect: function (pt) {
                    var scrolledIntoView = false;
                    var unfilteredResults = this.store.query({isGrayedOut: false, isFiltered: false,showFootprint: true});
                    var currentVisibleItem;
                    var currentGeometry;
                    var row;
                    for (var i = 0; i < unfilteredResults.length; i++) {
                        currentVisibleItem = unfilteredResults[i];
                        currentGeometry = currentVisibleItem.geometry;
                        row = this.grid.row(currentVisibleItem);
                        if (GEOMETRY_UTILS.polygonIntersectsPoint(pt, currentGeometry)) {
                            if (row && row.element) {
                                this.grid.highlightRowYellow(row);
                                if (!scrolledIntoView) {
                                    var geom = {y: row.element.offsetTop};
                                    console.dir(geom);
                                    this.grid.scrollTo(geom);
                                    scrolledIntoView = true;
                                }
                                currentVisibleItem.isHighlighted = true;
                            }
                        }
                        else {
                            if (row && row.element && domClass.contains(row.element, "yellowGridRow")) {
                                this.grid.unhighlightYellowRow(row);
                                currentVisibleItem.isHighlighted = false;
                            }
                        }
                    }
                },
                showCorrespondingImageFromPointIntersect: function (pt) {
                    var scrolledIntoView = false;
                    var unfilteredResults = this.store.query({isGrayedOut: false, isFiltered: false,showFootprint: true});
                    var currentVisibleItem;
                    var currentGeometry;
                    var row;
                    for (var i = 0; i < unfilteredResults.length; i++) {
                        currentVisibleItem = unfilteredResults[i];
                        currentGeometry = currentVisibleItem.geometry;
                        row = this.grid.row(currentVisibleItem);
                        if (GEOMETRY_UTILS.polygonIntersectsPoint(pt, currentGeometry)) {
                            if (row && row.element) {
                                this.grid.highlightRowYellow(row);
                                if (!scrolledIntoView) {
                                    var geom = {y: row.element.offsetTop};
                                    this.grid.scrollTo(geom);
                                    scrolledIntoView = true;
                                }
                                currentVisibleItem.isHighlighted = true;

                                currentVisibleItem.showThumbNail = true;
                                //update the checkbox
                                var showThumbnailInput = query("input[name=showThumbNail]", row.element);
                                var currentCheckDijit = registry.getEnclosingWidget(showThumbnailInput[0]);
                                if (currentCheckDijit) {
                                    currentCheckDijit.set("checked", true);
                                }
                            }
                        }
                        else {
                            if (row && row.element && domClass.contains(row.element, "yellowGridRow")) {
                                this.grid.unhighlightYellowRow(row);
                                currentVisibleItem.isHighlighted = false;
                            }
                        }
                    }
                },
                handleFilterAdded: function (filterWidget) {
                    this.filterWidgetLookup[filterWidget.queryField] = filterWidget;

                    //bind filter to the filter icon
                    filterWidget.on("clearFilterFunction", lang.hitch(this, this.handleSetFilterIconCleared, filterWidget.queryField));
                    filterWidget.on("applyFilterFunction", lang.hitch(this, this.handleSetFilterIconApplied, filterWidget.queryField));
                    filterWidget.on("filterHidden", lang.hitch(this, this.handleHideFilterIcon, filterWidget.queryField));
                    filterWidget.on("filterDisplayed", lang.hitch(this, this.handleShowFilterIcon, filterWidget.queryField));
                },
                clearGrid: function () {
                    this.inherited(arguments);
                    this.hideAllFilterIcons();
                    this.onHideFilterResetIcon();
                    this.responseFeatures = [];
                },
                grayOutRowsByFunction: function (isDisabledFunction) {
                    this.inherited(arguments);
                    //need to hide the filters
                    var currentFilterIcon;
                    for (var key in this.filterIconLookup) {
                        var filterIconForWidget = this.filterIconLookup[key];
                        if (domStyle.get(filterIconForWidget.parentNode, "display") === "block") {
                            domClass.add(filterIconForWidget, "tempDisabledFilterIcon");
                            this.handleHideFilterIcon(key);
                        }
                    }
                    this.onHideFilterResetIcon();
                },
                clearGrayedOutRows: function () {
                    this.inherited(arguments);
                    //show the filters again
                    for (var key in this.filterIconLookup) {
                        var filterIconForWidget = this.filterIconLookup[key];
                        if (domClass.contains(filterIconForWidget, "tempDisabledFilterIcon")) {
                            domClass.remove(filterIconForWidget, "tempDisabledFilterIcon");
                            this.handleShowFilterIcon(key);
                        }
                    }
                    this.onShowFilterResetIcon();
                },
                handleApplyFilter: function (filterFunction) {
                    var filterFunctionInner = function (item) {
                        var match = filterFunction(item);
                        var queryLayerController = IMAGERY_UTILS.getQueryLayerControllerFromItem(item);
                        if (queryLayerController == null) {
                            return;
                        }
                        if (match) {
                            if (item.isFiltered && item.showFootprint) {
                                queryLayerController.showFootprint(item);
                            }
                            item.isFiltered = false;
                        }
                        else {
                            if (item.showFootprint) {
                                queryLayerController.hideFootprint(item);
                            }
                            item.isFiltered = true;
                        }
                        return match;
                    };
                    this.grid.set("query", filterFunctionInner);
                    this.setSelectedThumbnails();
                },
                handleQueryComplete: function () {
                    //send the results to the user applied filter manager
                    this.userAppliedFiltersManager.setFeatures(this.responseFeatures);
                    this.onShowFilterResetIcon();
                },
                //handle new results
                populateQueryResults: function (results, queryLayerController) {
                    if (this.store == null) {
                        this.createNewStore();
                    }
                    this.hideVisibleFilterPopup();
                    //get to the attributes of the results
                    var newItem;
                    var currentAttributes;
                    for (var i = 0; i < results.features.length; i++) {
                        var newItemMixin = {
                            __serviceLabel: queryLayerController.label,
                            queryControllerId: queryLayerController.id,
                            isHighlighted: false,
                            addedToCart: false,
                            geometry: results.features[i].geometry,
                            id: i,
                            isGrayedOut: false,
                            isFiltered: false,
                            showThumbNail: false,
                            showFootprint: false
                        };
                        newItemMixin[this.storeIdField] = VIEWER_UTILS.generateUUID();

                        currentAttributes = results.features[i].attributes;
                        for (var j = 0; j < this.resultFields.length; j++) {
                            if (currentAttributes[this.resultFields[j].field] == null) {
                                currentAttributes[this.resultFields[j].field] = "";
                            }
                        }
                        newItem = lang.mixin(currentAttributes, newItemMixin);
                        this.store.add(newItem);
                    }
                    this.responseFeatures = this.responseFeatures.concat(results.features);
                },

                generateManipulationColumns: function () {
                    var parentColumns = this.inherited(arguments);
                    var columns = [
                        {
                            field: "addedToCart",
                            label: " ",
                            sortable: false,
                            renderCell: lang.hitch(this, this.cartIconFormatter),
                            unhidable: true
                        }

                    ];
                    for (var i = 0; i < parentColumns.length; i++) {
                        columns.push(parentColumns[i]);
                    }
                    return columns;
                },
                generateLayerColumns: function () {
                    var layerColumns = this.inherited(arguments);

                    var i;
                    var currentFilterConfig;
                    var filteredColumns = {};
                    var currentResultField;
                    //find all the filtered fields
                    for (i = 0; i < this.resultFields.length; i++) {
                        currentResultField = this.resultFields[i];
                        if (currentResultField.filter && currentResultField.filter.enable) {
                            filteredColumns[currentResultField.field] = currentResultField.filter;
                        }
                    }

                    //set the header renderer for the filter fields
                    var currentColumn;
                    for (i = 0; i < layerColumns.length; i++) {
                        currentColumn = layerColumns[i];
                        if (filteredColumns[currentColumn.field] != null) {
                            currentColumn.renderHeaderCell = lang.hitch(this, this.renderFilterHeaderColumn, currentColumn)
                        }
                    }
                    return layerColumns;
                },
                cartIconFormatter: function (object, value, node, option) {
                    var iconClass = !value ? "resultGridCartIcon commonIcons16 shoppingCartEmpty" : "resultGridCartIcon  commonIcons16 shoppingCartAdded";
                    var title = !value ? "Add To Cart" : "Remove From Cart";
                    var cartButton = new Button({iconClass: iconClass, title: title});
                    cartButton.on("click", lang.hitch(this, this.handleToggleCartItem, object, cartButton));
                    domClass.add(cartButton.domNode, "queryResultShoppingCartButton");
                    domConstruct.place(cartButton.domNode, node);

                },
                handleToggleCartItem: function (entry, cartButton, e) {
                    if (domClass.contains(cartButton.iconNode, "shoppingCartEmpty")) {
                        this.addCartItem(entry, cartButton);
                    }
                    else {
                        this.removeCartItem(entry, cartButton, true);
                    }
                },
                addCartItem: function (entry, cartButton) {
                    domClass.remove(cartButton.iconNode, "shoppingCartEmpty");
                    domClass.add(cartButton.iconNode, "shoppingCartAdded");
                    entry.addedToCart = true;
                    var clonedCartItem = lang.clone(entry);
                    //show the thumbnail by default
                    clonedCartItem.showThumbNail = true;
                    clonedCartItem.showFootprint = false;
                    clonedCartItem.isFiltered = false;

                    topic.publish(IMAGERY_GLOBALS.EVENTS.CART.ADD_TO, clonedCartItem);
                },
                removeCartItem: function (entry, cartButton, fireRemoveEvent) {
                    if (fireRemoveEvent == null) {
                        fireRemoveEvent = true;
                    }
                    entry.addedToCart = false;
                    if (cartButton) {
                        this._removeAddedToCartIcon(cartButton);
                    }
                    topic.publish(IMAGERY_GLOBALS.EVENTS.CART.REMOVE_FROM_CART, entry[this.storeIdField]);

                },
                _removeAddedToCartIcon: function (cartButton) {
                    domClass.add(cartButton.iconNode, "shoppingCartEmpty");
                    domClass.remove(cartButton.iconNode, "shoppingCartAdded");
                },
                handleItemRemovedFromCart: function (resultId) {
                    var item = this.store.get(resultId);
                    if (item == null) {
                        return;
                    }
                    var row = this.grid.row(item);
                    if (row) {
                        if (row.element) {
                            var cartButton = query(".queryResultShoppingCartButton", row.element);
                            if (cartButton.length > 0) {
                                var cartButtonDijit = registry.getEnclosingWidget(cartButton[0]);
                                if (cartButtonDijit) {
                                    this.removeCartItem(item, cartButtonDijit, false);
                                    return;
                                }
                            }
                        }
                        this.removeCartItem(item, null, false);
                    }
                },
                destroy: function () {
                    if (this.clearQueryResultsHandle) {
                        this.clearQueryResultsHandle.remove();
                        this.clearQueryResultsHandle = null;
                    }
                    if (this.setFilterResultsHandle) {
                        this.setFilterResultsHandle.remove();
                        this.setFilterResultsHandle = null;
                    }
                    if (this.itemRemovedFromCartHandle) {
                        this.itemRemovedFromCartHandle.remove();
                        this.itemRemovedFromCartHandle = null;
                    }


                    this.inherited(arguments);
                },
                renderFilterHeaderColumn: function (currentColumn, node) {
                    var headerLabel = domConstruct.create("span", {className: "resultsGridFilterHeaderLabel", innerHTML: currentColumn.label});
                    var fitlerIconWrapper = domConstruct.create("div", {className: "queryFilterIconWrapper"});
                    var filterIcon = domConstruct.create("div", {className: "commonIcons16 filter filterHidden resultsGridFilterHeaderIcon"});
                    domConstruct.place(filterIcon, fitlerIconWrapper);
                    on(fitlerIconWrapper, "click", lang.hitch(this, this.handleFilterHeaderPopupToggle, currentColumn.field, filterIcon));
                    domConstruct.place(headerLabel, node);
                    domConstruct.place(fitlerIconWrapper, node);
                    this.filterIconLookup[currentColumn.field] = filterIcon;
                    this.handleHideFilterIcon(currentColumn.field);

                },
                handleFilterHeaderPopupToggle: function (fieldName, filterIcon, e) {
                    //don't want to sort
                    e.stopPropagation();
                    if (domClass.contains(filterIcon, "filterHidden")) {

                        this.showFilterPopup(fieldName, filterIcon);
                    }
                    else {
                        this.hideFilterPopup(this.filterPopupLookup[fieldName], filterIcon);
                    }
                },
                hideFilterPopup: function (filterPopup, filterIcon) {
                    if (filterPopup) {
                        domClass.remove(filterIcon, "filterVisible");
                        domClass.add(filterIcon, "filterHidden");
                        dijit.popup.close(filterPopup);

                        //can only have one visible popup
                        this.currentVisibleFilterTooltipObject = null;
                    }
                },
                showFilterPopup: function (fieldName, filterIcon) {
                    domClass.remove(filterIcon, "filterHidden");
                    domClass.add(filterIcon, "filterVisible");
                    if (this.filterPopupLookup[fieldName] == null) {
                        //create the filter tooltip
                        var filterWidget = this.filterWidgetLookup[fieldName];
                        var filterPopupContentWrapper = domConstruct.create("div", {className: "queryFilterPopupContent"});

                        var filterPopupHeaderContent = domConstruct.create("div", {className: "queryFilterPopupContentHeader"});
                        var closeButton = domConstruct.create("div", {title: "Close", className: "filterWidgetPopupCloseIcon windowAction close"});
                        var resetButton = domConstruct.create("div", {title: "Reset Filter", className: "filterWidgetRevertIcon commonIcons16 revertGray"});

                        domConstruct.place(resetButton, filterPopupHeaderContent);
                        domConstruct.place(closeButton, filterPopupHeaderContent);
                        domConstruct.place(filterPopupHeaderContent, filterPopupContentWrapper);
                        domConstruct.place(filterWidget.domNode, filterPopupContentWrapper);

                        var tooltip = new TooltipDialog({ content: filterPopupContentWrapper });
                        this.filterPopupLookup[fieldName] = tooltip;

                        //listen for close
                        on(closeButton, "click", lang.hitch(this, this.hideFilterPopup, tooltip, filterIcon));
                        on(resetButton, "click", lang.hitch(filterWidget, filterWidget.reset));
                    }
                    var filterTooltip = this.filterPopupLookup[fieldName];
                    if (filterTooltip) {
                        dijit.popup.open({
                            popup: filterTooltip,
                            around: filterIcon,
                            orient: ["above"]
                        });
                        //can only have one visible popup
                        this.currentVisibleFilterTooltipObject = {tooltip: filterTooltip, filterIcon: filterIcon};
                    }
                },
                hideAllFilterIcons: function () {
                    for (var key in this.filterIconLookup) {
                        this.handleHideFilterIcon(key);
                    }
                },
                handleHideFilterIcon: function (queryField) {
                    var filterIconForWidget = this.filterIconLookup[queryField];
                    //need to hide the icon wrapper
                    domStyle.set(filterIconForWidget.parentNode, "display", "none");
                },
                handleShowFilterIcon: function (queryField) {
                    var filterIconForWidget = this.filterIconLookup[queryField];
                    //need to show the icon wrapper
                    domStyle.set(filterIconForWidget.parentNode, "display", "block");
                },
                handleSetFilterIconCleared: function (queryField) {
                    var filterIconForWidget = this.filterIconLookup[queryField];
                    domClass.remove(filterIconForWidget, "filterHighlight");
                    domClass.add(filterIconForWidget, "filter");
                },
                handleSetFilterIconApplied: function (queryField) {
                    var filterIconForWidget = this.filterIconLookup[queryField];
                    domClass.remove(filterIconForWidget, "filter");
                    domClass.add(filterIconForWidget, "filterHighlight");
                },
                handleFooterCollapsed: function () {
                    this.hideVisibleFilterPopup();
                    this.clearHighlightedResults();
                },
                hideVisibleFilterPopup: function () {
                    if (this.currentVisibleFilterTooltipObject != null && lang.isObject(this.currentVisibleFilterTooltipObject)) {
                        this.hideFilterPopup(this.currentVisibleFilterTooltipObject.tooltip, this.currentVisibleFilterTooltipObject.filterIcon);
                    }
                },
                //passing this a query object will return the result of the query store
                queryResultSet: function (queryParams) {
                    return this.store.query(queryParams);
                },
                resetAllFilters: function () {
                    this.userAppliedFiltersManager.resetFilters();
                },
                onHideFilterResetIcon: function () {

                },
                onShowFilterResetIcon: function () {

                }
            });
    });