//>>built
require({cache:{"url:esriviewer/ui/time/template/TimeSliderContentTemplate.html":"<div>\r\n    <div class=\"timeSliderContentDisabled\" data-bind=\"visible: isDisabled, text:disabledTimeSliderText\"></div>\r\n    <div class=\"timeSliderContent\" data-bind=\"visible: isEnabled\">\r\n        <div class=\"timeSliderCurrentValuesAndActionsContainer\">\r\n            <div data-bind=\"visible: timeSliderCurrentValueVisible, css:{timeSliderDayOnlyMode: dayOnlyMode}\"\r\n                 class=\"timeSliderCurrentValueDisplay\">\r\n                <div class=\"timeSliderCurrentValueLabel\">Displaying ${featureTypeLabel} From:</div>\r\n                <div class=\"timeSliderCurrentValueValues\">\r\n                    <span data-bind=\"text: currentTimeStartValue\"></span>\r\n                    <span class=\"timeSliderCurrentValueValuesSeperator\"> - </span>\r\n                    <span data-bind=\"text: currentTimeEndValue\"></span>\r\n                </div>\r\n            </div>\r\n            <div class=\"timeSliderLayerActions\" data-bind=\"visible:timeSliderLayerActionsVisible\">\r\n                <div class=\"commonIcons16 locationGoTo\" title=\"Zoom To Layer Extent\"\r\n                     data-bind=\"visible:zoomToLayerVisible\"\r\n                     data-dojo-attach-event=\"onclick:handleZoomToLayerExtent\"></div>\r\n            </div>\r\n        </div>\r\n        <div class=\"timeSliderUseRangeContainer\">\r\n            <span class=\"timeSliderUseRangeLabel\" data-bind=\"text:useRangeLabel\"></span>\r\n            <input type=\"checkbox\" data-bind=\"checked: useRangeSlider\"/>\r\n        </div>\r\n        <div class=\"timeSliderInputsContainer\">\r\n                <span class=\"timeSliderRangeBreaksContainer\">\r\n                    <span class=\"timeSliderRangeBreaksLabel\" data-bind=\"text:intervalsLabel\"></span>\r\n                    <select data-bind=\"options: intervals ,value:selectedInterval\">\r\n                    </select>\r\n                    <select data-bind=\"options: unitValue ,value:selectedUnits, optionsText: 'label', optionsValue: 'value'\">\r\n                    </select>\r\n                </span>\r\n\r\n            <div class=\"timeSlidersLayerSelectContainer\" data-bind=\"visible: layersSelectContainerVisible\">\r\n\r\n                <select data-bind=\"options: layers ,value:selectedLayer, optionsText: 'label', optionsValue: 'value', optionsCaption: 'Select A Layer...'\">\r\n\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"timeSlidersContainer\" data-dojo-attach-point=\"timeSlidersContainer\"\r\n             data-bind=\"visible: timeSliderVisible\">\r\n        </div>\r\n    </div>\r\n</div>\r\n"}});define("esriviewer/ui/time/TimeSliderWidget",["dojo/_base/declare","dojo/text!./template/TimeSliderContentTemplate.html","dojo/topic","dojo/_base/lang","dojo/dom-attr","dojo/dom-style","dojo/dom-class","dojo/dom-construct","../base/UITemplatedWidget","./model/TimeSliderWidgetViewModel","esri/dijit/TimeSlider","esri/layers/TimeInfo","esri/geometry/Extent"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){return _1([_9],{bindingsApplied:false,playButtonClassName:"tsPlayButton",maxLayerNameLength:47,templateString:_2,featureTypeLabel:"Features",constructor:function(){this.timeSliderLayerLookup={};},postCreate:function(){this.inherited(arguments);this.createViewModel();this._loadTimeEnabledServices();},createViewModel:function(){this.viewModel=new _a();this.applyBindings();},applyBindings:function(){if(!this.bindingsApplied){this.viewModel.useRangeSlider.subscribe(_4.hitch(this,this.handleReloadSliders));this.viewModel.selectedInterval.subscribe(_4.hitch(this,this.handleReloadSliders));this.viewModel.selectedLayer.subscribe(_4.hitch(this,this.handleTimeSliderLayerChanged));ko.applyBindings(this.viewModel,this.domNode);this.bindingsApplied=true;this.viewModel.selectedUnits.subscribe(_4.hitch(this.viewModel,this.viewModel.handleSelectedUnitsChanged));}},initListeners:function(){_3.subscribe(VIEWER_GLOBALS.EVENTS.MAP.TIME.TIME_LAYER_FOUND,_4.hitch(this,this.processTimeEnabledService));},_loadTimeEnabledServices:function(){_3.publish(VIEWER_GLOBALS.EVENTS.MAP.TIME.GET_TIME_ENABLED_SERVICES,_4.hitch(this,this._setLoadedTimeEnabledService));},_setLoadedTimeEnabledService:function(_e){if(_4.isArray(_e)){for(var i=0;i<_e.length;i++){this.processTimeEnabledService(_e[i]);}}},processTimeEnabledService:function(_f){if(_f){if(_4.isArray(_f.layerInfos)){for(var i=0;i<_f.layerInfos.length;i++){var _10=_f.layerInfos[i];var _11=_10.id;var _12=_4.hitch(this,_4.hitch(this,this.addTimeEnabledLayerFromServiceDescription,_f));VIEWER_UTILS.getLayerInfoFromService(_f.url,_11,_12);}}else{this.addTimeEnabledLayer(_f);}}},addTimeEnabledLayer:function(_13){var id=_13.url.toLowerCase();if(this.timeSliderLayerLookup[id]!=null){return;}var _14=_13.timeInfo;if(_14 instanceof _c){var _15=new _d(_13.extent);this.timeSliderLayerLookup[id]={timeInfo:_14,name:_13.name,extent:_15};this.timeSliderLayerLookup[id]={timeInfo:_14,name:_13.name,extent:_15};var _16=_13.name;if(_16.length>this.maxLayerNameLength){var _17=_16.substring(0,(this.maxLayerNameLength-3));_16=_17+"...";}var _18={label:_16,value:id};this.viewModel.layers.push(_18);}else{VIEWER_UTILS.log("Layer was published as time enabled but does not have time info: "+_13.name,VIEWER_GLOBALS.LOG_TYPE.WARNING);}},addTimeEnabledLayerFromServiceDescription:function(_19,_1a){var _1b=VIEWER_UTILS.getLayerUniqueId(_19);var id=_1b+"_"+_1a.name.toLowerCase();if(this.timeSliderLayerLookup[id]!=null){return;}if(_1a&&_1a.timeInfo){var _1c=_1a.timeInfo;if(_4.isArray(_1c.timeExtent)&&_1c.timeExtent.length===2){var _1d=_1c.timeExtent[0];var _1e=_1c.timeExtent[1];if(!((_1d<0||_1e<0)||(_1e===_1d))){var _1f=new _c(_1c);var _20=new _d(_1a.extent);this.timeSliderLayerLookup[id]={timeInfo:_1f,name:_1a.name,extent:_20};var _21=_1a.name;if(_21.length>this.maxLayerNameLength){var _22=_21.substring(0,(this.maxLayerNameLength-3));_21=_22+"...";}var _23={label:_21,value:id};this.viewModel.layers.push(_23);}}}},handleReloadSliders:function(){var _24=this.viewModel.selectedLayer();if(_24!=null){var _25=this.timeSliderLayerLookup[_24];if(_25){this.createTimeSlider(_25);}}},handleTimeSliderLayerChanged:function(_26){if(_26==null){this.viewModel.timeSliderVisible(false);this.viewModel.timeSliderCurrentValueVisible(false);this.viewModel.zoomToLayerVisible(false);this.disableMapSlider();}else{var _27=this.timeSliderLayerLookup[_26];if(_27!=null){this.viewModel.disabled(false);this.viewModel.timeSliderVisible(true);this.viewModel.timeSliderCurrentValueVisible(true);this.viewModel.zoomToLayerVisible(true);this.createTimeSlider(_27);}}},disableMapSlider:function(){_3.publish(VIEWER_GLOBALS.EVENTS.MAP.TIME.CLEAR_TIME_EXTENT);},createTimeSlider:function(_28){var _29=this.viewModel.selectedInterval();if(_29==null){return;}if(_28){if(this.currentTimeSlider){this.currentTimeSlider.destroy();}this.currentTimeSlider=null;var _2a=_28.timeInfo.timeExtent;var _2b=_8.create("div");_8.place(_2b,this.timeSlidersContainer);this.currentTimeSlider=new _b({},_2b);this.currentTimeSlider._createHorizRule=function(){return;};this.currentTimeSlider.on("timeExtentChange",_4.hitch(this,this.onTimeExtentChange));_6.set(this.currentTimeSlider.domNode,"color","white");this.currentTimeSlider.setThumbCount(this.viewModel.useRangeSlider()?2:1);var _2c=this.viewModel.selectedUnits();var _2d=_2c.units;if(_2d==null||_2d==""){this.currentTimeSlider.createTimeStopsByCount(_2a,_29);}else{this.currentTimeSlider.createTimeStopsByTimeInterval(_2a,_29,_2d);}_28.sliderWidget=this.currentTimeSlider;this.currentTimeSlider.startup();_3.publish(VIEWER_GLOBALS.EVENTS.MAP.TIME.SET_MAP_TIME_SLIDER,this.currentTimeSlider);}},onTimeExtentChange:function(_2e){if(_2e==null){return;}_3.publish(VIEWER_GLOBALS.EVENTS.MAP.TIME.MAP_TIME_CHANGED,_2e);var _2f=(_2e.startTime.getUTCMonth()+1);var _30=_2e.startTime.getUTCDate();var _31=_2e.startTime.getFullYear();var _32=_2e.startTime.getUTCHours();var _33=_2e.startTime.getUTCMinutes();var _34=_2e.startTime.getUTCSeconds();if(_2f<10){_2f="0"+_2f;}if(_30<10){_30="0"+_30;}if(_32<10){_32="0"+_32;}if(_33<10){_33="0"+_33;}if(_34<10){_34="0"+_34;}var _35;if(this.viewModel.dayOnlyMode()){_35=_30+"-"+_2f+"-"+_31;}else{_35=_30+"-"+_2f+"-"+_31+" "+_32+":"+_33+":"+_34;}var _36=(_2e.endTime.getUTCMonth()+1);var _37=_2e.endTime.getUTCDate();var _38=_2e.endTime.getFullYear();var _39=_2e.endTime.getUTCHours();var _3a=_2e.endTime.getUTCMinutes();var _3b=_2e.endTime.getUTCSeconds();if(_36<10){_36="0"+_36;}if(_37<10){_37="0"+_37;}if(_39<10){_39="0"+_39;}if(_3a<10){_3a="0"+_3a;}if(_3b<10){_3b="0"+_3b;}var _3c;if(this.viewModel.dayOnlyMode()){_3c=_37+"-"+_36+"-"+_38;}else{_3c=_37+"-"+_36+"-"+_38+" "+_39+":"+_3a+":"+_3b;}this.viewModel.currentTimeStartValue(_35);this.viewModel.currentTimeEndValue(_3c);},handleZoomToLayerExtent:function(){var _3d=this.viewModel.selectedLayer();if(_3d!=null){var _3e=this.timeSliderLayerLookup[_3d];if(_3e){_3.publish(VIEWER_GLOBALS.EVENTS.MAP.EXTENT.SET_EXTENT,_3e.extent);}}},clearTimeSlider:function(){this.viewModel.selectedLayer(null);}});});