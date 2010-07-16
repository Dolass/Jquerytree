/*
 * JQuery zTree 2.0
 * http://code.google.com/p/jquerytree/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Date: 2010-07-18
 *
 */
(function(e){function za(b,a){a.unbind(U);a.bind(U,function(c,d,f){typeof b.callback.click=="function"&&b.callback.click(c,d,f)});a.unbind(V);a.bind(V,function(c,d,f){typeof b.callback.change=="function"&&b.callback.change(c,d,f)});a.unbind(W);a.bind(W,function(c,d,f){typeof b.callback.drag=="function"&&b.callback.drag(c,d,f)});a.unbind(K);a.bind(K,function(c,d,f,g){typeof b.callback.drop=="function"&&b.callback.drop(c,d,f,g)});a.unbind(X);a.bind(X,function(c,d,f){typeof b.callback.asyncSuccess==
"function"&&b.callback.asyncSuccess(c,d,f)});a.unbind(Y);a.bind(Y,function(c,d,f,g,t){typeof b.callback.asyncError=="function"&&b.callback.asyncError(c,d,f,g,t)})}function F(b,a,c,d){if(c)for(var f=0;f<c.length;f++){var g=c[f];g.level=a;g.tId=b.treeObjId+"_"+ ++Z;g.parentNode=d;g.checkedNew=g.checkedNew==undefined?g.checked==true:g.checkedNew;g.check_Focus=false;g.check_True_Full=true;g.check_False_Full=true;g.editNameStatus=false;g.isFirstNode=(d?d:b.root).nodes.length==c.length&&f==0;g.isLastNode=
f==c.length-1;if(g.nodes&&g.nodes.length>0){g.open=g.open?true:false;g.isParent=true;ha(b,g);F(b,a+1,g.nodes,g)}else{g.isParent=g.isParent?true:false;ha(b,g);b.checkable&&f==c.length-1&&L(b,g)}}}function ha(b,a){var c=a.parentNode;c=c?e("#"+a.parentNode.tId+p):e("#"+b.treeObjId);c.append("<li id='"+a.tId+"' class='tree-node'><button class=\"switch\" id='"+a.tId+o+"' title='' onfocus='this.blur();'></button><a id='"+a.tId+s+"' onclick=\""+(a.click||"")+'" ><button class="'+a.iconSkin+" ico\" id='"+
a.tId+u+"' title='' onfocus='this.blur();'></button><span id='"+a.tId+G+"'></span></a><ul id='"+a.tId+p+"'></ul></li>");c=e("#"+a.tId+o);var d=e("#"+a.tId+s),f=e("#"+a.tId+G),g=e("#"+a.tId+p);f.text(a.name);f=e("#"+a.tId+u);if(b.showLine){if(a.level==0&&a.isFirstNode&&a.isLastNode)c.attr("class",c.attr("class")+"_"+M);else if(a.level==0&&a.isFirstNode)c.attr("class",c.attr("class")+"_"+B);else a.isLastNode?c.attr("class",c.attr("class")+"_"+y):c.attr("class",c.attr("class")+"_"+N);a.isLastNode||g.addClass(C)}else c.attr("class",
c.attr("class")+"_"+ia);if(a.isParent){var t=a.open?"_"+z:"_"+w;c.attr("class",c.attr("class")+t);f.attr("class",f.attr("class")+t)}else{c.attr("class",c.attr("class")+"_"+x);f.attr("class",f.attr("class")+"_"+x)}a.icon&&f.attr("style","background:url("+a.icon+") 0 0 no-repeat;");g.css({display:a.open?"block":"none"});if(a.isParent){c.bind("click",{treeObjId:b.treeObjId,treeNode:a},O);d.bind("dblclick",{treeObjId:b.treeObjId,treeNode:a},O)}d.bind("click",function(){var i=true;if(typeof b.before.click==
"function")i=b.before.click(b.treeObjId,a);if(i!=false){window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();P(b,a);e("#"+b.treeObjId).trigger(U,[b.treeObjId,a])}});f.bind("mousedown",function(){a.editNameStatus=false});if(b.checkable){c.after("<BUTTON type='BUTTON' ID='"+a.tId+"_check' onfocus='this.blur();' ></BUTTON>");var r=e("#"+a.tId+"_check");if(b.checkStyle==D&&b.checkRadioType==$&&a.checkedNew)b.checkRadioCheckedList=b.checkRadioCheckedList.concat([a]);v(b,
r,a);r.bind("click",function(){var i=true;if(typeof b.before.change=="function")i=b.before.change(b.treeObjId,a);if(i!=false){a.checkedNew=!a.checkedNew;if(b.checkStyle==D)if(a.checkedNew)if(b.checkRadioType==$){for(var h=b.checkRadioCheckedList.length-1;h>=0;h--){i=b.checkRadioCheckedList[h];i.checkedNew=false;b.checkRadioCheckedList.splice(h,1);v(b,e("#"+i.tId+"_check"),i);i.parentNode!=a.parentNode&&ja(b,i)}b.checkRadioCheckedList=b.checkRadioCheckedList.concat([a])}else{h=a.parentNode?a.parentNode:
b.root;for(var q=0;q<h.nodes.length;q++){i=h.nodes[q];if(i.checkedNew&&i!=a){i.checkedNew=false;v(b,e("#"+i.tId+"_check"),i)}}}else{if(b.checkRadioType==$)for(h=0;h<b.checkRadioCheckedList.length;h++)if(a==b.checkRadioCheckedList[h]){b.checkRadioCheckedList.splice(h,1);break}}else{a.checkedNew&&b.checkType.Y.indexOf("p")>-1&&aa(b,a,true);a.checkedNew&&b.checkType.Y.indexOf("s")>-1&&ba(b,a,true);!a.checkedNew&&b.checkType.N.indexOf("p")>-1&&aa(b,a,false);!a.checkedNew&&b.checkType.N.indexOf("s")>-1&&
ba(b,a,false)}v(b,r,a);ja(b,a);e("#"+b.treeObjId).trigger(V,[b.treeObjId,a])}});r.bind("mouseover",function(){a.checkboxFocus=true;v(b,r,a)});r.bind("mouseout",function(){a.checkboxFocus=false;v(b,r,a)})}d.attr("target",a.target||"_blank");a.url&&!b.editable&&d.attr("href",a.url);b.editable&&d.hover(function(){if(b.dragStatus==0){H(a);I(a);ka(b,a);la(b,a)}},function(){H(a);I(a)});d.bind("mousedown",function(i){if(!(i.button==2||!b.editable)){var h=document,q,k,Aa=i.clientX,Ba=i.clientY;e(h).mousemove(function(m){if(a.editNameStatus)return true;
window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();if(b.dragStatus==0&&Math.abs(Aa-m.clientX)<ma&&Math.abs(Ba-m.clientY)<ma)return true;e("body").css("cursor","pointer");e("#"+a.tId+o);if(b.dragStatus==0&&a.isParent&&a.open){A(a);b.dragNodeShowBefore=true}if(b.dragStatus==0){var j=true;if(typeof b.before.drag=="function")j=b.before.drag(b.treeObjId,a);if(j==false)return;b.dragStatus=1;na(true);P(b,a);H(a);I(a);j=e("#"+a.tId).clone();j.attr("id",a.tId+"_tmp");j.css("padding",
"0");j.children("#"+a.tId+s).removeClass(ca);j.children("#"+a.tId+p).css("display","none");q=e("<ul class='zTreeDragUL'></ul>").append(j);q.attr("id",a.tId+p+"_tmp");q.addClass(e("#"+b.treeObjId).attr("class"));q.appendTo("body");e("#"+b.treeObjId).trigger(W,[b.treeObjId,a])}if(b.dragStatus==1){if(k){k.removeClass(da);k.removeClass(Q)}k=null;if(m.target.id==b.treeObjId&&a.parentNode!=null){k=e("#"+b.treeObjId);k.addClass(da)}else if(m.target.id&&e("#"+b.treeObjId).find("#"+m.target.id).length>0){for(j=
e("#"+m.target.id);!j.is("li")&&j.attr("id")!=b.treeObjId;)j=j.parent();if(a.parentNode&&j.attr("id")!=a.tId&&j.attr("id")!=a.parentNode.tId&&e("#"+a.tId).find("#"+j.attr("id")).length==0){j.children("a").addClass(Q);k=j.children("a")}else if(a.parentNode==null&&j.attr("id")!=a.tId&&e("#"+a.tId).find("#"+j.attr("id")).length==0){j.children("a").addClass(Q);k=j.children("a")}}q.css({top:m.clientY+(h.body.scrollTop==0?h.documentElement.scrollTop:h.body.scrollTop)+3+"px",left:m.clientX+(h.body.scrollLeft==
0?h.documentElement.scrollLeft:h.body.scrollLeft)+3+"px"})}return false});e(h).mouseup(function(){e(h).unbind("mousemove");e(h).unbind("mouseup");e("body").css("cursor","auto");if(k){k.removeClass(da);k.removeClass(Q)}na(false);if(b.dragStatus!=0){b.dragStatus=0;if(a.isParent&&b.dragNodeShowBefore&&!a.open){A(a);b.dragNodeShowBefore=false}q&&q.remove();if(k){var m="";if(k.attr("id")==b.treeObjId)m=null;else{for(k=k.parent();!k.is("li")&&k.attr("id")!=b.treeObjId;)k=k.parent();m=k.attr("id")}m=m==
null?null:ea(b.root.nodes,m);var j=true;if(typeof b.before.drop=="function")j=b.before.drop(b.treeObjId,a,m);if(j!=false){oa(b,m,a);e("#"+b.treeObjId).trigger(K,[b.treeObjId,a,m])}}else e("#"+b.treeObjId).trigger(K,[b.treeObjId,null,null])}})}})}function Ca(b,a){if(b.setSelectionRange){b.focus();b.setSelectionRange(a,a)}else if(b.createTextRange){var c=b.createTextRange();c.collapse(true);c.moveEnd("character",a);c.moveStart("character",a);c.select()}}function na(b){for(;R.length>0;){R[0].remove();
R.shift()}if(b){b=e("iframe");for(var a=0;a<b.length;a++){var c=b.get(a),d;d=c;var f=Array(2);oRect=d.getBoundingClientRect();f[0]=oRect.left;f[1]=oRect.top;d=f;c=e("<div id='zTreeMask_"+a+"' class='zTreeMask' style='top:"+d[1]+"px; left:"+d[0]+"px; width:"+c.offsetWidth+"px; height:"+c.offsetHeight+"px;'></div>");c.appendTo("body");R.push(c)}}}function l(b,a){if(b){var c=b.attr("class");if(c!=undefined){c=c.split("_");switch(a){case M:case B:case N:case y:case ia:c[1]=a;break;case z:case w:case x:c[2]=
a;break}b.attr("class",c.join("_"))}}}function E(b,a){if(b){var c=b.attr("class");if(c!=undefined){c=c.split("_");switch(a){case z:case w:case x:c[1]=a;break}b.attr("class",c.join("_"))}}}function H(b){e("#"+b.tId+S).unbind().remove()}function I(b){e("#"+b.tId+T).unbind().remove()}function ka(b,a){if(!(!b.edit_rename||a.editNameStatus||e("#"+a.tId+S).length>0)){var c="<button class='edit' id='"+a.tId+S+"' title='' onfocus='this.blur();'></button>";e("#"+a.tId+s).append(c);e("#"+a.tId+S).bind("click",
function(){H(a);I(a);a.editNameStatus=true;P(b,a);return false}).bind("mousedown",function(){return false})}}function la(b,a){if(!(!b.edit_deleteNode||e("#"+a.tId+T).length>0)){var c="<button class='del' id='"+a.tId+T+"' title='' onfocus='this.blur();'></button>";e("#"+a.tId+s).append(c);e("#"+a.tId+T).bind("click",function(){pa(b,a);return false}).bind("mousedown",function(){return false})}}function v(b,a,c){if(a){a.removeClass();b=b.checkStyle+"_"+(c.checkedNew?Da:Ea)+"_"+(c.checkedNew||b.checkStyle==
D?c.check_True_Full?qa:ra:c.check_False_Full?qa:ra);b=c.checkboxFocus?b+"_"+Fa:b;a.addClass(Ga);a.addClass(b)}}function L(b,a){if(a&&a.parentNode){for(var c=true,d=true,f=0;f<a.parentNode.nodes.length;f++){if(b.checkStyle==D&&(a.parentNode.nodes[f].checkedNew||!a.parentNode.nodes[f].check_True_Full))c=false;else if(b.checkStyle!=D&&a.parentNode.checkedNew&&(!a.parentNode.nodes[f].checkedNew||!a.parentNode.nodes[f].check_True_Full))c=false;else if(b.checkStyle!=D&&!a.parentNode.checkedNew&&(a.parentNode.nodes[f].checkedNew||
!a.parentNode.nodes[f].check_False_Full))d=false;if(!c||!d)break}a.parentNode.check_True_Full=c;a.parentNode.check_False_Full=d;c=e("#"+a.parentNode.tId+"_check");v(b,c,a.parentNode);L(b,a.parentNode)}}function ja(b,a){a.nodes&&a.nodes.length>0?L(b,a.nodes[0]):L(b,a)}function O(b){sa(n[b.data.treeObjId],b.data.treeNode)}function sa(b,a){if(a&&a.nodes&&a.nodes.length>0)A(a);else b.async&&!b.editable&&ta(b,a)}function ta(b,a){for(var c="",d=0;a&&d<b.asyncParam.length;d++)c+=(c.length>0?"&":"")+b.asyncParam[d]+
"="+a[b.asyncParam[d]];for(d=0;d<b.asyncParamOther.length;d+=2)c+=(c.length>0?"&":"")+b.asyncParamOther[d]+"="+b.asyncParamOther[d+1];e.ajax({type:"POST",url:b.asyncUrl,data:c,success:function(f){if(!(!f||f.length==0)){var g="";try{g=eval("("+f+")")}catch(t){}g&&g!=""&&ua(b,a,g);e("#"+b.treeObjId).trigger(X,[b.treeObjId,f])}},error:function(f,g,t){e("#"+b.treeObjId).trigger(Y,[b.treeObjId,f,g,t])}})}function A(b){var a=e("#"+b.tId+o),c=e("#"+b.tId+u),d=e("#"+b.tId+p);if(b.isParent&&b.nodes&&b.nodes.length>
0){d.toggle("fast");if(a.attr("class").indexOf(w)>0){l(a,z);E(c,z);b.open=true}else{l(a,w);E(c,w);b.open=false}}}function fa(b,a,c){if(b){a&&a.open!=c&&A(a);if(a=a?a.nodes:n[b].root.nodes)for(var d=0;d<a.length;d++)a[d]&&fa(b,a[d],c)}}function J(b,a,c){if(b){a&&a.open!=c&&A(a);a.parentNode&&J(b,a.parentNode,c)}}function aa(b,a,c){var d=e("#"+a.tId+"_check");a.checkedNew=c;v(b,d,a);if(a.parentNode){d=true;if(!c)for(var f=0;f<a.parentNode.nodes.length;f++)if(a.parentNode.nodes[f].checkedNew){d=false;
break}d&&aa(b,a.parentNode,c)}}function ba(b,a,c){if(a){var d=e("#"+a.tId+"_check");a.checkedNew=c;v(b,d,a);if(a.nodes)for(d=0;d<a.nodes.length;d++)a.nodes[d]&&ba(b,a.nodes[d],c)}}function va(b,a){if(a){a.level=b?b.level+1:0;if(a.nodes)for(var c=0;c<a.nodes.length;c++)a.nodes[c]&&va(a,a.nodes[c])}}function ua(b,a,c){if(a){if(e("#"+b.treeObjId).find("#"+a.tId).length!=0){target_switchObj=e("#"+a.tId+o);target_icoObj=e("#"+a.tId+u);target_aObj=e("#"+a.tId+s);target_ulObj=e("#"+a.tId+p);if(!a.open){l(target_switchObj,
w);E(target_icoObj,w);a.open=false;target_ulObj.css({display:"none"})}if(!a.isParent){target_switchObj.unbind("click");target_switchObj.bind("click",function(){A(a)});target_aObj.unbind("dblclick");target_aObj.bind("dblclick",{treeObjId:b.treeObjId,treeNode:a},O)}wa(a,c);F(b,a.level+1,c,a);J(b.treeObjId,a,true)}}else{wa(b.root,c);F(b,0,c,null)}}function wa(b,a){if(!b.nodes)b.nodes=[];if(b.nodes.length>0){var c=b.nodes[b.nodes.length-1].tId;b.nodes[b.nodes.length-1].isLastNode=false;b.nodes[b.nodes.length-
1].isFirstNode?l(e("#"+c+o),B):l(e("#"+c+o),N);e("#"+c+p).addClass(C)}b.isParent=true;b.nodes=b.nodes.concat(a)}function oa(b,a,c){if(a!=c){var d=c.parentNode==null?b.root:c.parentNode,f=a===null||a==b.root;if(f&&a===null)a=b.root;var g=e("#"+c.tId+o),t=e("#"+c.tId+p),r,i,h,q;if(f)r=r=e("#"+b.treeObjId);else{i=e("#"+a.tId+o);h=e("#"+a.tId+u);q=e("#"+a.tId+s);r=e("#"+a.tId+p)}l(i,z);E(h,z);a.open=true;r.css({display:"block"});if(!a.isParent&&!f){i.unbind("click");i.bind("click",function(){A(a)});q.unbind("dblclick");
q.bind("dblclick",{treeObjId:b.treeObjId,treeNode:a},O)}r.append(e("#"+c.tId).detach());i=-1;for(h=0;h<d.nodes.length;h++)if(d.nodes[h].tId==c.tId)i=h;i>=0&&d.nodes.splice(i,1);if(a.nodes){if(b.showLine&&a.nodes.length>0){a.nodes[a.nodes.length-1].isLastNode=false;i=e("#"+a.nodes[a.nodes.length-1].tId+p);h=e("#"+a.nodes[a.nodes.length-1].tId+o);i.addClass(C);f&&a.nodes[a.nodes.length-1].isFirstNode?l(h,B):l(h,N)}}else a.nodes=[];if(f)c.parentNode=null;else{a.isParent=true;c.parentNode=a}va(c.parentNode,
c);a.nodes.splice(a.nodes.length,0,c);c.isLastNode=true;c.isFirstNode=a.nodes.length==1;if(b.showLine){l(g,y);t.removeClass(C)}if(d.nodes.length<1){d.isParent=false;i=e("#"+d.tId+p);h=e("#"+d.tId+o);c=e("#"+d.tId+u);l(h,x);E(c,x);i.css("display","none")}else if(b.showLine){d.nodes[d.nodes.length-1].isLastNode=true;d.nodes[d.nodes.length-1].isFirstNode=d.nodes.length==1;i=e("#"+d.nodes[d.nodes.length-1].tId+p);h=e("#"+d.nodes[d.nodes.length-1].tId+o);c=e("#"+d.nodes[d.nodes.length-1].tId+u);if(d==
b.root)if(d.nodes.length==1)l(h,M);else{d=e("#"+d.nodes[0].tId+o);l(d,B);l(h,y)}else l(h,y);i.removeClass(C)}J(b.treeObjId,a,true)}}function pa(b,a){var c=a.parentNode==null?b.root:a.parentNode;if(b.curTreeNode===a)b.curTreeNode=null;if(b.curEditTreeNode===a)b.curEditTreeNode=null;e("#"+a.tId).remove();for(var d=-1,f=0;f<c.nodes.length;f++)if(c.nodes[f].tId==a.tId)d=f;d>=0&&c.nodes.splice(d,1);if(c.nodes.length<1){c.isParent=false;d=e("#"+c.tId+p);f=e("#"+c.tId+o);c=e("#"+c.tId+u);l(f,x);E(c,x);d.css("display",
"none")}else if(b.showLine){c.nodes[c.nodes.length-1].isLastNode=true;c.nodes[c.nodes.length-1].isFirstNode=c.nodes.length==1;d=e("#"+c.nodes[c.nodes.length-1].tId+p);f=e("#"+c.nodes[c.nodes.length-1].tId+o);e("#"+c.nodes[c.nodes.length-1].tId+u);if(c==b.root)if(c.nodes.length==1)l(f,M);else{c=e("#"+c.nodes[0].tId+o);l(c,B);l(f,y)}else l(f,y);d.removeClass(C)}}function ea(b,a){if(!b||!a)return null;for(var c=0;c<b.length;c++){if(b[c].tId==a)return b[c];var d=ea(b[c].nodes,a);if(d)return d}return null}
function Ha(b){if(b.curTreeNode){H(b.curTreeNode);I(b.curTreeNode);e("#"+b.curTreeNode.tId+s).removeClass(ca);e("#"+b.curTreeNode.tId+G).text(b.curTreeNode.name)}}function Ia(b){if(b.curEditTreeNode){e("#"+b.curEditTreeNode.tId+s).removeClass(xa);e("#"+b.curEditTreeNode.tId+ga).unbind();e("#"+b.curEditTreeNode.tId+G).text(b.curEditTreeNode.name);b.curEditTreeNode.editNameStatus=false;b.curEditTreeNode=null}}function P(b,a){if(!(b.curTreeNode==a&&!b.editable)){Ha(b);Ia(b);if(b.editable){ka(b,a);la(b,
a)}if(a.editNameStatus){e("#"+a.tId+G).html("<input type=text class='rename' id='"+a.tId+ga+"'>");var c=e("#"+a.tId+ga);c.attr("value",a.name);c.focus();Ca(c.get(0),a.name.length);c.bind("change",function(){a.name=this.value}).bind("blur",function(){a.name=this.value}).bind("click",function(){return false}).bind("dblclick",function(){return false});e("#"+a.tId+s).addClass(xa);b.curEditTreeNode=a}else e("#"+a.tId+s).addClass(ca);b.curTreeNode=a}}function ya(b,a){if(!b)return[];for(var c=[],d=0;d<b.length;d++){if(b[d].checkedNew==
a)c=c.concat([b[d]]);var f=ya(b[d].nodes,a);if(f.length>0)c=c.concat(f)}return c}function Ja(){return{container:null,init:function(b){this.container=b;return this},refresh:function(){var b=this.container.attr("id");e("#"+b).empty();n[b].curTreeNode=null;Z=0;F(n[b],0,n[b].root.nodes)},setEditable:function(b){var a=this.container.attr("id");n[a].editable=b;return this.refresh()},getNodes:function(){var b=this.container.attr("id");return n[b].root.nodes},getSelectedNode:function(){var b=this.container.attr("id");
return n[b].curTreeNode},getCheckedNodes:function(b){var a=this.container.attr("id");if(a){b=b!=false;return ya(n[a].root.nodes,b)}},getNodeByTId:function(b){var a=this.container.attr("id");if(a&&b)return ea(n[a].root.nodes,b)},getNodeIndex:function(b){var a=this.container.attr("id");if(a&&b){a=b.parentNode==null?n[a].root:b.parentNode;for(var c=0;c<a.nodes.length;c++)if(a.nodes[c]==b)return c;return-1}},expandAll:function(b){var a=this.container.attr("id");fa(a,null,b)},expandNode:function(b,a,c){var d=
this.container.attr("id");if(d&&b){if(c)fa(d,b,a);else b.open!=a&&sa(n[d],b);a&&J(d,b,a)}},selectNode:function(b){var a=this.container.attr("id");if(a&&b){P(n[a],b);J(a,b,true)}},addNodes:function(b,a){var c=this.container.attr("id");if(c&&a){b||(b=null);ua(n[c],b,a)}},moveNode:function(b,a){var c=this.container.attr("id");if(c&&a)if(!(b&&(a.parentNode==b||e("#"+a.tId).find("#"+b.tId).length>0))){b||(b=null);oa(n[c],b,a)}},removeNode:function(b){var a=this.container.attr("id");a&&b&&pa(n[a],b)}}}
var U="ZTREE_CLICK",V="ZTREE_CHANGE",W="ZTREE_DRAG",K="ZTREE_DROP",X="ZTREE_ASYNC_SUCCESS",Y="ZTREE_ASYNC_ERROR",o="_switch",u="_ico",G="_span",ga="_input",S="_edit",T="_del",p="_ul",s="_a",M="root",B="roots",N="center",y="bottom",ia="noLine",C="line",z="open",w="close",x="docu",ca="curSelectedNode",xa="curSelectedNode_Edit",da="tmpTargetTree",Q="tmpTargetNode",D="radio",Ga="chk",Ea="false",Da="true",qa="full",ra="part",Fa="focus",$="all",ma="5",n=[],Z=0;e.fn.zTree=function(b,a){var c={treeObjId:"",
checkable:false,editable:false,edit_rename:false,edit_deleteNode:false,showLine:true,curTreeNode:null,curEditTreeNode:null,dragStatus:0,dragNodeShowBefore:false,checkStyle:"checkbox",checkType:{Y:"ps",N:"ps"},checkRadioType:"level",checkRadioCheckedList:[],async:false,asyncUrl:"",asyncParam:[],asyncParamOther:[],root:{isRoot:true,nodes:[]},before:{click:null,change:null,drag:null,drop:null},callback:{click:null,change:null,drag:null,drop:null,asyncSuccess:null,asyncError:null}};b&&e.extend(c,b);c.treeObjId=
this.attr("id");c.root.tId=-1;c.root.name="ZTREE ROOT";c.root.isRoot=true;c.checkRadioCheckedList=[];Z=0;if(a)c.root.nodes=a;n[c.treeObjId]=c;e("#"+c.treeObjId).empty();if(c.root.nodes&&c.root.nodes.length>0)F(c,0,c.root.nodes);else c.async&&c.asyncUrl&&c.asyncUrl.length>0&&ta(c);za(c,this);return(new Ja).init(this)};var R=[]})(jQuery);