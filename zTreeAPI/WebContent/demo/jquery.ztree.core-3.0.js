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
			r[treeId] = r;
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
			c[treeId] = c;
		}
		c.nodes = [];
		c.doms = [];
	},
	_initNode = function(n) {
		if (!n) return;
		
	},
	_init = {
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [],
		roots: [_initRoot]
	};

	function initTreeNodes(setting, level, treeNodes, parentNode) {
		if (!treeNodes) return;

		var zTreeHtml = appendTreeNodes(setting, level, treeNodes, parentNode);
		if (!parentNode) {
			setting.treeObj.append(zTreeHtml.join(''));
		} else {
			$("#" + parentNode.tId + IDMark_Ul).append(zTreeHtml.join(''));
		}
//		repairParentChkClassWithSelf(setting, parentNode);
//		createCallback(setting, treeNodes);
	}

	function appendTreeNodes(setting, level, treeNodes, parentNode) {
		if (!treeNodes) return [];
		var html = [];
		for (var i = 0, l = treeNodes.length; i < l; i++) {
			var node = treeNodes[i];
			node.level = level;
			node.tId = setting.treeId + "_" + (++zId);
			node.parentNode = parentNode;
			node[setting.checkedCol] = !!node[setting.checkedCol];
			node.checkedOld = node[setting.checkedCol];
			node.check_Focus = false;
			node.check_True_Full = true;
			node.check_False_Full = true;
			node.editNameStatus = false;
			node.isAjaxing = null;
			addCache(setting, node);
			fixParentKeyValue(setting, node);

			var tmpParentNode = (parentNode) ? parentNode: setting.root;
			//允许在非空节点上增加节点
			node.isFirstNode = (tmpParentNode[setting.nodesCol].length == treeNodes.length) && (i == 0);
			node.isLastNode = (i == (treeNodes.length - 1));

			if (node[setting.nodesCol] && node[setting.nodesCol].length > 0) {
				node.open = (node.open) ? true: false;
				node.isParent = true;
			} else {
				node.open = false;
				node.isParent = (node.isParent) ? true: false;
			}

			var url = makeNodeUrl(setting, node);
			var fontcss = makeNodeFontCss(setting, node);
			var fontStyle = [];
			for (var f in fontcss) {
				fontStyle.push(f, ":", fontcss[f], ";");
			}

			var childHtml = [];
			if (node[setting.nodesCol] && node[setting.nodesCol].length > 0) {
				childHtml = appendTreeNodes(setting, level + 1, node[setting.nodesCol], node);
			}
			html.push("<li id='", node.tId, "' treenode>",
				"<button type='button' id='", node.tId, IDMark_Switch,
				"' title='' class='", makeNodeLineClass(setting, node), "' treeNode", IDMark_Switch," onfocus='this.blur();'></button>");
			if (setting.checkable) {
				makeChkFlag(setting, node);
				if (setting.checkStyle == Check_Style_Radio && setting.checkRadioType == Radio_Type_All && node[setting.checkedCol] ) {
					setting.checkRadioCheckedList = setting.checkRadioCheckedList.concat([node]);
				}
				html.push("<button type='button' ID='", node.tId, IDMark_Check, "' class='", makeChkClass(setting, node), "' treeNode", IDMark_Check," onfocus='this.blur();' ",(node.nocheck === true?"style='display:none;'":""),"></button>");
			}
			html.push("<a id='", node.tId, IDMark_A, "' treeNode", IDMark_A," onclick=\"", (node.click || ''),
				"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",makeNodeTarget(node),"' style='", fontStyle.join(''),
				"'><button type='button' id='", node.tId, IDMark_Icon,
				"' title='' treeNode", IDMark_Icon," onfocus='this.blur();' class='", makeNodeIcoClass(setting, node), "' style='", makeNodeIcoStyle(setting, node), "'></button><span id='", node.tId, IDMark_Span,
				"'>",node[setting.nameCol].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),"</span></a><ul id='", node.tId, IDMark_Ul, "' class='", makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
			html.push(childHtml.join(''));
			html.push("</ul></li>");
		}
		return html;
	}

	$.fn.zTree = {
		_z : {
			tools: {
				apply: function(fun, param, defaultValue) {
					if ((typeof fun) == "function") {
						return fun.apply(tools, param);
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
					while (curDom && curDom.id !== setting.treeObjId) {
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
				initCache: function(treeId) {
					for (var i=0, j=_init.caches.length; i<j; i++) {
						_init.caches[i].apply(this, arguments);
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
		init: function(obj, zSetting, zNodes) {
			var setting = zt._z.tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeId = $(obj).attr("id");
			setting.treeObj = $(obj);
			setting.treeObj.empty();
			settings[setting.treeId] = setting;

			zt._z.data.initRoot(setting.treeId);
			var root = roots[setting.treeId];
			zNodes = zNodes ? (zt._z.tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
//				root.childs = transformTozTreeFormat(setting, zNodes);
			} else {
				root.childs = zNodes;
			}
			
			zt._z.data.initCache(setting.treeId);

			if (root.childs && root.childs.length > 0) {
				_initTreeNodes(setting, 0, root.childs);
			} else if (setting.async && setting.asyncUrl && setting.asyncUrl.length > 0) {
//				asyncGetNode(setting);
			}

		}
	};

	var zt = $.fn.zTree;
})(jQuery);