/*
 * Simple Editor for Android (can't support the contenteditable)
 **/
var zWizContentSelector = "body";
var zWizEditorCallback = {
	callback : {
		getDomImg : function(src) {
			window.WizNote.onEditorClickImage(src);
//			alert(src);
		},
		getDomTxt : function(txt) {
			window.WizNote.onEditorClickText(txt);
//			alert(txt);
		}
	}
};

(function($){
	var zCatchTextNode  = {
		WIZTAG : "wiz",
		WIZTAG_RegExp : /<wiz>|<\/wiz>/ig,
		IMG_BORDER : "solid yellow",
		_isEditing : false,
		_main : null,
		_curObj : null,
		//init html ( for: <a><span> )
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
		//recover the html (for: <a><span>)
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
		//get html's innerHTML
		getHTML : function() {
			return zCatchTextNode._main.html().replace(zCatchTextNode.WIZTAG_RegExp, "");
		},
		//init TextNode in <a>
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
		//init TextNode in <span>, if the <span> has ElementNodes
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
		//recover <wiz> to textNode
		recoverWiz : function(sObj) {
			if (!sObj) {
				return;
			}
			sObj.parentNode.insertBefore(sObj.childNodes[0], sObj.nextSibling);
			sObj.parentNode.removeChild(sObj);
		},
		//update Text
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
		//update the image
		updateImg : function(img) {
			if (!zCatchTextNode._isEditing || !zCatchTextNode._curObj) {
				return;
			}
			if (!img.src) {
				zCatchTextNode._curObj.parentNode.removeChild(zCatchTextNode._curObj);
			} else {
				var imgObj = zCatchTextNode._curObj;
				imgObj.src = img.src;

			}
			zCatchTextNode.resetEdit();
		},
		//reset the Edit status
		resetEdit : function() {
			zCatchTextNode._isEditing = true;
			if (zCatchTextNode._curObj && zCatchTextNode._curObj.tagName && zCatchTextNode._curObj.tagName.toLowerCase() == "img") {
				zCatchTextNode._curObj.style.border = "";
			}
			zCatchTextNode._curObj = null;
		},
		handler : {
			//click the DOM
			onClick: function(e) {
				var textNode = window.getSelection().baseNode,
				eObj = e.target,
				children = eObj.childNodes,
				isChild = false, i,j, lastNode, tmpObj, tmpOffset, tmpX, tmpY;

				if (zCatchTextNode._curObj) {
					zCatchTextNode.resetEdit();
				}

				if (eObj.tagName.toLowerCase() == "img") {
					//img
					eObj.style.border = zCatchTextNode.IMG_BORDER;
					zCatchTextNode._curObj = eObj;
					e.data.callback.apply(this, [eObj]);

				} else {
					//html
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
	 * regist jQuery Fn
	 */
	//start to edit
	$.fn.wizEditorStart = function(options) {
		if (!this.get(0) || !!zCatchTextNode._isEditing) {
			return;
		}
		zCatchTextNode.resetEdit();
		zCatchTextNode._main = this;
		zCatchTextNode.initHtml();
		this.bind("click", {callback:function(obj){
			if (typeof obj == "string") {
				options.callback.getDomTxt.apply(this, [obj]);
			} else {
				options.callback.getDomImg.apply(this, [obj.src]);
			}
		}}, zCatchTextNode.handler.onClick);
	}
	//stop to edit
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
	//get html
	window.zWizEditorGetHtml = function(txt) {
		return zCatchTextNode.getHTML();
	}
	//update text
	window.zWizEditorUpdateText = function(txt) {
		zCatchTextNode.updateText(txt);
	}
	//update image
	window.zWizEditorUpdateImg = function(img) {
		zCatchTextNode.updateImg(img);
	}
	//cancel the edited status
	window.zWizEditorReset = function() {
		zCatchTextNode.resetEdit();
	}
})(jQuery);

$(zWizContentSelector).wizEditorStart(zWizEditorCallback);