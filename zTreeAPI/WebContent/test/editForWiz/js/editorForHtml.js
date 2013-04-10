/*
 * 对于不支持 contenteditable 的Android 采用的 Html 简易编辑器
 **/
(function($){
	var zCatchTextNode  = {
		WIZTAG : "wiz",
		_isEditing : false,
		_curObj : null,
		//初始化 html （主要用于处理 <a><span> ）
		initHtml : function(content){
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
		recoverHtml : function(content){
			if (!content || !content.get(0)) {
				return;
			}
			var aList = content.find(zCatchTextNode.WIZTAG), i, j, aObj;
			for(i=0,j=aList.length; i<j; i++) {
				zCatchTextNode.recoverWiz(aList[i]);
			}
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
				if (isChild) {
					zCatchTextNode._curObj = textNode;
					e.data.callback.apply(this, [textNode]);
				} else if (eObj.children.length == 0){
					zCatchTextNode._curObj = eObj;
					e.data.callback.apply(this, [eObj]);
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
		zCatchTextNode.initHtml(this);
		this.bind("click", {callback:options.callback.getNode}, zCatchTextNode.handler.onClick);
	}
	//停止编辑
	$.fn.wizEditorStop = function() {
		if (!this.get(0)) {
			return;
		}
		zCatchTextNode._isEditing = false;
		zCatchTextNode._curObj = null;
		zCatchTextNode.recoverHtml(this);
		this.unbind("click", zCatchTextNode.handler.onClick);
	}
	//编辑内容更改
	$.fn.wizEditorUpdate = function(txt) {
		zCatchTextNode.updateText(txt)
	}
	//编辑当前状态取消
	$.fn.wizEditorReset = function() {
		zCatchTextNode.resetEdit();
	}
})(jQuery)