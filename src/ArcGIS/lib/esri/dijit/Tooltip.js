//>>built
require({cache:{"url:./templates/Tooltip.html":'\x3cdiv class\x3d"dijitTooltip dijitTooltipLeft" id\x3d"dojoTooltip" data-dojo-attach-event\x3d"mouseenter:onMouseEnter,mouseleave:onMouseLeave"\r\n\t\x3e\x3cdiv class\x3d"dijitTooltipConnector" data-dojo-attach-point\x3d"connectorNode"\x3e\x3c/div\r\n\t\x3e\x3cdiv class\x3d"dijitTooltipContainer dijitTooltipContents" data-dojo-attach-point\x3d"containerNode" role\x3d\'alert\'\x3e\x3c/div\r\n\x3e\x3c/div\x3e\r\n'}});
define("esri/dijit/Tooltip","dojo/_base/array dojo/_base/declare dojo/_base/fx dojo/dom dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/_base/lang dojo/mouse dojo/on dojo/sniff ./_base/manager ./place ./_Widget ./_TemplatedMixin ./BackgroundIframe dojo/text!./templates/Tooltip.html ./main".split(" "),function(b,t,u,v,z,p,A,d,w,h,n,B,C,x,D,E,F,m){function q(){}var r=t("dijit._MasterTooltip",[x,D],{duration:B.defaultDuration,templateString:F,postCreate:function(){this.ownerDocumentBody.appendChild(this.domNode);
this.bgIframe=new E(this.domNode);this.fadeIn=u.fadeIn({node:this.domNode,duration:this.duration,onEnd:d.hitch(this,"_onShow")});this.fadeOut=u.fadeOut({node:this.domNode,duration:this.duration,onEnd:d.hitch(this,"_onHide")})},show:function(a,e,f,g,y,b,G){if(!this.aroundNode||this.aroundNode!==e||this.containerNode.innerHTML!=a)if("playing"==this.fadeOut.status())this._onDeck=arguments;else{this.containerNode.innerHTML=a;y&&this.set("textDir",y);this.containerNode.align=g?"right":"left";var k=C.around(this.domNode,
e,f&&f.length?f:c.defaultPosition,!g,d.hitch(this,"orient")),l=k.aroundNodePos;"M"==k.corner.charAt(0)&&"M"==k.aroundCorner.charAt(0)?(this.connectorNode.style.top=l.y+(l.h-this.connectorNode.offsetHeight>>1)-k.y+"px",this.connectorNode.style.left=""):"M"==k.corner.charAt(1)&&"M"==k.aroundCorner.charAt(1)?this.connectorNode.style.left=l.x+(l.w-this.connectorNode.offsetWidth>>1)-k.x+"px":(this.connectorNode.style.left="",this.connectorNode.style.top="");A.set(this.domNode,"opacity",0);this.fadeIn.play();
this.isShowingNow=!0;this.aroundNode=e;this.onMouseEnter=b||q;this.onMouseLeave=G||q}},orient:function(a,e,f,g,b){this.connectorNode.style.top="";var c=g.h;g=g.w;a.className="dijitTooltip "+{"MR-ML":"dijitTooltipRight","ML-MR":"dijitTooltipLeft","TM-BM":"dijitTooltipAbove","BM-TM":"dijitTooltipBelow","BL-TL":"dijitTooltipBelow dijitTooltipABLeft","TL-BL":"dijitTooltipAbove dijitTooltipABLeft","BR-TR":"dijitTooltipBelow dijitTooltipABRight","TR-BR":"dijitTooltipAbove dijitTooltipABRight","BR-BL":"dijitTooltipRight",
"BL-BR":"dijitTooltipLeft"}[e+"-"+f];this.domNode.style.width="auto";var d=p.position(this.domNode);if(n("ie")||n("trident"))d.w+=2;p.setMarginBox(this.domNode,{w:Math.min(Math.max(g,1),d.w)});"B"==f.charAt(0)&&"B"==e.charAt(0)?(a=p.position(a),e=this.connectorNode.offsetHeight,a.h>c?(this.connectorNode.style.top=c-(b.h+e>>1)+"px",this.connectorNode.style.bottom=""):(this.connectorNode.style.bottom=Math.min(Math.max(b.h/2-e/2,0),a.h-e)+"px",this.connectorNode.style.top="")):(this.connectorNode.style.top=
"",this.connectorNode.style.bottom="");return Math.max(0,d.w-g)},_onShow:function(){n("ie")&&(this.domNode.style.filter="")},hide:function(a){this._onDeck&&this._onDeck[1]==a?this._onDeck=null:this.aroundNode===a&&(this.fadeIn.stop(),this.isShowingNow=!1,this.aroundNode=null,this.fadeOut.play());this.onMouseEnter=this.onMouseLeave=q},_onHide:function(){this.domNode.style.cssText="";this.containerNode.innerHTML="";this._onDeck&&(this.show.apply(this,this._onDeck),this._onDeck=null)}});n("dojo-bidi")&&
r.extend({_setAutoTextDir:function(a){this.applyTextDir(a);b.forEach(a.children,function(a){this._setAutoTextDir(a)},this)},_setTextDirAttr:function(a){this._set("textDir",a);"auto"==a?this._setAutoTextDir(this.containerNode):this.containerNode.dir=this.textDir}});m.showTooltip=function(a,e,f,g,d,l,h){f&&(f=b.map(f,function(a){return{after:"after-centered",before:"before-centered"}[a]||a}));c._masterTT||(m._masterTT=c._masterTT=new r);return c._masterTT.show(a,e,f,g,d,l,h)};m.hideTooltip=function(a){return c._masterTT&&
c._masterTT.hide(a)};var c=t("esri.dijit.Tooltip",x,{label:"",showDelay:400,hideDelay:400,connectId:[],position:[],selector:"",_setConnectIdAttr:function(a){b.forEach(this._connections||[],function(a){b.forEach(a,function(a){a.remove()})},this);this._connectIds=b.filter(d.isArrayLike(a)?a:a?[a]:[],function(a){return v.byId(a,this.ownerDocument)},this);this._connections=b.map(this._connectIds,function(a){a=v.byId(a,this.ownerDocument);var e=this.selector,b=e?function(a){return h.selector(e,a)}:function(a){return a},
c=this;return[h(a,b(w.enter),function(){c._onHover(this)}),h(a,b("focusin"),function(){c._onHover(this)}),h(a,b(w.leave),d.hitch(c,"_onUnHover")),h(a,b("focusout"),d.hitch(c,"set","state","DORMANT"))]},this);this._set("connectId",a)},addTarget:function(a){a=a.id||a;-1==b.indexOf(this._connectIds,a)&&this.set("connectId",this._connectIds.concat(a))},removeTarget:function(a){a=b.indexOf(this._connectIds,a.id||a);0<=a&&(this._connectIds.splice(a,1),this.set("connectId",this._connectIds))},buildRendering:function(){this.inherited(arguments);
z.add(this.domNode,"dijitTooltipData")},startup:function(){this.inherited(arguments);var a=this.connectId;b.forEach(d.isArrayLike(a)?a:[a],this.addTarget,this)},getContent:function(a){return this.label||this.domNode.innerHTML},state:"DORMANT",_setStateAttr:function(a){if(!(this.state==a||"SHOW TIMER"==a&&"SHOWING"==this.state||"HIDE TIMER"==a&&"DORMANT"==this.state)){this._hideTimer&&(this._hideTimer.remove(),delete this._hideTimer);this._showTimer&&(this._showTimer.remove(),delete this._showTimer);
switch(a){case "DORMANT":this._connectNode&&(c.hide(this._connectNode),delete this._connectNode,this.onHide());break;case "SHOW TIMER":"SHOWING"!=this.state&&(this._showTimer=this.defer(function(){this.set("state","SHOWING")},this.showDelay));break;case "SHOWING":var b=this.getContent(this._connectNode);if(!b){this.set("state","DORMANT");return}c.show(b,this._connectNode,this.position,!this.isLeftToRight(),this.textDir,d.hitch(this,"set","state","SHOWING"),d.hitch(this,"set","state","HIDE TIMER"));
this.onShow(this._connectNode,this.position);break;case "HIDE TIMER":this._hideTimer=this.defer(function(){this.set("state","DORMANT")},this.hideDelay)}this._set("state",a)}},_onHover:function(a){this._connectNode&&a!=this._connectNode&&this.set("state","DORMANT");this._connectNode=a;this.set("state","SHOW TIMER")},_onUnHover:function(a){this.set("state","HIDE TIMER")},open:function(a){this.set("state","DORMANT");this._connectNode=a;this.set("state","SHOWING")},close:function(){this.set("state","DORMANT")},
onShow:function(){},onHide:function(){},destroy:function(){this.set("state","DORMANT");b.forEach(this._connections||[],function(a){b.forEach(a,function(a){a.remove()})},this);this.inherited(arguments)}});c._MasterTooltip=r;c.show=m.showTooltip;c.hide=m.hideTooltip;c.defaultPosition=["after-centered","before-centered"];return c});