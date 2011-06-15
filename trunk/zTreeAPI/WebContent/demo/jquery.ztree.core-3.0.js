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
			},
			keep: {
				parent: false,
				leaf: false
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
	_bindEvent = function(setting) {
		var o = setting.treeObj;
		var c = zt.consts.event;
		o.unbind(c.NODECREATED);
		o.bind(c.NODECREATED, function (event, treeId, treeNode) {
			zt._z.tools.apply(setting.callback.nodeCreated, [event, treeId, treeNode]);
		});

		o.unbind(c.CLICK);
		o.bind(c.CLICK, function (event, treeId, treeNode) {
			zt._z.tools.apply(setting.callback.click, [event, treeId, treeNode]);
		});

//		o.unbind(c.CHECK);
//		o.bind(c.CHECK, function (event, treeId, treeNode) {
//			zt._z.tools.apply(setting.callback.change, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.EDITNAME);
//		o.bind(c.EDITNAME, function (event, treeId, treeNode) {
//			zt._z.tools.apply(setting.callback.rename, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.REMOVE);
//		o.bind(c.REMOVE, function (event, treeId, treeNode) {
//			zt._z.tools.apply(setting.callback.remove, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.DRAG);
//		o.bind(c.DRAG, function (event, treeId, treeNode) {
//			zt._z.tools.apply(setting.callback.drag, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.DROP);
//		o.bind(c.DROP, function (event, treeId, treeNode, targetNode, moveType) {
//			zt._z.tools.apply(setting.callback.drop, [event, treeId, treeNode, targetNode, moveType]);
//		});

		o.unbind(c.EXPAND);
		o.bind(c.EXPAND, function (event, treeId, treeNode) {
			zt._z.tools.apply(setting.callback.expand, [event, treeId, treeNode]);
		});

		o.unbind(c.COLLAPSE);
		o.bind(c.COLLAPSE, function (event, treeId, treeNode) {
			zt._z.tools.apply(setting.callback.collapse, [event, treeId, treeNode]);
		});

		o.unbind(c.ASYNC_SUCCESS);
		o.bind(c.ASYNC_SUCCESS, function (event, treeId, treeNode, msg) {
			zt._z.tools.apply(setting.callback.asyncSuccess, [event, treeId, treeNode, msg]);
		});

		o.unbind(c.ASYNC_ERROR);
		o.bind(c.ASYNC_ERROR, function (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
			zt._z.tools.apply(setting.callback.asyncError, [event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown]);
		});
	},
	_eventProxy = function(event) {
		var target = event.target;
		var setting = settings[event.data.treeId];
		var relatedTarget = event.relatedTarget;
		var tId = "";
		var nodeEventType = "", treeEventType = "";
		var nodeEventCallback = null, treeEventCallback = null;
		var tmp = null;
		var tools = zt._z.tools;
		var root = getRoot(setting);

		if (tools.eqs(event.type, "mouseover")) {
//			if (setting.checkable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+IDMark_Check) !== null) {
//				tId = target.parentNode.id;
//				nodeEventType = "mouseoverCheck";
//			} else {
//				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+IDMark_A}]);
//				if (tmp) {
//					tId = tmp.parentNode.id;
//					nodeEventType = "hoverOverNode";
//				}
//			}
		} else if (tools.eqs(event.type, "mouseout")) {
//			if (setting.checkable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+IDMark_Check) !== null) {
//				tId = target.parentNode.id;
//				nodeEventType = "mouseoutCheck";
//			} else {
//				tmp = tools.getMDom(setting, relatedTarget, [{tagName:"a", attrName:"treeNode"+IDMark_A}]);
//				if (!tmp) {
//					tId = "remove";
//					nodeEventType = "hoverOutNode";
//				}
//			}
		} else if (tools.eqs(event.type, "mousedown")) {
//			treeEventType = "mousedown";
//			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+IDMark_A}]);
//			if (tmp) {
//				tId = tmp.parentNode.id;
//				nodeEventType = "mousedownNode";
//			}
		} else if (tools.eqs(event.type, "mouseup")) {
//			treeEventType = "mouseup";
//			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+IDMark_A}]);
//			if (tmp) {tId = tmp.parentNode.id;}
		} else if (tools.eqs(event.type, "contextmenu")) {
//			treeEventType = "contextmenu";
//			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+IDMark_A}]);
//			if (tmp) {tId = tmp.parentNode.id;}
		} else if (tools.eqs(event.type, "click")) {
			if (tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ zt.consts.id.SWITCH) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "switchNode";
//			} else if (setting.checkable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+IDMark_Check) !== null) {
//				tId = target.parentNode.id;
//				nodeEventType = "checkNode";
			} else {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+ zt.consts.id.A}]);
				if (tmp) {
					tId = tmp.parentNode.id;
					nodeEventType = "clickNode";
				}
			}
		} else if (tools.eqs(event.type, "dblclick")) {
//			treeEventType = "dblclick";
//			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+IDMark_A}]);
//			if (tmp) {
//				tId = tmp.parentNode.id;
//				nodeEventType = "switchNode";
//			}
		}

