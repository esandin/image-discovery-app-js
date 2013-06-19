//>>built
define("esriviewer/ui/identify/model/IdentifyWidgetViewModel",["dojo/_base/declare","dojo/Evented","dojo/_base/lang","esri/layers/ArcGISDynamicMapServiceLayer","esri/layers/ArcGISImageServiceLayer","esri/layers/ArcGISTiledMapServiceLayer"],function(_1,_2,_3,_4,_5,_6){return _1([_2],{CLEAR_RESULTS:"clearResults",constructor:function(){var _7=this;this.identifyQueryVisible=ko.observable(true);this.identifyResultsVisible=ko.observable(false);this.serviceValuesCache={};this.services=ko.observableArray();this.layers=ko.observableArray();this.selectedService=ko.observable("");this.selectedLayer=ko.observable("");this.drawActive=ko.observable(false);this.showDrawContainer=ko.observable(false);this.showTabContainer=ko.observable(false);this.currentServiceIsMapService=ko.observable(false);this.showClearResults=ko.observable(false);this.selectedService.subscribe(_3.hitch(this,this.handleServiceChanged));},clearResults:function(){this.showQuery();this.showTabContainer(false);this.showClearResults(false);this.emit(this.CLEAR_RESULTS);},showResults:function(){if(!this.showTabContainer()){this.showTabContainer(true);}this.identifyQueryVisible(false);this.identifyResultsVisible(true);},showQuery:function(){this.identifyQueryVisible(true);this.identifyResultsVisible(false);},toggleDrawActive:function(){this.drawActive(!this.drawActive());},serviceExists:function(_8){if(_8==null){return true;}var _9=_8.toLocaleLowerCase();var _a=this.services();var _b;for(var i=0;i<_a.length;i++){_b=_a[i].value;var _c=_b.url.toLowerCase();if(_c==_9){return true;}}return false;},removeService:function(_d){if(_d==null){return;}var _e=_d.toLocaleLowerCase();var _f=this.services();var _10;for(var i=0;i<_f.length;i++){_10=_f[i].value;var _11=_10.url.toLowerCase();if(_11==_e){this.services.remove(_f[i]);return;}}},handleServiceChanged:function(_12){this.layers.removeAll();if(_12==null||_12==""){this.showDrawContainer(false);this.currentServiceIsMapService(false);}else{var _13=false;var i;var _14=_12.url.toLowerCase();if(this.serviceValuesCache[_14]!=null){var _15=this.serviceValuesCache[_14];if(_12 instanceof _4){this.currentServiceIsMapService(true);_13=(_15.length>0);for(i=0;i<_15.length;i++){this.layers.push(_15[i]);}}else{if(_12 instanceof _5){this.currentServiceIsMapService(false);_13=true;}}}else{var _16=[];var _17;this.serviceValuesCache[_14]=_16;if(_12 instanceof _4){this.currentServiceIsMapService(true);_13=(_12.layerInfos.length>0);for(i=0;i<_12.layerInfos.length;i++){var _18=_12.layerInfos[i];if(_18.subLayerIds!=null){continue;}_17={label:_18.name,value:_18.id};_16.push(_17);this.layers.push(_17);}}else{if(_12 instanceof _5){this.currentServiceIsMapService(false);_13=true;}}}this.showDrawContainer(_13);}}});});