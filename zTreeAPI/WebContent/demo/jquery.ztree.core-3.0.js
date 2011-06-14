/*
 * JQuery zTree core 3.0
 * http://code.google.com/p/jquerytree/
 *
 * Copyright (c) 2010 Hunter.z (baby666.cn)
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2011-06-01
 */
(function($){
	var settings = [], roots = [], caches = [], zId = 0,
	_setting = {
		treeId: "",
		treeObj: null,
		view: {
			showLine: true,
			showIcon: true,
			urlEnable: true,
			expandSpeed: "fast",
			addHoverDom: null,
			removeHoverDom: null,
			addDiyDom: null,
			fontCss: {}
		},
		data: {
			key: {
				name: "name",
				childs: "childs"
			},
			simpleData: {
				enable: false,
				idKey: "id",
				pIdKey: "pId",
				rootPid: null
			}
		},
		async: {
			enable: false,
			method: "post",
			dataType: "text",
			url: "",
			autoParam: [],
			otherParam: [],
			dataFilter: null
		},
		callback: {
			beforeAsync:null,
			beforeClick:null,
			beforeRightClick:null,
			beforeMouseDown:null,
			beforeMouseUp:null,
			beforeExpand:null,
			beforeCollapse:null,

			onAsyncError:null,
			onAsyncSuccess:null,
			onNodeCreated:null,
			onClick:null,
			onRightClick:null,
			onMouseDown:null,
			onMouseUp:null,
			onExpand:null,
			onCollapse:null
		}
	},
	_initRoot = function (treeId) {
		var r = roots[treeId];
		if (!r) {
			r = {};
			roots[treeId] = r;
		}
		r.childs = [];
		r.expandTriggerFlag = false;
		r.curSelectedList = [];
		r.curEditNode = null;
	},
	_initCache = function(treeId) {
		var c = caches[treeId];
		if (!c) {
			c = {};
			caches[treeId] = c;
		}
		c.nodes = [];
		c.doms = [];
	},
	_initNode = function(setting, level, n, parentNode, preNode, nextNode) {
		if (!n) return;
		var childsKey = setting.data.key.childs;
		n.level = level;
		n.tId = setting.treeId + "_" + (++zId);
		n.parentTId = parentNode ? parentNode.tId : null;
		n.getParentNode = function() {return zt._z.data.getNodeCache(setting, n.parentTId);};
		fixPIdKeyValue(setting, n);
		if (n[childsKey] && n[childsKey].length > 0) {
			n.open = !!n.open;
			n.isParent = true;
		} else {
			n.open = false;
			n.isParent = !!n.isParent;
		}
		n.isFirstNode = (!preNode);
		n.isLastNode = (!nextNode);
		n.preTId = preNode ? preNode.tId : null;
		n.getPreNode = function() {return zt._z.data.getNodeCache(setting, n.preTId);};
		n.nextTId = nextNode ? nextNode.tId : null;
		n.getNextNode = function() {return zt._z.data.getNodeCache(setting, n.nextTId);};

//		n[setting.checkedCol] = !!node[setting.checkedCol];
//		n.checkedOld = node[setting.checkedCol];
//		n.check_Focus = false;
//		n.check_True_Full = true;
//		n.check_False_Full = true;
//		n.editNameStatus = false;
//		n.isAjaxing = null;
	},
	_init = {
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [],
		roots: [_initRoot]
	};
	
	function createTreeNodes(setting, level, nodes, parentNode) {
		if (!nodes) return;

		var zTreeHtml = appendTreeNodes(setting, level, nodes, parentNode);
		if (!parentNode) {
			setting.treeObj.append(zTreeHtml.join(''));
		} else {
			$("#" + parentNode.tId + IDMark_Ul).append(zTreeHtml.join(''));
		}
//		repairParentChkClassWithSelf(setting, parentNode);
//		createCallback(setting, treeNodes);
	}

	function appendTreeNodes(setting, level, nodes, parentNode) {
		if (!nodes) return [];
		var html = [];
		var childsKey = setting.data.key.childs;
		for (var i = 0, l = nodes.length; i < l; i++) {
			var node = nodes[i];
			var tmpPNode = (parentNode) ? parentNode: getRoot(setting);
			var tmpPChilds = tmpPNode[childsKey]
			var preNode = ((tmpPChilds.length == nodes.length) && (i == 0)) ? null : ((i == 0)? tmpPChilds[tmpPChilds.length - nodes.length - 1] : nodes[i-1]),
			nextNode = (i == (nodes.length - 1)) ? null : nodes[i+1];

			zt._z.data.initNode(setting, level, node, parentNode, preNode, nextNode);
			zt._z.data.addNodeCache(setting, node);

			var url = makeNodeUrl(setting, node);
			var fontcss = makeNodeFontCss(setting, node);
			var fontStyle = [];
			for (var f in fontcss) {
				fontStyle.push(f, ":", fontcss[f], ";");
			}
//
//			var childHtml = [];
//			if (node[setting.nodesCol] && node[setting.nodesCol].length > 0) {
//				childHtml = appendTreeNodes(setting, level + 1, node[setting.nodesCol], node);
//			}
//			html.push("<li id='", node.tId, "' treenode>",
//				"<button type='button' id='", node.tId, IDMark_Switch,
//				"' title='' class='", makeNodeLineClass(setting, node), "' treeNode", IDMark_Switch," onfocus='this.blur();'></button>");
//			if (setting.checkable) {
//				makeChkFlag(setting, node);
//				if (setting.checkStyle == Check_Style_Radio && setting.checkRadioType == Radio_Type_All && node[setting.checkedCol] ) {
//					setting.checkRadioCheckedList = setting.checkRadioCheckedList.concat([node]);
//				}
//				html.push("<button type='button' ID='", node.tId, IDMark_Check, "' class='", makeChkClass(setting, node), "' treeNode", IDMark_Check," onfocus='this.blur();' ",(node.nocheck === true?"style='display:none;'":""),"></button>");
//			}
//			html.push("<a id='", node.tId, IDMark_A, "' treeNode", IDMark_A," onclick=\"", (node.click || ''),
//				"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",makeNodeTarget(node),"' style='", fontStyle.join(''),
//				"'><button type='button' id='", node.tId, IDMark_Icon,
//				"' title='' treeNode", IDMark_Icon," onfocus='this.blur();' class='", makeNodeIcoClass(setting, node), "' style='", makeNodeIcoStyle(setting, node), "'></button><span id='", node.tId, IDMark_Span,
//				"'>",node[setting.nameCol].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),"</span></a><ul id='", node.tId, IDMark_Ul, "' class='", makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
//			html.push(childHtml.join(''));
//			html.push("</ul></li>");
		}
		return html;
	}

	function fixPIdKeyValue(setting, node) {
		if (setting.data.simpleData.enable) {
			node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPid;
		}
	}

	function getRoot(setting) {
		return roots[setting.treeId];
	}

	function makeNodeFontCss(setting, node) {
		var fontCss = zt._z.tools.apply(setting.fontCss, [setting.treeId, node], setting.fontCss);
		if (fontCss && ((typeof fontCss) != "function")) {
			return fontCss;
		} else {
			return {};
		}
	}

	function makeNodeUrl(setting, treeNode) {
		return (treeNode.url && setting.view.urlEnable) ? treeNode.url : null;
	}
	
	$.fn.zTree = {
		_z : {
			tools: {
				apply: function(fun, param, defaultValue) {
					if ((typeof fun) == "function") {
						return fun.apply(zt, param);
					}
					return defaultValue;
				},
				clone: function (jsonObj) {
					var buf;
					if (jsonObj instanceof Array) {
						buf = [];
						var i = jsonObj.length;
						while (i--) {
							buf[i] = arguments.callee(jsonObj[i]);
						}
						return buf;
					}else if (typeof jsonObj == "function"){
						return jsonObj;
					}else if (jsonObj instanceof Object){
						buf = {};
						for (var k in jsonObj) {
							if (k!="parentNode") {
								buf[k] = arguments.callee(jsonObj[k]);
							}
						}
						return buf;
					}else{
						return jsonObj;
					}
				},
				eqs: function(str1, str2) {
					return str1.toLowerCase() === str2.toLowerCase();
				},
				exSetting: function(s) {
					$.extend(true, _setting, s);
				},
				inputFocus: function(inputObj) {
					if (inputObj.get(0)) {
						inputObj.focus();
						setCursorPosition(inputObj.get(0), inputObj.val().length);
					}
				},
				isArray: function(arr) {
					return Object.prototype.toString.apply(arr) === "[object Array]";
				},
				getAbs: function (obj) {
					//获取对象的绝对坐标
					oRect = obj.getBoundingClientRect();
					return [oRect.left,oRect.top]
				},
				getMDom: function (setting, curDom, targetExpr) {
					if (!curDom) return null;
					while (curDom && curDom.id !== setting.treeId) {
						for (var i=0, l=targetExpr.length; curDom.tagName && i<l; i++) {
							if (tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
								return curDom;
							}
						}
						curDom = curDom.parentNode;
					}
					return null;
				},
				noSel: function() {
					//除掉默认事件，防止文本被选择
					window.getSelection ? window.getSelection().removeAllRanges() : setTimeout(function(){
						document.selection.empty();
					}, 10);
				}
			},
			view: {

			},
			event: {

			},
			data: {
				addNodeCache: function(setting, node) {
					caches[setting.treeId].nodes[node.tId] = node;
				},
				getNodeCache: function(setting, tId) {
					var n = caches[setting.treeId].nodes[tId];
					return n ? n : null;
				},
				initCache: function(treeId) {
					for (var i=0, j=_init.caches.length; i<j; i++) {
						_init.caches[i].apply(this, arguments);
					}
				},
				initNode: function(setting, level, node, parentNode) {
					for (var i=0, j=_init.nodes.length; i<j; i++) {
						_init.nodes[i].apply(this, arguments);
					}
				},
				initRoot: function(treeId) {
					for (var i=0, j=_init.roots.length; i<j; i++) {
						_init.roots[i].apply(this, arguments);
					}
				}
			},
			logic: {
				
			}
		},
		getZTreeObj: function(treeId) {
			var o = settings[treeId];
			return o ? o.treeObj : null;
		},
		init: function(obj, zSetting, zNodes) {
			var setting = zt._z.tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeId = obj.attr("id");
			setting.treeObj = obj;
			setting.treeObj.empty();
			settings[setting.treeId] = setting;

			zt._z.data.initRoot(setting.treeId);
			var root = roots[setting.treeId];
			zNodes = zNodes ? (zt._z.tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
//				root.childs = transformTozTreeFormat(setting, zNodes);
			} else {
				root[setting.data.key.childs] = zNodes;
			}
			
			zt._z.data.initCache(setting.treeId);

			if (root.childs && root.childs.length > 0) {
				createTreeNodes(setting, 0, root.childs);
			} else if (setting.async && setting.asyncUrl && setting.asyncUrl.length > 0) {
//				asyncGetNode(setting);
			}
			obj.zTreeTools ={
				setting: setting
			}

		}
		
	};

	var zt = $.fn.zTree;
})(jQuery);