//		if (tId.length>0 || treeEventType.length>0) {
//			if (nodeEventType!="hoverOverNode" && nodeEventType != "hoverOutNode"
//				&& nodeEventType!="mouseoverCheck" && nodeEventType != "mouseoutCheck"
//				&& target.getAttribute("treeNode"+IDMark_Input) === null
//				&& !st.checkEvent(setting)) return false;
//		}
		if (tId.length>0) {
//			if (!(root.curTreeNode && setting.curTreeNode.editNameStatus)) {
//				tools.noSel();
//			}
			event.data.treeNode = zt._z.data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "switchNode" :
					nodeEventCallback = handler.onSwitchNode;
					break;
				case "clickNode" :
					nodeEventCallback = handler.onClickNode;
					break;
//				case "checkNode" :
//					handler.onCheckNode(event);
//					break;
//				case "mouseoverCheck" :
//					handler.onMouseoverCheck(event);
//					break;
//				case "mouseoutCheck" :
//					handler.onMouseoutCheck(event);
//					break;
//				case "mousedownNode" :
//					handler.onMousedownNode(event);
//					break;
//				case "hoverOverNode" :
//					handler.onHoverOverNode(event);
//					break;
//				case "hoverOutNode" :
//					handler.onHoverOutNode(event);
//					break;
			}
		} else {
			event.data.treeNode = null;
		}
