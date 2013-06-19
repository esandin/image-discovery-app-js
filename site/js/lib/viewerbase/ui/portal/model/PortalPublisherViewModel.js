//>>built
define("esriviewer/ui/portal/model/PortalPublisherViewModel",["dojo/_base/declare","dojo/topic","dojo/_base/lang","dojo/Evented","dojo/topic"],function(_1,_2,_3,_4){return _1([_4],{PUBLISH_WEB_MAP:"publishWebMap",constructor:function(){var _5=this;this.sharingContentVisible=ko.observable(false);this.publishInputsVisible=ko.observable(true);this.userLoggedIn=ko.observable(false);this.noUserLoggedIn=ko.observable(true);this.shareEveryoneChecked=ko.observable(false);this.shareWithGroupsChecked=ko.observable(false);this.portalPublishUrl=ko.observable("");this.userFolders=ko.observableArray();this.userGroups=ko.observableArray();this.selectedUserFolder=ko.observable("");this.webMapName=ko.observable("");this.webMapTags=ko.observable("");this.webMapDescription=ko.observable("");this.handleGroupShareToggle=_3.hitch(this,this._handleGroupShareToggle);},showSharingContent:function(){var _6=this.webMapName();var _7=this.webMapTags();if(_6===null||_6===""){_2.publish(VIEWER_GLOBALS.EVENTS.MESSAGING.SHOW,"You must provide a name for the web map.");}else{if(_7===null||_7===""){_2.publish(VIEWER_GLOBALS.EVENTS.MESSAGING.SHOW,"You must provide a tag for the web map");}else{this.sharingContentVisible(true);this.publishInputsVisible(false);}}},showPublishInputs:function(){this.sharingContentVisible(false);this.publishInputsVisible(true);},setUserLoggedIn:function(){this.userLoggedIn(true);this.noUserLoggedIn(false);},setNoUserLoggedIn:function(){this.userLoggedIn(false);this.noUserLoggedIn(true);this.showPublishInputs();},logPortalUserOut:function(){_2.publish(VIEWER_GLOBALS.EVENTS.PORTAL.LOG_OUT);},logPortalUserIn:function(){_2.publish(VIEWER_GLOBALS.EVENTS.PORTAL.LOG_IN);},_handleGroupShareToggle:function(_8){_8.selected=!_8.selected;if(_8.selected){this.shareEveryoneChecked(false);this.shareWithGroupsChecked(true);}return true;},publishWebMap:function(){this.emit(this.PUBLISH_WEB_MAP);}});});