//>>built
require({cache:{"url:esriviewer/ui/throbber/template/ThrobberTemplate.html":"<div class=\"loadingThrobber\"\r\n     style=\"display:none\">\r\n    <div class=\"loadingThrobberInner\">\r\n        <div class=\"loadingIcon\"></div>\r\n    </div>\r\n</div>"}});define("esriviewer/ui/throbber/ThrobberWidget",["dojo/_base/declare","dojo/text!./template/ThrobberTemplate.html","dojo/topic","../base/UITemplatedWidget","dojo/_base/lang","dojo/request/notify"],function(_1,_2,_3,_4,_5,_6){return _1([_4],{enabled:true,blockHideEnabled:false,defaultPositioning:{x:10,y:10,alignX:"left",alignY:"bottom"},positioningParamName:"throbber",isPositionedByConfig:true,templateString:_2,postCreate:function(){this.inherited(arguments);_6("start",_5.hitch(this,this.show));_6("done",_5.hitch(this,this.hide));},initListeners:function(){this.inherited(arguments);_3.subscribe(VIEWER_GLOBALS.EVENTS.THROBBER.DISABLE,_5.hitch(this,this.disable));_3.subscribe(VIEWER_GLOBALS.EVENTS.THROBBER.ENABLE,_5.hitch(this,this.enable));_3.subscribe(VIEWER_GLOBALS.EVENTS.THROBBER.SHOW,_5.hitch(this,this.show));_3.subscribe(VIEWER_GLOBALS.EVENTS.THROBBER.HIDE,_5.hitch(this,this.hide));_3.subscribe(VIEWER_GLOBALS.EVENTS.THROBBER.BLOCK_HIDE,_5.hitch(this,this._blockHide));_3.subscribe(VIEWER_GLOBALS.EVENTS.THROBBER.RELEASE_HIDE_BLOCK,_5.hitch(this,this._releaseHideBlock));},show:function(){if(this.enabled){this.inherited(arguments);}},_blockHide:function(){this.blockHideEnabled=true;},_releaseHideBlock:function(){this.blockHideEnabled=false;this.hide();},hide:function(){if(!this.blockHideEnabled){this.inherited(arguments);}},disable:function(){this.enabled=false;},enable:function(){this.enabled=true;}});});