//		switch (treeEventType) {
//			case "mousedown" :
//				return handler.onZTreeMousedown(event);
//				break;
//			case "mouseup" :
//				return handler.onZTreeMouseup(event);
//				break;
//			case "dblclick" :
//				return handler.onZTreeDblclick(event);
//				break;
//			case "contextmenu" :
//				return handler.onZTreeContextmenu(event);
//				break;
//		}
		var proxyResult = {
			stop: false,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
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
		n.isAjaxing = false;
//		n[setting.checkedCol] = !!node[setting.checkedCol];
//		n.checkedOld = node[setting.checkedCol];
//		n.check_Focus = false;
//		n.check_True_Full = true;
//		n.check_False_Full = true;
//		n.editNameStatus = false;
//		n.isAjaxing = null;
	},
	_init = {
		bind: [_bindEvent],
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [_eventProxy],
		roots: [_initRoot]
	};

	var handler = {
		onSwitchNode: function (event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;

			if (node.open) {
				if (zt._z.tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return;
				getRoot(setting).expandTriggerFlag = true;
				switchNode(setting, node);
			} else {
				if (zt._z.tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return;
				getRoot(setting).expandTriggerFlag = true;
				switchNode(setting, node);
			}
		},
		onClickNode: function (event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;
			if (zt._z.tools.apply(setting.callback.beforeClick, [setting.treeId, node], true) == false) return;
			selectNode(setting, node);
			setting.treeObj.trigger(zt.consts.event.CLICK, [setting.treeId, node]);
		}
	};

	function addNodes(setting, parentNode, newNodes, isSilent) {
		if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
			return;
		}
		if (setting.data.simpleData.enable) {
			newNodes = transformTozTreeFormat(setting, newNodes);
		}
		if (parentNode) {
			if (setting.treeObj.find("#" + parentNode.tId).length == 0) return;

			var target_switchObj = $("#" + parentNode.tId + zt.consts.id.SWITCH);
			var target_icoObj = $("#" + parentNode.tId + zt.consts.id.ICON);
			var target_ulObj = $("#" + parentNode.tId + zt.consts.id.UL);

			if (!parentNode.open) {
				replaceSwitchClass(target_switchObj, zt.consts.folder.CLOSE);
				replaceIcoClass(parentNode, target_icoObj, zt.consts.folder.CLOSE);
				parentNode.open = false;
				target_ulObj.css({"display": "none"});
			}

			addTreeNodesData(setting, parentNode, newNodes);
			createNodes(setting, parentNode.level + 1, newNodes, parentNode);
			if (!isSilent) {
				expandCollapseParentNode(setting, parentNode, true);
			}
		} else {
			addTreeNodesData(setting, getRoot(setting), newNodes);
			createNodes(setting, 0, newNodes, null);
		}
	}

	function addTreeNodesData(setting, parentNode, nodes) {
		var childsKey = setting.data.key.childs;
		if (!parentNode[childsKey]) parentNode[childsKey] = [];
		if (parentNode[childsKey].length > 0) {
			parentNode[childsKey][parentNode[childsKey].length - 1].isLastNode = false;
			setNodeLineIcos(setting, parentNode[childsKey][parentNode[childsKey].length - 1]);
		}
		parentNode.isParent = true;
		parentNode[childsKey] = parentNode[childsKey].concat(nodes);
	}

	function appendTreeNodes(setting, level, nodes, parentNode) {
		if (!nodes) return [];
		var html = [];
		var childsKey = setting.data.key.childs;
		var nameKey = setting.data.key.name;
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

			var childHtml = [];
			if (node[childsKey] && node[childsKey].length > 0) {
				childHtml = appendTreeNodes(setting, level + 1, node[childsKey], node);
			}
			html.push("<li id='", node.tId, "' treenode>",
				"<button type='button' id='", node.tId, zt.consts.id.SWITCH,
				"' title='' class='", makeNodeLineClass(setting, node), "' treeNode", zt.consts.id.SWITCH," onfocus='this.blur();'></button>");
			//beforeA()
//			if (setting.checkable) {
//				makeChkFlag(setting, node);
//				if (setting.checkStyle == Check_Style_Radio && setting.checkRadioType == Radio_Type_All && node[setting.checkedCol] ) {
//					setting.checkRadioCheckedList = setting.checkRadioCheckedList.concat([node]);
//				}
//				html.push("<button type='button' ID='", node.tId, IDMark_Check, "' class='", makeChkClass(setting, node), "' treeNode", IDMark_Check," onfocus='this.blur();' ",(node.nocheck === true?"style='display:none;'":""),"></button>");
//			}
			html.push("<a id='", node.tId, zt.consts.id.A, "' treeNode", zt.consts.id.A," onclick=\"", (node.click || ''),
				"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",makeNodeTarget(node),"' style='", fontStyle.join(''),
				"'><button type='button' id='", node.tId, zt.consts.id.ICON,
				"' title='' treeNode", zt.consts.id.ICON," onfocus='this.blur();' class='", makeNodeIcoClass(setting, node), "' style='", makeNodeIcoStyle(setting, node), "'></button><span id='", node.tId, zt.consts.id.SPAN,
				"'>",node[nameKey].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),"</span></a><ul id='", node.tId, zt.consts.id.UL, "' class='", makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
			html.push(childHtml.join(''));
			html.push("</ul></li>");
		}
		return html;
	}

	function asyncGetNode(setting, node) {
		var i, l;
		if (node && (node.isAjaxing || !node.isParent)) {
			return;
		}
		if (node) {
			node.isAjaxing = true;
			var icoObj = $("#" + node.tId + zt.consts.id.ICON);
			icoObj.attr("class", "ico_loading");
		}

		var tmpParam = "";
		for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
			tmpParam += (tmpParam.length > 0 ? "&": "") + setting.async.autoParam[i] + "=" + node[setting.async.autoParam[i]];
		}
		if (zt._z.tools.isArray(setting.asyncParamOther)) {
			for (i = 0, l = setting.asyncParamOther.length; i < l; i += 2) {
				tmpParam += (tmpParam.length > 0 ? "&": "") + setting.async.otherParam[i] + "=" + setting.async.otherParam[i + 1];
			}
		} else {
			for (var p in setting.async.otherParam) {
				tmpParam += (tmpParam.length > 0 ? "&" : "") + p + "=" + setting.async.otherParam[p];
			}
		}

		$.ajax({
			type: setting.async.method,
			url: zt._z.tools.apply(setting.async.url, [node], setting.async.url),
			data: tmpParam,
			dataType: setting.async.dataType,
			success: function(msg) {
				var newNodes = [];
				try {
					if (!msg || msg.length == 0) {
						newNodes = [];
					} else if (typeof msg == "string") {
						newNodes = eval("(" + msg + ")");
					} else {
						newNodes = msg;
					}
				} catch(err) {}

				if (node) node.isAjaxing = null;
				setNodeLineIcos(setting, node);
				if (newNodes && newNodes != "") {
					newNodes = zt._z.tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
					addNodes(setting, node, newNodes, false);
				} else {
					addNodes(setting, node, [], false);
				}
				setting.treeObj.trigger(zt.consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getRoot(setting).expandTriggerFlag = false;
				setNodeLineIcos(setting, node);
				if (node) node.isAjaxing = null;
				setting.treeObj.trigger(zt.consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
			}
		});
	}

	function bindTree(setting) {
		var eventParam = {treeId: setting.treeId};
		var o = setting.treeObj;
		o.unbind('click', eventProxy);
		o.bind('click', eventParam, eventProxy);
		o.unbind('dblclick', eventProxy);
		o.bind('dblclick', eventParam, eventProxy);
		o.unbind('mouseover', eventProxy);
		o.bind('mouseover', eventParam, eventProxy);
		o.unbind('mouseout', eventProxy);
		o.bind('mouseout', eventParam, eventProxy);
		o.unbind('mousedown', eventProxy);
		o.bind('mousedown', eventParam, eventProxy);
		o.unbind('mouseup', eventProxy);
		o.bind('mouseup', eventParam, eventProxy);
		o.unbind('contextmenu', eventProxy);
		o.bind('contextmenu', eventParam, eventProxy);
	}

	function createNodes(setting, level, nodes, parentNode) {
		if (!nodes) return;

		var zTreeHtml = appendTreeNodes(setting, level, nodes, parentNode);
		if (!parentNode) {
			setting.treeObj.append(zTreeHtml.join(''));
		} else {
			$("#" + parentNode.tId + zt.consts.id.UL).append(zTreeHtml.join(''));
		}
//		repairParentChkClassWithSelf(setting, parentNode);
		createNodeCallback(setting, nodes);
	}

	function createNodeCallback(setting, nodes) {
		var childsKey = setting.data.key.childs;
		for (var i = 0, l = nodes.length; i < l; i++) {
			var node = nodes[i];
			zt._z.tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
			if (node[childsKey] && node[childsKey].length > 0) {
				createNodeCallback(setting, node[childsKey], node);
			}
		}
	}

	function eventProxy(event) {
//		var proxyResult = {
//			nodeEventType: nodeEventType,
//			nodeEventCallback: nodeEventCallback,
//			treeEventType: treeEventType,
//			treeEventCallback: treeEventCallback
//		};
		var results = zt._z.event.proxy(event);
		for (var i=0, l=results.length; i<l; i++) {
			var proxyResult = results[i];
			if (proxyResult.nodeEventCallback) {
				proxyResult.nodeEventCallback.apply(proxyResult, arguments);
			}
		}
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

	function makeNodeIcoClass(setting, node) {
		var icoCss = ["ico"];
		if (!node.isAjaxing) {
			icoCss[0] = (node.iconSkin ? node.iconSkin : "") + " " + icoCss[0];
			if (node.isParent) {
				icoCss.push(node.open ? zt.consts.folder.OPEN : zt.consts.folder.CLOSE);
			} else {
				icoCss.push(zt.consts.folder.DOCU);
			}
		}
		return icoCss.join('_');
	}

	function makeNodeIcoStyle(setting, node) {
		var icoStyle = [];
		if (!node.isAjaxing) {
			var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node.icon;
			if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
			if (setting.view.showIcon == false || !zt._z.tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
				icoStyle.push("width:0px;height:0px;");
			}
		}
		return icoStyle.join('');
	}

	function makeNodeLineClass(setting, node) {
		var lineClass = ["switch"];
		if (setting.view.showLine) {
			if (node.level == 0 && node.isFirstNode && node.isLastNode) {
				lineClass.push(zt.consts.line.ROOT);
			} else if (node.level == 0 && node.isFirstNode) {
				lineClass.push(zt.consts.line.ROOTS);
			} else if (node.isLastNode) {
				lineClass.push(zt.consts.line.BOTTOM);
			} else {
				lineClass.push(zt.consts.line.CENTER);
			}

		} else {
			lineClass.push(zt.consts.line.NOLINE);
		}
		if (node.isParent) {
			lineClass.push(node.open ? zt.consts.folder.OPEN : zt.consts.folder.CLOSE);
		} else {
			lineClass.push(zt.consts.folder.DOCU);
		}
		return lineClass.join('_');
	}

	function makeNodeTarget(node) {
		return (node.target || "_blank");
	}
	
	function makeNodeUrl(setting, node) {
		return (node.url && setting.view.urlEnable) ? node.url : null;
	}

	function makeUlLineClass(setting, node) {
		return (setting.view.showLine && !node.isLastNode) ?zt.consts.line.LINE : "";
	}

	function setNodeLineIcos(setting, node) {
		if (!node) return;
		var switchObj = $("#" + node.tId + zt.consts.id.SWITCH);
		var ulObj = $("#" + node.tId + zt.consts.id.Ul);
		var icoObj = $("#" + node.tId + zt.consts.id.ICON);

		var ulLine = makeUlLineClass(setting, node);
		if (ulLine.length==0) {
			ulObj.removeClass(zt.consts.line.LINE);
		} else {
			ulObj.addClass(ulLine);
		}

		switchObj.attr("class", makeNodeLineClass(setting, node));
		icoObj.removeAttr("style");
		icoObj.attr("style", makeNodeIcoStyle(setting, node));
		icoObj.attr("class", makeNodeIcoClass(setting, node));
	}

	function transformTozTreeFormat(setting, sNodes) {
		var i,l;
		var key = setting.data.simpleData.idKey;
		var parentKey = setting.data.simpleData.pIdKey;
		var childsKey = setting.data.key.childs;
		if (!key || key=="" || !sNodes) return [];

		if (zt._z.tools.isArray(sNodes)) {
			var r = [];
			var tmpMap = [];
			for (i=0, l=sNodes.length; i<l; i++) {
				tmpMap[sNodes[i][key]] = sNodes[i];
			}
			for (i=0, l=sNodes.length; i<l; i++) {
				if (tmpMap[sNodes[i][parentKey]]) {
					if (!tmpMap[sNodes[i][parentKey]][childsKey])
						tmpMap[sNodes[i][parentKey]][childsKey] = [];
					tmpMap[sNodes[i][parentKey]][childsKey].push(sNodes[i]);
				} else {
					r.push(sNodes[i]);
				}
			}
			return r;
		}else {
			return [sNodes];
		}
	}
	
	$.fn.zTree = {
		consts : {
			event: {
				NODECREATED: "ztree_nodeCreated",
				CLICK: "ztree_click",
				EXPAND: "ztree_expand",
				COLLAPSE: "ztree_collapse",
				ASYNC_SUCCESS: "ztree_async_success",
				ASYNC_ERROR: "ztree_async_error"
//CHECK: "ztree_check",
//DRAG: "ztree_drag",
//DROP: "ztree_drop",
//EDITNAME: "ztree_editname",
//REMOVE: "ztree_rename"
			},
			id: {
				A: "_a",
//				CHECK: "_check",
//				EDIT: "_edit",
				ICON: "_ico",
//				INPUT: "_input",
//				REMOVE: "_remove",
				SPAN: "_span",
				SWITCH: "_switch",
				UL: "_ul"
			},
			line: {
				ROOT: "root",
				ROOTS: "roots",
				CENTER: "center",
				BOTTOM: "bottom",
				NOLINE: "noline",
				LINE: "line"
			},
			folder: {
				OPEN: "open",
				CLOSE: "close",
				DOCU: "docu"
			},
			node: {
				CURSELECTED: "curSelectedNode",
				CURSELECTED_EDIT: "curSelectedNode_Edit",
				TMPTARGET_TREE: "tmpTargetTree",
				TMPTARGET_NODE: "tmpTargetNode"
			}
//			checkbox: {
//				STYLE: "checkbox",
//				DEFAULT: "chk",
//				FALSE: "false",
//				TRUE: "true",
//				FULL: "full",
//				PART: "part",
//				FOCUS: "focus"
//			},
//			radio: {
//				STYLE: "radio",
//				TYPE_ALL: "all",
//				TYPE_LEVEL: "level"
//			},
//			move: {
//				TYPE_INNER: "inner",
//				TYPE_BEFORE: "before",
//				TYPE_AFTER: "after",
//				MINMOVESIZE: 5
//			}
		},
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
					var oRect = obj.getBoundingClientRect();
					return [oRect.left,oRect.top]
				},
				getMDom: function (setting, curDom, targetExpr) {
					if (!curDom) return null;
					while (curDom && curDom.id !== setting.treeId) {
						for (var i=0, l=targetExpr.length; curDom.tagName && i<l; i++) {
							if (zt._z.tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
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
				bindEvent: function(setting) {
					for (var i=0, j=_init.bind.length; i<j; i++) {
						_init.bind[i].apply(this, arguments);
					}
				},
				proxy: function(event) {
					var results = [];
					for (var i=0, j=_init.proxys.length; i<j; i++) {
						var proxyResult = _init.proxys[i].apply(this, arguments);
						results.push(proxyResult);
						if (proxyResult.stop) {
							break;
						}
					}
					return results;
				}
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
				root[setting.data.key.childs] = transformTozTreeFormat(setting, zNodes);
			} else {
				root[setting.data.key.childs] = zNodes;
			}
			
			zt._z.data.initCache(setting.treeId);
			bindTree(setting);
			zt._z.event.bindEvent(setting);
			if (root.childs && root.childs.length > 0) {
				createNodes(setting, 0, root.childs);
			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
				asyncGetNode(setting);
			}
			obj.zTreeTools ={
				setting: setting
			}
		}
	};

	var zt = $.fn.zTree;
})(jQuery);