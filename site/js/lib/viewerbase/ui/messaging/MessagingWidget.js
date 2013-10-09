//>>built
require({cache:{"url:esriviewer/ui/messaging/template/MessagingWidgetTemplate.html":"<div class=\"defaultBorder defaultBackground statusMessageContainer threePixelBorderRadius defaultBoxShadow\"\r\n     data-bind=\"visible:visible\">\r\n    <div class=\"commonIcons16 infoBlock messagingIcon\"></div>\r\n    <div class=\"statusDivInner threePixelBorderRadius\">\r\n        <div class=\"statusDivMessage\" data-bind=\"text:message\"></div>\r\n    </div>\r\n</div>"}});define("esriviewer/ui/messaging/MessagingWidget",["dojo/_base/declare","dojo/text!./template/MessagingWidgetTemplate.html","dojo/topic","dojo/_base/lang","../base/UITemplatedWidget","dojox/timing","./model/MessagingWidgetViewModel"],function(_1,_2,_3,_4,_5,_6,_7){return _1([_5],{templateString:_2,defaultTimerInterval:4000,isPositionedByConfig:true,defaultPositioning:{x:375,y:50},positioningParamName:"messaging",postCreate:function(){this.inherited(arguments);this.viewModel=new _7();ko.applyBindings(this.viewModel,this.domNode);this.messageTimer=new dojox.timing.Timer(this.defaultTimerInterval);this.messageTimer.onTick=_4.hitch(this,this.hideMessage);this.hideMessage();},initListeners:function(){this.inherited(arguments);_3.subscribe(VIEWER_GLOBALS.EVENTS.MESSAGING.SHOW,_4.hitch(this,this.showMessage));_3.subscribe(VIEWER_GLOBALS.EVENTS.MESSAGING.HIDE,_4.hitch(this,this.hideMessage));},showMessage:function(_8,_9){this.viewModel.showMessage(_8);_9=(_9==null)?this.defaultTimerInterval:_9;this.messageTimer.setInterval(_9);this.messageTimer.start();},hideMessage:function(){if(this.messageTimer){this.messageTimer.stop();}this.viewModel.hideMessage();}});});