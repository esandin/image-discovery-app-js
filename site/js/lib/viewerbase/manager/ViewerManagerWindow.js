//>>built
define("esriviewer/manager/ViewerManagerWindow",["dojo/_base/declare","dojo/on","dojo/dom-style","dojo/_base/window","dojo/dom-construct","./base/ViewerManager","../ui/identify/IdentifyWindowWidget","../ui/measure/MeasureWindow","../ui/editor/FeatureServiceEditorWindowWidget","../ui/time/TimeSliderWindow","../ui/transparency/LayersTransparencyWindowWidget","../ui/geocode/ReverseGeocodeWindowWidget","../ui/query/QueryBuilderWindowWidget","../ui/draw/DrawWindow","../ui/logging/LoggingWidgetWindow","../ui/layers/LayersWindowWidget","../ui/legend/MapLegendWindow","../ui/zoomto/ZoomToWidgetWindow","../ui/configure/ConfigureViewerWindow","../ui/weather/conditions/WeatherWidgetWindow","../ui/weather/reflectivity/ReflectivityWidgetWindow","../ui/portal/PortalPublisherWindowWidget","../ui/plotting/PlottingWidgetWindow","../ui/print/PrintWidgetWindow","../ui/pointupload/PointUploadWindow","../ui/social/SocialMediaWidgetWindow"],function(_1,on,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19){return _1([_5],{createPlottingWidget:function(){new _16();},createSocialMediaWidget:function(){new _19();},createReflectivityWidget:function(){new _14();},createWeatherWidget:function(){new _13();},createIdentifyWidget:function(){new _6();},createMeasureWidget:function(){new _7();},createFeatureEditorWidget:function(){new _8();},createTimeSliderWidget:function(){new _9();},createLayersTransparencyWidget:function(){new _a();},createConfigureViewerWidget:function(){new _12();},createReverseGeocodeWidget:function(){new _b();},createQueryBuilderWidget:function(){new _c();},createDrawWidget:function(){new _d();},createLoggingWidget:function(){new _e();},createLayersWidget:function(){new _f();},createLegendWidget:function(){new _10();},createZoomToWidget:function(){new _11();},createPortalPublisherWidget:function(){new _15();},createPrintWidget:function(){new _17();},createPointUploadWidget:function(){new _18();},_createHeaderLogo:function(){if(this.viewerConfig.header.small===true){var _1a=_4.create("span",{className:"smallWindowHeaderContainer"});var _1b=_4.create("img",{src:this.viewerConfig.header.headerImage});var _1c=_4.create("span",{innerHTML:this.viewerConfig.header.headerText});_4.place(_1b,_1a);_4.place(_1c,_1a);_4.place(_1a,_3.body());if(this.viewerConfig.header.contact&&this.viewerConfig.header.contact.url){_2.set(_1a,"cursor","pointer");var _1d=this.viewerConfig.header.contact.url;on(_1a,"click",function(){window.open(_1d);});}}else{this.inherited(arguments);}}});});