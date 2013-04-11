/*
 * 对于不支持 contenteditable 的Android 采用的 Html 简易编辑器
 **/
(function($){
	var zCatchTextNode  = {
		WIZTAG : "wiz",
		_isEditing : false,
		_main : null,
		_curObj : null,
		//初始化 html （主要用于处理 <a><span> ）
		initHtml : function(){
			var content = zCatchTextNode._main;
			if (!content || !content.get(0)) {
				return;
			}
			var aList = content.find("a"), i, j, aObj;
			for(i=0,j=aList.length; i<j; i++) {
				aObj = aList[i];
				zCatchTextNode.initAnchor(aObj);
			}
			var sList = content.find("span"), sObj;
			for(i=0,j=sList.length; i<j; i++) {
				sObj = sList[i];
				zCatchTextNode.initSpan(sObj);
			}
		},
		//还原 html （主要用于处理 <a><span> ）
		recoverHtml : function(){
			var content = zCatchTextNode._main;
			if (!content || !content.get(0)) {
				return;
			}
			var aList = content.find(zCatchTextNode.WIZTAG), i, j, aObj;
			for(i=0,j=aList.length; i<j; i++) {
				zCatchTextNode.recoverWiz(aList[i]);
			}
		},
		//获取 html
		getHTML : function() {
			return zCatchTextNode._main.html().replace(/<wiz>|<\/wiz>/ig, "");
		},
		//处理 a 标签内的  TextNode
		initAnchor : function(aObj) {
			if (!aObj) {
				return;
			}
			var aChildNodes, i, j;
			aChildNodes = aObj.childNodes;
			for(i=0,j=aChildNodes.length; i<j; i++) {
				zCatchTextNode._TextNodeToWiz(aChildNodes[i]);
			}
		},
		//处理 span 标签内的  TextNode & DOM 混合情况
		initSpan : function(sObj) {
			if (!sObj || sObj.childNodes.length == 1 || sObj.children.length == sObj.childNodes.length) {
				return;
			}
			var sChildNodes, i, j;
			sChildNodes = sObj.childNodes;
			for(i=0,j=sChildNodes.length; i<j; i++) {
				zCatchTextNode._TextNodeToWiz(sChildNodes[i]);
			}
		},
		_TextNodeToWiz : function(node) {
			if (node.nodeType != 3) {
				return;
			}
			var tmpParent, tmpNext, newObj
			tmpParent = node.parentNode;
			tmpNext = node.nextSibling;
			newObj = document.createElement(zCatchTextNode.WIZTAG);
			newObj.appendChild(node);
			tmpParent.insertBefore(newObj,tmpNext);
		},
		//还原 a 标签内的  TextNode
		recoverWiz : function(sObj) {
			if (!sObj) {
				return;
			}
			sObj.parentNode.insertBefore(sObj.childNodes[0], sObj.nextSibling);
			sObj.parentNode.removeChild(sObj);
		},
		//更新文本
		updateText : function(txt) {
			if (!zCatchTextNode._isEditing || !zCatchTextNode._curObj) {
				return;
			}
			if (zCatchTextNode._curObj.nodeType == 3) {
				zCatchTextNode._curObj.textContent = txt;
			} else {
				zCatchTextNode._curObj.innerText = txt;
			}
			zCatchTextNode.resetEdit();
		},
		//状态重置
		resetEdit : function() {
			zCatchTextNode._isEditing = true;
			zCatchTextNode._curObj = null;
		},
		handler : {
			//click 点击要编辑的 DOM
			onClick: function(e) {
				var textNode = window.getSelection().baseNode,
				eObj = e.target,
				children = eObj.childNodes,
				isChild = false, i,j, lastNode, tmpObj, tmpOffset, tmpX, tmpY;
				for (i=0, j=children.length; i<j; i++) {
					if (children[i] == textNode) {
						isChild = true;
						break;
					}
				}
				var outTxt = "";
				if (isChild) {
					zCatchTextNode._curObj = textNode;
					outTxt = textNode.textContent;
				} else if (eObj.children.length == 0){
					zCatchTextNode._curObj = eObj;
					outTxt = eObj.innerText;
				}
				if (outTxt.length > 0) {
					e.data.callback.apply(this, [outTxt]);
				} else {
					zCatchTextNode._curObj = null;
				}

				if(e.preventDefault) {
					e.preventDefault();
				}
				if(e.bubbles) {
					e.bubbles = false;
				}
			}
		}
	};
	/*
	 * 注册 jQuery Fn
	 */
	//开始编辑
	$.fn.wizEditorStart = function(options) {
		if (!this.get(0) || !!zCatchTextNode._isEditing) {
			return;
		}
		zCatchTextNode.resetEdit();
		zCatchTextNode._main = this;
		zCatchTextNode.initHtml();
		this.bind("click", {callback:options.callback.getDomTxt}, zCatchTextNode.handler.onClick);
	}
	//停止编辑
	$.fn.wizEditorStop = function() {
		if (!this.get(0)) {
			return;
		}
		zCatchTextNode._isEditing = false;
		zCatchTextNode._curObj = null;
		zCatchTextNode.recoverHtml();
		zCatchTextNode._main = null;
		this.unbind("click", zCatchTextNode.handler.onClick);
	}
	//获取内容
	$.fn.wizEditorGetHtml = function(txt) {
		return zCatchTextNode.getHTML();
	}
	//编辑内容更改
	$.fn.wizEditorUpdate = function(txt) {
		zCatchTextNode.updateText(txt);
	}
	//编辑当前状态取消
	$.fn.wizEditorReset = function() {
		zCatchTextNode.resetEdit();
	}
	window.zWizEditorGetHtml = $.fn.wizEditorGetHtml;
	window.zWizEditorUpdate = $.fn.wizEditorUpdate;
	window.zWizEditorReset = $.fn.wizEditorReset;
})(jQuery);

$(zWizContentSelector).wizEditorStart(zWizEditorCallback);