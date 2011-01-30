/*
 * JQuery zTree 2.4
 * http://code.google.com/p/jquerytree/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Date: 2011-02-10
 *
 */
(function(f){function lb(a,b){b.unbind(ka);b.bind(ka,function(c,d,e){typeof a.callback.nodeCreated=="function"&&a.callback.nodeCreated(c,d,e)});b.unbind(la);b.bind(la,function(c,d,e){typeof a.callback.click=="function"&&a.callback.click(c,d,e)});b.unbind(ma);b.bind(ma,function(c,d,e){typeof a.callback.change=="function"&&a.callback.change(c,d,e)});b.unbind(Z);b.bind(Z,function(c,d,e){typeof a.callback.rename=="function"&&a.callback.rename(c,d,e)});b.unbind(na);b.bind(na,function(c,d,e){typeof a.callback.remove==
"function"&&a.callback.remove(c,d,e)});b.unbind(oa);b.bind(oa,function(c,d,e){typeof a.callback.drag=="function"&&a.callback.drag(c,d,e)});b.unbind($);b.bind($,function(c,d,e,g,h){typeof a.callback.drop=="function"&&a.callback.drop(c,d,e,g,h)});b.unbind(pa);b.bind(pa,function(c,d,e){typeof a.callback.expand=="function"&&a.callback.expand(c,d,e)});b.unbind(qa);b.bind(qa,function(c,d,e){typeof a.callback.collapse=="function"&&a.callback.collapse(c,d,e)});b.unbind(ra);b.bind(ra,function(c,d,e,g){typeof a.callback.asyncSuccess==
"function"&&a.callback.asyncSuccess(c,d,e,g)});b.unbind(sa);b.bind(sa,function(c,d,e,g,h,k){typeof a.callback.asyncError=="function"&&a.callback.asyncError(c,d,e,g,h,k)});a.treeObj.bind("contextmenu",function(c){var d=f(c.target);d=ta(a,d);var e=true;if(typeof a.callback.beforeRightClick=="function")e=a.callback.beforeRightClick(a.treeObjId,d);if(e&&typeof a.callback.rightClick=="function"){a.callback.rightClick(c,a.treeObjId,d);return false}return typeof a.callback.rightClick!="function"});a.treeObj.bind("mouseup",
function(c){var d=f(c.target);d=ta(a,d);var e=true;if(typeof a.callback.beforeMouseUp=="function")e=a.callback.beforeMouseUp(a.treeObjId,d);e&&typeof a.callback.mouseUp=="function"&&a.callback.mouseUp(c,a.treeObjId,d);return true});a.treeObj.bind("mousedown",function(c){var d=f(c.target);d=ta(a,d);var e=true;if(typeof a.callback.beforeMouseDown=="function")e=a.callback.beforeMouseDown(a.treeObjId,d);e&&typeof a.callback.mouseDown=="function"&&a.callback.mouseDown(c,a.treeObjId,d);return true})}function ta(a,
b){var c;c=f(b);if(c.attr("id")==a.treeObjId)c=null;else{for(;!c.is("li")&&c.attr("id")!=a.treeObjId;)c=c.parent();c=c.attr("id");c=aa(a,c)}return c}function T(a,b,c,d){if(c)for(var e=0;e<c.length;e++){var g=c[e];g.level=b;g.tId=a.treeObjId+"_"+ ++ua;g.parentNode=d;g[a.checkedCol]=g[a.checkedCol]==true;g.checkedOld=g[a.checkedCol];g.check_Focus=false;g.check_True_Full=true;g.check_False_Full=true;g.editNameStatus=false;g.isFirstNode=(d?d:a.root)[a.nodesCol].length==c.length&&e==0;g.isLastNode=e==
c.length-1;if(g[a.nodesCol]&&g[a.nodesCol].length>0){g.open=g.open?true:false;g.isParent=true;Sa(a,g);T(a,b+1,g[a.nodesCol],g)}else{g.isParent=g.isParent?true:false;Sa(a,g);a.checkable&&e==c.length-1&&ba(a,g)}}}function Sa(a,b){var c=b.parentNode;c=c?f("#"+b.parentNode.tId+u):a.treeObj;c.append("<li id='"+b.tId+"' class='tree-node'><button type=\"button\" id='"+b.tId+w+"' title='' onfocus='this.blur();'></button><a id='"+b.tId+n+"' onclick=\""+(b.click||"")+'" ><button type="button" id=\''+b.tId+
r+"' title='' onfocus='this.blur();'></button><span id='"+b.tId+K+"'></span></a><ul id='"+b.tId+u+"'></ul></li>");c=f("#"+b.tId+w);var d=f("#"+b.tId+n);f("#"+b.tId+K);var e=f("#"+b.tId+u),g=f("#"+b.tId+r);Ta(a,b);I(a,b);Ua(a,b);e.css({display:b.open?"block":"none"});if(b.isParent){c.bind("click",{treeObjId:a.treeObjId,treeNode:b},ca);d.bind("dblclick",{treeObjId:a.treeObjId,treeNode:b},ca)}d.bind("click",function(){var k=true;if(typeof a.callback.beforeClick=="function")k=a.callback.beforeClick(a.treeObjId,
b);if(k!=false){window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();L(a,b);a.treeObj.trigger(la,[a.treeObjId,b])}});g.bind("mousedown",function(){b.editNameStatus=false});if(a.checkable){c.after("<BUTTON type='BUTTON' ID='"+b.tId+F+"' onfocus='this.blur();' ></BUTTON>");var h=f("#"+b.tId+F);if(a.checkStyle==P&&a.checkRadioType==va&&b[a.checkedCol])a.checkRadioCheckedList=a.checkRadioCheckedList.concat([b]);A(a,h,b);h.bind("click",function(){var k=true;if(typeof a.callback.beforeChange==
"function")k=a.callback.beforeChange(a.treeObjId,b);if(k!=false){b[a.checkedCol]=!b[a.checkedCol];wa(a,b);A(a,h,b);Q(a,b);a.treeObj.trigger(ma,[a.treeObjId,b])}});h.bind("mouseover",function(){b.checkboxFocus=true;A(a,h,b)});h.bind("mouseout",function(){b.checkboxFocus=false;A(a,h,b)})}Va(b);Wa(a,b);d.hover(function(){Xa(a,b)},function(){a.curTreeNode!=b&&da(a,b)});d.bind("mousedown",function(k){if(!(k.button==2||!a.editable)){var q=document,p,m,j,s=false,i=a,R=null,M=null,t=null,v=x,mb=k.clientX,
nb=k.clientY,Ya=(new Date).getTime();f(q).mousemove(function(l){if(b.editNameStatus)return true;window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();if(a.dragStatus==0&&Math.abs(mb-l.clientX)<Za&&Math.abs(nb-l.clientY)<Za)return true;f("body").css("cursor","pointer");f("#"+b.tId+w);if(a.dragStatus==0&&b.isParent&&b.open){G(a,b,!b.open);a.dragNodeShowBefore=true}if(a.dragStatus==0){a.dragStatus=-1;var o=true;if(typeof a.callback.beforeDrag=="function")o=a.callback.beforeDrag(a.treeObjId,
b);if(o==false)return;a.dragStatus=1;$a(true);L(a,b);da(a,b);o=f("#"+b.tId).clone();o.attr("id",b.tId+"_tmp");o.css("padding","0");o.children("#"+b.tId+n).removeClass(xa);o.children("#"+b.tId+u).css("display","none");p=f("<ul class='zTreeDragUL'></ul>").append(o);p.attr("id",b.tId+u+"_tmp");p.addClass(a.treeObj.attr("class"));p.appendTo("body");m=f("<button class='tmpzTreeMove_arrow'></button>");m.attr("id","zTreeMove_arrow_tmp");m.appendTo("body");a.treeObj.trigger(oa,[a.treeObjId,b])}if(a.dragStatus==
1&&m.attr("id")!=l.target.id){if(j){j.removeClass(ya);t&&f("#"+t+n,j).removeClass(za)}t=j=null;s=false;i=a;for(var B in H)if(H[B].editable&&H[B].treeObjId!=a.treeObjId&&(l.target.id==H[B].treeObjId||f(l.target).parents("#"+H[B].treeObjId).length>0)){s=true;i=H[B]}B=f(q).scrollTop();o=f(q).scrollLeft();var C=i.treeObj.offset(),Aa=i.treeObj.get(0).scrollHeight,D=i.treeObj.get(0).scrollWidth,y=l.clientY+B-C.top,U=i.treeObj.height()+C.top-l.clientY-B,V=l.clientX+o-C.left;C=i.treeObj.width()+C.left-l.clientX-
o;y=y<10&&y>-5;U=U<10&&U>-5;V=V<10&&V>-5;C=C<10&&C>-5;var ob=y&&i.treeObj.scrollTop()<=0;Aa=U&&i.treeObj.scrollTop()+i.treeObj.height()+10>=Aa;var pb=V&&i.treeObj.scrollLeft()<=0;D=C&&i.treeObj.scrollLeft()+i.treeObj.width()+10>=D;if(l.target.id&&i.treeObj.find("#"+l.target.id).length>0){for(var z=f("#"+l.target.id);!z.is("li")&&z.attr("id")!=i.treeObjId;)z=z.parent();var Ba=false;if(b.parentNode&&z.attr("id")!=b.tId&&f("#"+b.tId).find("#"+z.attr("id")).length==0)Ba=true;else if(b.parentNode==null&&
z.attr("id")!=b.tId&&f("#"+b.tId).find("#"+z.attr("id")).length==0)Ba=true;if(Ba)if(l.target.id&&(l.target.id==z.attr("id")+n||f(l.target).parents("#"+z.attr("id")+n).length>0)){j=z;t=z.attr("id");f("#"+t+n,j).addClass(za)}}if(l.target.id==i.treeObjId||f(l.target).parents("#"+i.treeObjId).length>0){if(!j&&(ob||Aa||pb||D)&&(s||!s&&b.parentNode!=null)){j=i.treeObj;j.addClass(ya)}if(y)i.treeObj.scrollTop(i.treeObj.scrollTop()-10);else U&&i.treeObj.scrollTop(i.treeObj.scrollTop()+10);if(V)i.treeObj.scrollLeft(i.treeObj.scrollLeft()-
10);else C&&i.treeObj.scrollLeft(i.treeObj.scrollLeft()+10);j&&j!=i.treeObj&&j.offset().left<i.treeObj.offset().left&&i.treeObj.scrollLeft(i.treeObj.scrollLeft()+j.offset().left-i.treeObj.offset().left)}p.css({top:l.clientY+B+3+"px",left:l.clientX+o+3+"px"});D=y=0;if(j&&j.attr("id")!=i.treeObjId){y=f("#"+b.tId).prev().attr("id")==j.attr("id");D=f("#"+b.tId).next().attr("id")==j.attr("id");o=f("#"+t+n,j);l=(l.clientY+B-o.offset().top)/o.height();if(l<0.25&&l>=-0.2&&!D){y=1-m.width();D=0-m.height()/
2;v=W}else if(l>0.75&&l<=1.2&&!y){y=1-m.width();D=o.height()-m.height()/2;v=ea}else{y=5-m.width();D=0;v=x}m.css({display:"block",top:o.offset().top+D+"px",left:o.offset().left+y+"px"});if(R!=t||M!=v)Ya=(new Date).getTime();if(v==x)window.moveTimer=setTimeout(function(){if(v==x){var fa=aa(i,t);fa&&fa.isParent&&!fa.open&&(new Date).getTime()-Ya>500&&Ca(i,fa)}},600)}else{v=x;m.css({display:"none"});window.moveTimer&&clearTimeout(window.moveTimer)}R=t;M=v}return false});f(q).mouseup(function(){this.moveTimer&&
clearTimeout(this.moveTimer);M=R=null;f(q).unbind("mousemove");f(q).unbind("mouseup");f("body").css("cursor","auto");if(j){j.removeClass(ya);t&&f("#"+t+n,j).removeClass(za)}$a(false);if(a.dragStatus!=0){a.dragStatus=0;if(b.isParent&&a.dragNodeShowBefore&&!b.open){G(a,b,!b.open);a.dragNodeShowBefore=false}p&&p.remove();m&&m.remove();if(j&&t&&b.parentNode&&t==b.parentNode.tId&&v==x)j=null;if(j){var l=t==null?null:aa(i,t),o=true;if(typeof i.callback.beforeDrop=="function")o=i.callback.beforeDrop(i.treeObjId,
b,l,v);if(o!=false){if(s){Da(a,b);ga(i,null,[b],false);Ea(i,l,b,v);L(i,b)}else Ea(i,l,b,v);f("#"+b.tId+r).focus().blur();a.treeObj.trigger($,[i.treeObjId,b,l,v])}}else a.treeObj.trigger($,[a.treeObjId,null,null,null])}});k.preventDefault&&k.preventDefault()}});typeof a.addDiyDom=="function"&&a.addDiyDom(a.treeObjId,b);a.treeObj.trigger(ka,[a.treeObjId,b])}function qb(a,b){if(a.setSelectionRange){a.focus();a.setSelectionRange(b,b)}else if(a.createTextRange){var c=a.createTextRange();c.collapse(true);
c.moveEnd("character",b);c.moveStart("character",b);c.select()}}function $a(a){for(;ha.length>0;){ha[0].remove();ha.shift()}if(a){a=f("iframe");for(var b=0;b<a.length;b++){var c=a.get(b),d;d=Array(2);oRect=c.getBoundingClientRect();d[0]=oRect.left;d[1]=oRect.top;d=d;c=f("<div id='zTreeMask_"+b+"' class='zTreeMask' style='top:"+d[1]+"px; left:"+d[0]+"px; width:"+c.offsetWidth+"px; height:"+c.offsetHeight+"px;'></div>");c.appendTo("body");ha.push(c)}}}function Ta(a,b){f("#"+b.tId+K).text(b[a.nameCol])}
function Va(a){f("#"+a.tId+n).attr("target",a.target||"_blank")}function Wa(a,b){var c=f("#"+b.tId+n);b.url&&!a.editable?c.attr("href",b.url):c.removeAttr("href")}function I(a,b){if(b){var c=f("#"+b.tId+w);f("#"+b.tId+n);var d=f("#"+b.tId+u),e=f("#"+b.tId+r);c.attr("class","switch");if(a.showLine){if(b.level==0&&b.isFirstNode&&b.isLastNode)c.attr("class","switch_"+Fa);else if(b.level==0&&b.isFirstNode)c.attr("class","switch_"+Ga);else b.isLastNode?c.attr("class","switch_"+ia):c.attr("class","switch_"+
ab);b.isLastNode?d.removeClass(Ha):d.addClass(Ha)}else c.attr("class","switch_"+bb);e.attr("class",b.iconSkin?b.iconSkin:"");if(b.isParent){d=b.open?"_"+N:"_"+O;c.attr("class",c.attr("class")+d);e.addClass("ico"+d)}else{c.attr("class",c.attr("class")+"_"+J);e.addClass("ico_"+J)}b.icon?e.attr("style","background:url("+b.icon+") 0 0 no-repeat;"):e.attr("style","")}}function Ua(a,b){var c=f("#"+b.tId+n),d={};(d=typeof a.fontCss=="function"?a.fontCss(a.treeObjId,b):a.fontCss)&&c.css(d)}function E(a,b){if(a){var c=
a.attr("class");if(c!=undefined){c=c.split("_");switch(b){case Fa:case Ga:case ab:case ia:case bb:c[1]=b;break;case N:case O:case J:c[2]=b}a.attr("class",c.join("_"))}}}function S(a,b){if(a){var c=a.attr("class");if(c!=undefined){c=c.split("_");switch(b){case N:case O:case J:c[1]=b}a.attr("class",c.join("_"))}}}function Xa(a,b){if(a.dragStatus==0){b.isHover=true;if(a.editable){rb(a,b);sb(a,b)}typeof a.addHoverDom=="function"&&a.addHoverDom(a.treeObjId,b)}}function da(a,b){b.isHover=false;f("#"+b.tId+
ja).unbind().remove();f("#"+b.tId+X).unbind().remove();typeof a.removeHoverDom=="function"&&a.removeHoverDom(a.treeObjId,b)}function rb(a,b){if(!(b.editNameStatus||f("#"+b.tId+ja).length>0)){var c=a.edit_renameBtn;if(typeof a.edit_renameBtn=="function")c=a.edit_renameBtn(b);if(c){f("#"+b.tId+n);f("#"+b.tId+K).after("<button type='button' class='edit' id='"+b.tId+ja+"' title='' onfocus='this.blur();' style='display:none;'></button>");f("#"+b.tId+ja).bind("click",function(){var d=true;if(typeof a.callback.beforeRename==
"function")d=a.callback.beforeRename(a.treeObjId,b);if(d!=false){da(a,b);b.editNameStatus=true;L(a,b);return false}}).bind("mousedown",function(){return true}).show()}}}function sb(a,b){if(!(!a.edit_removeBtn||f("#"+b.tId+X).length>0)){var c=a.edit_removeBtn;if(typeof a.edit_removeBtn=="function")c=a.edit_removeBtn(b);if(c){f("#"+b.tId+n).append("<button type='button' class='remove' id='"+b.tId+X+"' title='' onfocus='this.blur();' style='display:none;'></button>");f("#"+b.tId+X);f("#"+b.tId+X).bind("click",
function(){var d=true;if(typeof a.callback.beforeRemove=="function")d=a.callback.beforeRemove(a.treeObjId,b);if(d!=false){Da(a,b);a.treeObj.trigger(na,[a.treeObjId,b]);return false}}).bind("mousedown",function(){return true}).show()}}}function wa(a,b){if(a.checkStyle==P)if(b[a.checkedCol])if(a.checkRadioType==va){for(var c=a.checkRadioCheckedList.length-1;c>=0;c--){var d=a.checkRadioCheckedList[c];d[a.checkedCol]=false;a.checkRadioCheckedList.splice(c,1);A(a,f("#"+d.tId+F),d);d.parentNode!=b.parentNode&&
Q(a,d)}a.checkRadioCheckedList=a.checkRadioCheckedList.concat([b])}else{c=b.parentNode?b.parentNode:a.root;for(var e=0;e<c[a.nodesCol].length;e++){d=c[a.nodesCol][e];if(d[a.checkedCol]&&d!=b){d[a.checkedCol]=false;A(a,f("#"+d.tId+F),d)}}}else{if(a.checkRadioType==va)for(c=0;c<a.checkRadioCheckedList.length;c++)if(b==a.checkRadioCheckedList[c]){a.checkRadioCheckedList.splice(c,1);break}}else{if(b[a.checkedCol]&&a.checkType.Y.indexOf("s")>-1){Ia(a,b,true);Ja(a,b)}b[a.checkedCol]&&a.checkType.Y.indexOf("p")>
-1&&Ka(a,b,true);if(!b[a.checkedCol]&&a.checkType.N.indexOf("s")>-1){Ia(a,b,false);Ja(a,b)}!b[a.checkedCol]&&a.checkType.N.indexOf("p")>-1&&Ka(a,b,false)}}function A(a,b,c){if(b){b.removeClass();a=a.checkStyle+"_"+(c[a.checkedCol]?tb:ub)+"_"+(c[a.checkedCol]||a.checkStyle==P?c.check_True_Full?cb:db:c.check_False_Full?cb:db);a=c.checkboxFocus?a+"_"+vb:a;b.addClass(wb);b.addClass(a)}}function ba(a,b){if(b&&b.parentNode){La(a,b.parentNode);ba(a,b.parentNode)}}function Q(a,b){b[a.nodesCol]&&b[a.nodesCol].length>
0?ba(a,b[a.nodesCol][0]):ba(a,b)}function Ja(a,b){if(b&&b[a.nodesCol]){for(var c=0;c<b[a.nodesCol].length;c++)b[a.nodesCol][c][a.nodesCol]&&Ja(a,b[a.nodesCol][c]);La(a,b)}}function La(a,b){if(b){var c=true,d=true;if(b[a.nodesCol])for(var e=0;e<b[a.nodesCol].length;e++){if(a.checkStyle==P&&(b[a.nodesCol][e][a.checkedCol]||!b[a.nodesCol][e].check_True_Full))c=false;else if(a.checkStyle!=P&&b[a.checkedCol]&&(!b[a.nodesCol][e][a.checkedCol]||!b[a.nodesCol][e].check_True_Full))c=false;else if(a.checkStyle!=
P&&!b[a.checkedCol]&&(b[a.nodesCol][e][a.checkedCol]||!b[a.nodesCol][e].check_False_Full))d=false;if(!c||!d)break}b.check_True_Full=c;b.check_False_Full=d;c=f("#"+b.tId+F);A(a,c,b)}}function ca(a){var b=H[a.data.treeObjId];a=a.data.treeNode;if(a.open){var c=true;if(typeof b.callback.beforeCollapse=="function")c=b.callback.beforeCollapse(b.treeObjId,a);if(c==false)return}else{c=true;if(typeof b.callback.beforeExpand=="function")c=b.callback.beforeExpand(b.treeObjId,a);if(c==false)return}b.expandTriggerFlag=
true;Ca(b,a)}function Ca(a,b){if(b.open||b&&b[a.nodesCol]&&b[a.nodesCol].length>0)G(a,b,!b.open);else if(a.async&&!a.editable)Ma(a,b);else b&&G(a,b,!b.open)}function Ma(a,b){if(!(b&&(b.isAjaxing||!b.isParent))){if(b){b.isAjaxing=true;f("#"+b.tId+r).attr("class","ico_loading")}for(var c="",d=0;b&&d<a.asyncParam.length;d++)c+=(c.length>0?"&":"")+a.asyncParam[d]+"="+b[a.asyncParam[d]];if(Object.prototype.toString.apply(a.asyncParamOther)==="[object Array]")for(d=0;d<a.asyncParamOther.length;d+=2)c+=
(c.length>0?"&":"")+a.asyncParamOther[d]+"="+a.asyncParamOther[d+1];else for(var e in a.asyncParamOther)c+=(c.length>0?"&":"")+e+"="+a.asyncParamOther[e];d=a.asyncUrl;if(typeof a.asyncUrl=="function")d=a.asyncUrl(b);f.ajax({type:"POST",url:d,data:c,success:function(g){if(!(!g||g.length==0)){var h="";try{h=typeof g=="string"?eval("("+g+")"):g}catch(k){}I(a,b);h&&h!=""?ga(a,b,h,false):ga(a,b,[],false);if(b)b.isAjaxing=undefined;a.treeObj.trigger(ra,[a.treeObjId,b,g])}},error:function(g,h,k){a.expandTriggerFlag=
false;I(a,b);if(b)b.isAjaxing=undefined;a.treeObj.trigger(sa,[a.treeObjId,b,g,h,k])}})}}function G(a,b,c,d,e){if(!b||b.open==c)typeof e=="function"&&e();else{if(a.expandTriggerFlag){e=function(){b.open?a.treeObj.trigger(pa,[a.treeObjId,b]):a.treeObj.trigger(qa,[a.treeObjId,b])};a.expandTriggerFlag=false}c=f("#"+b.tId+w);var g=f("#"+b.tId+r),h=f("#"+b.tId+u);if(b.isParent)if(b.open){E(c,O);S(g,O);b.open=false;if(d==false||a.expandSpeed==""){h.hide();typeof e=="function"&&e()}else h.hide(a.expandSpeed,
e)}else{E(c,N);S(g,N);b.open=true;if(d==false||a.expandSpeed==""){h.show();typeof e=="function"&&e()}else if(b[a.nodesCol]&&b[a.nodesCol].length>0)h.show(a.expandSpeed,e);else{h.show();typeof e=="function"&&e()}}else typeof e=="function"&&e()}}function Na(a,b,c,d,e){var g=b?b[a.nodesCol]:a.root[a.nodesCol],h=b?false:d;if(g)for(var k=0;k<g.length;k++)g[k]&&Na(a,g[k],c,h);G(a,b,c,d,e)}function Y(a,b,c,d,e){if(b)if(b.parentNode){G(a,b,c,d);b.parentNode&&Y(a,b.parentNode,c,d,e)}else G(a,b,c,d,e)}function Ka(a,
b,c){var d=f("#"+b.tId+F);b[a.checkedCol]=c;A(a,d,b);if(b.parentNode){d=true;if(!c)for(var e=0;e<b.parentNode[a.nodesCol].length;e++)if(b.parentNode[a.nodesCol][e][a.checkedCol]){d=false;break}d&&Ka(a,b.parentNode,c)}}function Ia(a,b,c){if(b){var d=f("#"+b.tId+F);if(b!=a.root){b[a.checkedCol]=c;A(a,d,b)}if(b[a.nodesCol])for(d=0;d<b[a.nodesCol].length;d++)b[a.nodesCol][d]&&Ia(a,b[a.nodesCol][d],c)}}function eb(a,b,c){if(c){c.level=b?b.level+1:0;if(c[a.nodesCol])for(b=0;b<c[a.nodesCol].length;b++)c[a.nodesCol][b]&&
eb(a,c,c[a.nodesCol][b])}}function ga(a,b,c,d){if(a.isSimpleData)c=Oa(a,c);if(b){if(a.treeObj.find("#"+b.tId).length!=0){target_switchObj=f("#"+b.tId+w);target_icoObj=f("#"+b.tId+r);target_aObj=f("#"+b.tId+n);target_ulObj=f("#"+b.tId+u);if(!b.open){E(target_switchObj,O);S(target_icoObj,O);b.open=false;target_ulObj.css({display:"none"})}if(!b.isParent){target_switchObj.unbind("click");target_switchObj.bind("click",function(){G(a,b,!b.open)});target_aObj.unbind("dblclick");target_aObj.bind("dblclick",
{treeObjId:a.treeObjId,treeNode:b},ca)}fb(a,b,c);T(a,b.level+1,c,b);d||Y(a,b,true)}}else{fb(a,a.root,c);T(a,0,c,null)}}function fb(a,b,c){b[a.nodesCol]||(b[a.nodesCol]=[]);if(b[a.nodesCol].length>0){b[a.nodesCol][b[a.nodesCol].length-1].isLastNode=false;I(a,b[a.nodesCol][b[a.nodesCol].length-1])}b.isParent=true;b[a.nodesCol]=b[a.nodesCol].concat(c)}function Ea(a,b,c,d,e){if(b!=c){var g=c.parentNode==null?a.root:c.parentNode,h=b===null||b==a.root;if(h&&b===null)b=a.root;if(h)d=x;var k=b.parentNode?
b.parentNode:a.root;if(d!=W&&d!=ea)d=x;var q=-1,p=0,m=null,j=null;if(c.isFirstNode){q=0;if(g[a.nodesCol].length>1){m=g[a.nodesCol][1];m.isFirstNode=true}}else if(c.isLastNode){q=g[a.nodesCol].length-1;m=g[a.nodesCol][q-1];m.isLastNode=true}else for(var s=0;s<g[a.nodesCol].length;s++)if(g[a.nodesCol][s].tId==c.tId)q=s;q>=0&&g[a.nodesCol].splice(q,1);if(d!=x)for(s=0;s<k[a.nodesCol].length;s++)if(k[a.nodesCol][s].tId==b.tId)p=s;q=false;if(d==x){if(h)c.parentNode=null;else{q=!b.isParent;b.isParent=true;
c.parentNode=b}b[a.nodesCol]||(b[a.nodesCol]=[]);if(b[a.nodesCol].length>0){j=b[a.nodesCol][b[a.nodesCol].length-1];j.isLastNode=false}b[a.nodesCol].splice(b[a.nodesCol].length,0,c);c.isLastNode=true;c.isFirstNode=b[a.nodesCol].length==1}else if(b.isFirstNode&&d==W){k[a.nodesCol].splice(p,0,c);j=b;j.isFirstNode=false;c.parentNode=b.parentNode;c.isFirstNode=true;c.isLastNode=false}else if(b.isLastNode&&d==ea){k[a.nodesCol].splice(p+1,0,c);j=b;j.isLastNode=false;c.parentNode=b.parentNode;c.isFirstNode=
false;c.isLastNode=true}else{d==W?k[a.nodesCol].splice(p,0,c):k[a.nodesCol].splice(p+1,0,c);c.parentNode=b.parentNode;c.isFirstNode=false;c.isLastNode=false}eb(a,c.parentNode,c);f("#"+c.tId+w);f("#"+c.tId+u);var i,R,M;if(h)p=k=a.treeObj;else{k=f("#"+b.tId);i=f("#"+b.tId+w);R=f("#"+b.tId+r);M=f("#"+b.tId+n);p=f("#"+b.tId+u)}if(d==x){E(i,N);S(R,N);b.open=true;p.css({display:"block"});if(q&&!h){i.unbind("click");i.bind("click",function(){G(a,b,!b.open)});M.unbind("dblclick");M.bind("dblclick",{treeObjId:a.treeObjId,
treeNode:b},ca)}p.append(f("#"+c.tId).detach())}else if(d==W)k.before(f("#"+c.tId).detach());else d==ea&&k.after(f("#"+c.tId).detach());I(a,c);if(g[a.nodesCol].length<1){g.isParent=false;d=f("#"+g.tId+u);h=f("#"+g.tId+w);m=f("#"+g.tId+r);E(h,J);S(m,J);d.css("display","none")}else m&&I(a,m);j&&I(a,j);if(a.checkable){La(a,g);Q(a,g);g!=c.parent&&Q(a,c)}Y(a,c.parentNode,true,e)}}function Da(a,b){var c=b.parentNode==null?a.root:b.parentNode;if(a.curTreeNode===b)a.curTreeNode=null;if(a.curEditTreeNode===
b)a.curEditTreeNode=null;f("#"+b.tId).remove();for(var d=-1,e=0;e<c[a.nodesCol].length;e++)if(c[a.nodesCol][e].tId==b.tId)d=e;d>=0&&c[a.nodesCol].splice(d,1);if(c[a.nodesCol].length<1){c.isParent=false;c.open=false;d=f("#"+c.tId+u);e=f("#"+c.tId+w);c=f("#"+c.tId+r);E(e,J);S(c,J);d.css("display","none")}else if(a.showLine){c[a.nodesCol][c[a.nodesCol].length-1].isLastNode=true;c[a.nodesCol][c[a.nodesCol].length-1].isFirstNode=c[a.nodesCol].length==1;d=f("#"+c[a.nodesCol][c[a.nodesCol].length-1].tId+
u);e=f("#"+c[a.nodesCol][c[a.nodesCol].length-1].tId+w);f("#"+c[a.nodesCol][c[a.nodesCol].length-1].tId+r);if(c==a.root)if(c[a.nodesCol].length==1)E(e,Fa);else{c=f("#"+c[a.nodesCol][0].tId+w);E(c,Ga);E(e,ia)}else E(e,ia);d.removeClass(Ha)}}function aa(a,b){return Pa(a,a.root[a.nodesCol],"tId",b)}function Pa(a,b,c,d){if(!b||!c)return null;for(var e=0;e<b.length;e++){if(b[e][c]==d)return b[e];var g=Pa(a,b[e][a.nodesCol],c,d);if(g)return g}return null}function gb(a,b,c,d){if(!b||!c)return[];for(var e=
[],g=0;g<b.length;g++){b[g][c]==d&&e.push(b[g]);e=e.concat(gb(a,b[g][a.nodesCol],c,d))}return e}function hb(a){if(a.curTreeNode){f("#"+a.curTreeNode.tId+n).removeClass(xa);f("#"+a.curTreeNode.tId+K).text(a.curTreeNode[a.nameCol]);da(a,a.curTreeNode);a.curTreeNode=null}}function xb(a){if(a.curEditTreeNode){f("#"+a.curEditTreeNode.tId+n).removeClass(ib);f("#"+a.curEditTreeNode.tId+Qa).unbind();f("#"+a.curEditTreeNode.tId+K).text(a.curEditTreeNode[a.nameCol]);a.curEditTreeNode.editNameStatus=false;a.curEditTreeNode=
null}}function L(a,b){if(!(a.curTreeNode==b&&!b.editNameStatus)){hb(a);xb(a);if(a.editable&&b.editNameStatus){f("#"+b.tId+K).html("<input type=text class='rename' id='"+b.tId+Qa+"'>");var c=f("#"+b.tId+Qa);c.attr("value",b[a.nameCol]);c.focus();qb(c.get(0),b[a.nameCol].length);c.bind("blur",function(){b[a.nameCol]=this.value;a.treeObj.trigger(Z,[a.treeObjId,b]);L(a,b)}).bind("keypress",function(d){if(d.keyCode=="13"){b[a.nameCol]=this.value;a.treeObj.trigger(Z,[a.treeObjId,b]);L(a,b)}}).bind("click",
function(){return false}).bind("dblclick",function(){return false});f("#"+b.tId+n).addClass(ib);a.curEditTreeNode=b}else f("#"+b.tId+n).addClass(xa);Xa(a,b);a.curTreeNode=b}}function jb(a,b,c){if(!b)return[];for(var d=[],e=0;e<b.length;e++){if(b[e][a.checkedCol]==c)d=d.concat([b[e]]);var g=jb(a,b[e][a.nodesCol],c);if(g.length>0)d=d.concat(g)}return d}function kb(a,b){if(!b)return[];for(var c=[],d=0;d<b.length;d++){if(b[d][a.checkedCol]!=b[d].checkedOld)c=c.concat([b[d]]);var e=kb(a,b[d][a.nodesCol]);
if(e.length>0)c=c.concat(e)}return c}function Oa(a,b){var c=a.treeNodeKey,d=a.treeNodeParentKey;if(!c||c==""||!b)return[];if(Object.prototype.toString.apply(b)==="[object Array]"){for(var e=[],g=[],h=0;h<b.length;h++)g[b[h][c]]=b[h];for(h=0;h<b.length;h++)if(b[h][d]&&g[b[h][d]]){g[b[h][d]][a.nodesCol]||(g[b[h][d]][a.nodesCol]=[]);g[b[h][d]][a.nodesCol].push(b[h])}else e.push(b[h]);return e}else return[b]}function Ra(a,b){if(!b)return[];var c=[];if(Object.prototype.toString.apply(b)==="[object Array]")for(var d=
0;d<b.length;d++){c.push(b[d]);if(b[d][a.nodesCol])c=c.concat(Ra(a,b[d][a.nodesCol]))}else{c.push(b);if(b[a.nodesCol])c=c.concat(Ra(a,b[a.nodesCol]))}return c}function yb(){return{container:null,setting:null,init:function(a){this.container=a;this.setting=H[a.attr("id")];return this},refresh:function(){this.setting.treeObj.empty();this.setting.curTreeNode=null;this.setting.curEditTreeNode=null;this.setting.dragStatus=0;this.setting.dragNodeShowBefore=false;this.setting.checkRadioCheckedList=[];ua=
0;T(this.setting,0,this.setting.root[this.setting.nodesCol])},setEditable:function(a){this.setting.editable=a;return this.refresh()},transformTozTreeNodes:function(a){return Oa(this.setting,a)},transformToArray:function(a){return Ra(this.setting,a)},getNodes:function(){return this.setting.root[this.setting.nodesCol]},getSelectedNode:function(){return this.setting.curTreeNode},getCheckedNodes:function(a){a=a!=false;return jb(this.setting,this.setting.root[this.setting.nodesCol],a)},getChangeCheckedNodes:function(){return kb(this.setting,
this.setting.root[this.setting.nodesCol])},getNodeByTId:function(a){if(a)return aa(this.setting,a)},getNodeByParam:function(a,b){if(a)return Pa(this.setting,this.setting.root[this.setting.nodesCol],a,b)},getNodesByParam:function(a,b){if(a)return gb(this.setting,this.setting.root[this.setting.nodesCol],a,b)},getNodeIndex:function(a){if(a){for(var b=a.parentNode==null?this.setting.root:a.parentNode,c=0;c<b[this.setting.nodesCol].length;c++)if(b[this.setting.nodesCol][c]==a)return c;return-1}},getSetting:function(){var a=
this.setting,b={checkType:{},callback:{}},c=a.checkType;a.checkType=undefined;var d=a.callback;a.callback=undefined;var e=a.root;a.root=undefined;f.extend(b,a);a.checkType=c;a.callback=d;a.root=e;f.extend(true,b.checkType,c);f.extend(b.callback,d);return b},updateSetting:function(a){if(a){var b=this.setting,c=b.treeObjId,d=a.checkType;a.checkType=undefined;var e=a.callback;a.callback=undefined;var g=a.root;a.root=undefined;f.extend(b,a);a.checkType=d;a.callback=e;a.root=g;f.extend(true,b.checkType,
d);f.extend(b.callback,e);b.treeObjId=c;b.treeObj=this.container}},expandAll:function(a){Na(this.setting,null,a,true)},expandNode:function(a,b,c){if(a){b&&a.parentNode&&Y(this.setting,a.parentNode,b,false);if(c)Na(this.setting,a,b,false,function(){f("#"+a.tId+r).focus().blur()});else if(a.open!=b){Ca(this.setting,a);f("#"+a.tId+r).focus().blur()}}},selectNode:function(a){if(a){L(this.setting,a);a.parentNode?Y(this.setting,a.parentNode,true,false,function(){f("#"+a.tId+r).focus().blur()}):f("#"+a.tId+
r).focus().blur()}},cancleSelectedNode:function(){this.cancelSelectedNode()},cancelSelectedNode:function(){hb(this.setting)},checkAllNodes:function(a){var b=this.setting;if(b.checkable)for(var c=0;c<b.root[b.nodesCol].length;c++){var d=b.root[b.nodesCol][c];d[b.checkedCol]=a;wa(b,d);var e=f("#"+d.tId+F);A(b,e,d);Q(b,d)}},reAsyncChildNodes:function(a,b){if(this.setting.async){var c=!a;if(c)a=this.setting.root;if(b=="refresh"){a[this.setting.nodesCol]=[];c?this.setting.treeObj.empty():f("#"+a.tId+u).empty()}Ma(this.setting,
c?null:a)}},addNodes:function(a,b,c){if(b){a||(a=null);b=Object.prototype.toString.apply(b)==="[object Array]"?b:[b];ga(this.setting,a,b,c==true)}},updateNode:function(a,b){if(a){var c=f("#"+a.tId+F);if(this.setting.checkable){b==true&&wa(this.setting,a);A(this.setting,c,a);Q(this.setting,a)}Ta(this.setting,a);Va(a);Wa(this.setting,a);I(this.setting,a);Ua(this.setting,a)}},moveNode:function(a,b,c){if(b)if(!(a&&(b.parentNode==a&&c==x||f("#"+b.tId).find("#"+a.tId).length>0))){a||(a=null);Ea(this.setting,
a,b,c,false)}},removeNode:function(a){a&&Da(this.setting,a)}}}var ka="ZTREE_NODECREATED",la="ZTREE_CLICK",ma="ZTREE_CHANGE",Z="ZTREE_RENAME",na="ZTREE_REMOVE",oa="ZTREE_DRAG",$="ZTREE_DROP",pa="ZTREE_EXPAND",qa="ZTREE_COLLAPSE",ra="ZTREE_ASYNC_SUCCESS",sa="ZTREE_ASYNC_ERROR",w="_switch",r="_ico",K="_span",Qa="_input",F="_check",ja="_edit",X="_remove",u="_ul",n="_a",Fa="root",Ga="roots",ab="center",ia="bottom",bb="noLine",Ha="line",N="open",O="close",J="docu",xa="curSelectedNode",ib="curSelectedNode_Edit",
ya="tmpTargetTree",za="tmpTargetNode",P="radio",wb="chk",ub="false",tb="true",cb="full",db="part",vb="focus",va="all",x="inner",W="before",ea="after",Za="5",H=[],ua=0;f.fn.zTree=function(a,b){var c={treeObjId:"",checkable:false,editable:false,edit_renameBtn:true,edit_removeBtn:true,showLine:true,curTreeNode:null,curEditTreeNode:null,dragStatus:0,dragNodeShowBefore:false,checkStyle:"checkbox",checkType:{Y:"ps",N:"ps"},checkRadioType:"level",checkRadioCheckedList:[],async:false,asyncUrl:"",asyncParam:[],
asyncParamOther:[],isSimpleData:false,treeNodeKey:"",treeNodeParentKey:"",nameCol:"name",nodesCol:"nodes",checkedCol:"checked",expandSpeed:"fast",expandTriggerFlag:false,addHoverDom:null,removeHoverDom:null,addDiyDom:null,fontCss:{},root:{isRoot:true,nodes:[]},callback:{beforeClick:null,beforeRightClick:null,beforeMouseDown:null,beforeMouseUp:null,beforeChange:null,beforeDrag:null,beforeDrop:null,beforeRename:null,beforeRemove:null,beforeExpand:null,beforeCollapse:null,nodeCreated:null,click:null,
rightClick:null,mouseDown:null,mouseUp:null,change:null,drag:null,drop:null,rename:null,remove:null,expand:null,collapse:null,asyncSuccess:null,asyncError:null}};if(a){var d=a.checkType;a.checkType=undefined;var e=a.callback;a.callback=undefined;var g=a.root;a.root=undefined;f.extend(c,a);a.checkType=d;f.extend(true,c.checkType,d);a.callback=e;f.extend(c.callback,e);a.root=g;f.extend(c.root,g)}c.treeObjId=this.attr("id");c.treeObj=this;c.root.tId=-1;c.root.name="ZTREE ROOT";c.root.isRoot=true;c.checkRadioCheckedList=
[];c.curTreeNode=null;c.curEditTreeNode=null;c.dragNodeShowBefore=false;c.dragStatus=0;c.expandTriggerFlag=false;c.root[c.nodesCol]||(c.root[c.nodesCol]=[]);ua=0;if(b)c.root[c.nodesCol]=b;if(c.isSimpleData)c.root[c.nodesCol]=Oa(c,c.root[c.nodesCol]);H[c.treeObjId]=c;c.treeObj.empty();lb(c,this);if(c.root[c.nodesCol]&&c.root[c.nodesCol].length>0)T(c,0,c.root[c.nodesCol]);else c.async&&c.asyncUrl&&c.asyncUrl.length>0&&Ma(c);return(new yb).init(this)};var ha=[]})(jQuery);