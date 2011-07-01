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
	_consts = {
		event: {
			NODECREATED: "ztree_nodeCreated",
			CLICK: "ztree_click",
			EXPAND: "ztree_expand",
			COLLAPSE: "ztree_collapse",
			ASYNC_SUCCESS: "ztree_async_success",
			ASYNC_ERROR: "ztree_async_error"
		},
		id: {
			A: "_a",
			ICON: "_ico",
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
			CURSELECTED: "curSelectedNode"
		}
	},
	_setting = {
		treeId: "",
		treeObj: null,
		view: {
			showLine: true,
			showIcon: true,
			selectedMulti: true,
			expandSpeed: "fast",
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
				rootPId: null
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
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		if (!r) {
			r = {};
			data.setRoot(setting, r);
		}
		r.childs = [];
		r.expandTriggerFlag = false;
		r.curSelectedList = [];
		r.noSelection = true;
	},
	_initCache = function(setting) {
		var c = data.getCache(setting);
		if (!c) {
			c = {};
			data.setCache(setting, c);
		}
		c.nodes = [];
		c.doms = [];
	},
	_bindEvent = function(setting) {
		var o = setting.treeObj;
		var c = consts.event;
		o.unbind(c.NODECREATED);
		o.bind(c.NODECREATED, function (event, treeId, node) {
			tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
		});

		o.unbind(c.CLICK);
		o.bind(c.CLICK, function (event, treeId, node) {
			tools.apply(setting.callback.onClick, [event, treeId, node]);
		});

		o.unbind(c.EXPAND);
		o.bind(c.EXPAND, function (event, treeId, node) {
			tools.apply(setting.callback.onExpand, [event, treeId, node]);
		});

		o.unbind(c.COLLAPSE);
		o.bind(c.COLLAPSE, function (event, treeId, node) {
			tools.apply(setting.callback.onCollapse, [event, treeId, node]);
		});

		o.unbind(c.ASYNC_SUCCESS);
		o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
			tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg]);
		});

		o.unbind(c.ASYNC_ERROR);
		o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
			tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown]);
		});
	},
	_eventProxy = function(event) {
		var target = event.target;
		var setting = settings[event.data.treeId];
		var tId = "", node = null;
		var nodeEventType = "", treeEventType = "";
		var nodeEventCallback = null, treeEventCallback = null;
		var tmp = null;

		if (tools.eqs(event.type, "mousedown")) {
			treeEventType = "mousedown";
		} else if (tools.eqs(event.type, "mouseup")) {
			treeEventType = "mouseup";
		} else if (tools.eqs(event.type, "contextmenu")) {
			treeEventType = "contextmenu";
		} else if (tools.eqs(event.type, "click")) {
			if (tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.SWITCH) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "switchNode";
			} else {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tmp.parentNode.id;
					nodeEventType = "clickNode";
				}
			}
		} else if (tools.eqs(event.type, "dblclick")) {
			treeEventType = "dblclick";
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tmp.parentNode.id;
				nodeEventType = "switchNode";
			}
		}
		if (treeEventType.length > 0 && tId.length == 0) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {tId = tmp.parentNode.id;}
		}

		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "switchNode" :
					nodeEventCallback = handler.onSwitchNode;
					break;
				case "clickNode" :
					nodeEventCallback = handler.onClickNode;
					break;
			}
		}
		switch (treeEventType) {
			case "mousedown" :
				treeEventCallback = handler.onZTreeMousedown;
				break;
			case "mouseup" :
				treeEventCallback = handler.onZTreeMouseup;
				break;
			case "dblclick" :
				treeEventCallback = handler.onZTreeDblclick;
				break;
			case "contextmenu" :
				treeEventCallback = handler.onZTreeContextmenu;
				break;
		}
		var proxyResult = {
			stop: false,
			node: node,
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
		n.getParentNode = function() {return data.getNodeCache(setting, n.parentTId);};
		data.fixPIdKeyValue(setting, n);
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
		n.getPreNode = function() {return data.getNodeCache(setting, n.preTId);};
		n.nextTId = nextNode ? nextNode.tId : null;
		n.getNextNode = function() {return data.getNodeCache(setting, n.nextTId);};
		n.isAjaxing = false;
	},
	_init = {
		bind: [_bindEvent],
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [_eventProxy],
		roots: [_initRoot],
		beforeA: [],
		afterA: [],
		innerBeforeA: [],
		innerAfterA: [],
		zTreeTools: []
	};

	var data = {
		addNodeCache: function(setting, node) {
			data.getCache(setting).nodes[node.tId] = node;
		},
		addAfterA: function(afterA) {
			_init.afterA.push(afterA);
		},
		addBeforeA: function(beforeA) {
			_init.beforeA.push(beforeA);
		},
		addInnerAfterA: function(innerAfterA) {
			_init.innerAfterA.push(innerAfterA);
		},
		addInnerBeforeA: function(innerBeforeA) {
			_init.innerBeforeA.push(innerBeforeA);
		},
		addInitBind: function(bindEvent) {
			_init.bind.push(bindEvent);
		},
		addInitCache: function(initCache) {
			_init.caches.push(initCache);
		},
		addInitNode: function(initNode) {
			_init.nodes.push(initNode);
		},
		addInitProxy: function(initProxy) {
			_init.proxys.push(initProxy);
		},
		addInitRoot: function(initRoot) {
			_init.roots.push(initRoot);
		},
		addNodesData: function(setting, parentNode, nodes) {
			var childsKey = setting.data.key.childs;
			if (!parentNode[childsKey]) parentNode[childsKey] = [];
			if (parentNode[childsKey].length > 0) {
				parentNode[childsKey][parentNode[childsKey].length - 1].isLastNode = false;
				view.setNodeLineIcos(setting, parentNode[childsKey][parentNode[childsKey].length - 1]);
			}
			parentNode.isParent = true;
			parentNode[childsKey] = parentNode[childsKey].concat(nodes);
		},
		addSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			if (!data.isSelectedNode(setting, node)) {
				root.curSelectedList.push(node);
			}
		},
		addZTreeTools: function(zTreeTools) {
			_init.zTreeTools.push(zTreeTools);
		},
		exSetting: function(s) {
			$.extend(true, _setting, s);
		},
		fixPIdKeyValue: function(setting, node) {
			if (setting.data.simpleData.enable) {
				node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId;
			}
		},
		getAfterA: function(setting, node, array) {
			for (var i=0, j=_init.afterA.length; i<j; i++) {
				_init.afterA[i].apply(this, arguments);
			}
		},
		getBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.beforeA.length; i<j; i++) {
				_init.beforeA[i].apply(this, arguments);
			}
		},
		getInnerAfterA: function(setting, node, array) {
			for (var i=0, j=_init.innerAfterA.length; i<j; i++) {
				_init.innerAfterA[i].apply(this, arguments);
			}
		},
		getInnerBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.innerBeforeA.length; i<j; i++) {
				_init.innerBeforeA[i].apply(this, arguments);
			}
		},
		getCache: function(setting) {
			return caches[setting.treeId];
		},
		getNodeByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return null;
			var childsKey = setting.data.key.childs;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					return nodes[i];
				}
				var tmp = data.getNodeByParam(setting, nodes[i][childsKey], key, value);
				if (tmp) return tmp;
			}
			return null;
		},
		getNodeCache: function(setting, tId) {
			if (!tId) return null;
			var n = caches[setting.treeId].nodes[tId];
			return n ? n : null;
		},
		getNodes: function(setting) {
			return data.getRoot(setting)[setting.data.key.childs];
		},
		getNodesByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childsKey = setting.data.key.childs;
			var result = [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParam(setting, nodes[i][childsKey], key, value));
			}
			return result;
		},
		getNodesByParamFuzzy: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childsKey = setting.data.key.childs;
			var result = [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (typeof nodes[i][key] == "string" && nodes[i][key].indexOf(value)>-1) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParamFuzzy(setting, nodes[i][childsKey], key, value));
			}
			return result;
		},
		getRoot: function(setting) {
			return roots[setting.treeId];
		},
		getSetting: function(treeId) {
			return settings[treeId];
		},
		getSettings: function() {
			return settings;
		},
		getZTreeTools: function(setting, obj) {
			for (var i=0, j=_init.zTreeTools.length; i<j; i++) {
				_init.zTreeTools[i].apply(this, arguments);
			}
		},
		initCache: function(setting) {
			for (var i=0, j=_init.caches.length; i<j; i++) {
				_init.caches[i].apply(this, arguments);
			}
		},
		initNode: function(setting, level, node, parentNode) {
			for (var i=0, j=_init.nodes.length; i<j; i++) {
				_init.nodes[i].apply(this, arguments);
			}
		},
		initRoot: function(setting) {
			for (var i=0, j=_init.roots.length; i<j; i++) {
				_init.roots[i].apply(this, arguments);
			}
		},
		isSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i]) return true;
			}
			return false;
		},
		removeNodeCache: function(setting, node) {			
			delete data.getCache(setting).nodes[node.tId];
		},
		removeSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i]) {
					root.curSelectedList.splice(i, 1);
					break;
				}
			}
		},
		setCache: function(setting, cache) {
			caches[setting.treeId] = cache;
		},
		setRoot: function(setting, root) {
			roots[setting.treeId] = root;
		},
		transformToArrayFormat: function (setting, nodes) {
			if (!nodes) return [];
			var childsKey = setting.data.key.childs;
			var r = [];
			if (tools.isArray(nodes)) {
				for (var i=0, l=nodes.length; i<l; i++) {
					r.push(nodes[i]);
					if (nodes[i][childsKey])
						r = r.concat(data.transformToArrayFormat(setting, nodes[i][childsKey]));
				}
			} else {
				r.push(nodes);
				if (nodes[childsKey])
					r = r.concat(data.transformToArrayFormat(setting, nodes[childsKey]));
			}
			return r;
		},
		transformTozTreeFormat: function(setting, sNodes) {
			var i,l;
			var key = setting.data.simpleData.idKey;
			var parentKey = setting.data.simpleData.pIdKey;
			var childsKey = setting.data.key.childs;
			if (!key || key=="" || !sNodes) return [];

			if (tools.isArray(sNodes)) {
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
	};

	var event = {
		bindEvent: function(setting) {
			for (var i=0, j=_init.bind.length; i<j; i++) {
				_init.bind[i].apply(this, arguments);
			}
		},
		bindTree: function(setting) {
			var eventParam = {
				treeId: setting.treeId
				};
			var o = setting.treeObj;
			o.unbind('click', event.proxy);
			o.bind('click', eventParam, event.proxy);
			o.unbind('dblclick', event.proxy);
			o.bind('dblclick', eventParam, event.proxy);
			o.unbind('mouseover', event.proxy);
			o.bind('mouseover', eventParam, event.proxy);
			o.unbind('mouseout', event.proxy);
			o.bind('mouseout', eventParam, event.proxy);
			o.unbind('mousedown', event.proxy);
			o.bind('mousedown', eventParam, event.proxy);
			o.unbind('mouseup', event.proxy);
			o.bind('mouseup', eventParam, event.proxy);
			o.unbind('contextmenu', event.proxy);
			o.bind('contextmenu', eventParam, event.proxy);
		},
		doProxy: function(e) {
			var results = [];
			for (var i=0, j=_init.proxys.length; i<j; i++) {
				var proxyResult = _init.proxys[i].apply(this, arguments);
				results.push(proxyResult);
				if (proxyResult.stop) {
					break;
				}
			}
			return results;
		},
		proxy: function(e) {
			var setting = data.getSetting(e.data.treeId);
			if (!tools.uCanDo(setting)) return true;
			var results = event.doProxy(e);
			var r = true;
			var x = false;
			for (var i=0, l=results.length; i<l; i++) {
				var proxyResult = results[i];
				if (proxyResult.nodeEventCallback) {
					x = true;
					r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
				if (proxyResult.treeEventCallback) {
					x = true;
					r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
			}
			if (x) {
				tools.noSel(setting);
			}
			return r;
		}
	};

	var handler = {
		onSwitchNode: function (event, node) {
			var setting = settings[event.data.treeId];
			if (node.open) {
				if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			} else {
				if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			}
			return true;
		},
		onClickNode: function (event, node) {
			var setting = settings[event.data.treeId];
			if (tools.apply(setting.callback.beforeClick, [setting.treeId, node], true) == false) return true;
			var result = view.selectNode(setting, node, setting.view.selectedMulti && event.ctrlKey);
			setting.treeObj.trigger(consts.event.CLICK, [setting.treeId, node]);
			return result;
		},
		onZTreeMousedown: function(event, node) {
			var setting = settings[event.data.treeId];
			if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeMouseup: function(event, node) {
			var setting = settings[event.data.treeId];
			if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeDblclick: function(event, node) {
			var setting = settings[event.data.treeId];
			if (tools.apply(setting.callback.beforeDblclick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onDblclick, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeContextmenu: function(event, node) {
			var setting = settings[event.data.treeId];
			if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
			}
			return (typeof setting.callback.onRightClick) != "function";
		}
	};

	var tools = {
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
		isArray: function(arr) {
			return Object.prototype.toString.apply(arr) === "[object Array]";
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
		noSel: function(setting) {
			var r = data.getRoot(setting);
			if (r.noSelection) {
				try {
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				} catch(e){}
			}
		},
		uCanDo: function(setting) {
			return true;
		}
	};

	var view = {
		addNodes: function(setting, parentNode, newNodes, isSilent) {
			if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
				return;
			}
			if (!tools.isArray(newNodes)) {
				newNodes = [newNodes];
			}
			if (setting.data.simpleData.enable) {
				newNodes = data.transformTozTreeFormat(setting, newNodes);
			}
			if (parentNode) {
				if (setting.treeObj.find("#" + parentNode.tId).length == 0) return;

				var target_switchObj = $("#" + parentNode.tId + consts.id.SWITCH);
				var target_icoObj = $("#" + parentNode.tId + consts.id.ICON);
				var target_ulObj = $("#" + parentNode.tId + consts.id.UL);

				if (!parentNode.open) {
					view.replaceSwitchClass(target_switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(parentNode, target_icoObj, consts.folder.CLOSE);
					parentNode.open = false;
					target_ulObj.css({
						"display": "none"
					});
				}

				data.addNodesData(setting, parentNode, newNodes);
				view.createNodes(setting, parentNode.level + 1, newNodes, parentNode);
				if (!isSilent) {
					view.expandCollapseParentNode(setting, parentNode, true);
				}
			} else {
				data.addNodesData(setting, data.getRoot(setting), newNodes);
				view.createNodes(setting, 0, newNodes, null);
			}
		},		
		appendNodes: function(setting, level, nodes, parentNode) {
			if (!nodes) return [];
			var html = [];
			var childsKey = setting.data.key.childs;
			var nameKey = setting.data.key.name;
			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i];
				var tmpPNode = (parentNode) ? parentNode: data.getRoot(setting);
				var tmpPChilds = tmpPNode[childsKey]
				var preNode = ((tmpPChilds.length == nodes.length) && (i == 0)) ? null : ((i == 0)? tmpPChilds[tmpPChilds.length - nodes.length - 1] : nodes[i-1]),
				nextNode = (i == (nodes.length - 1)) ? null : nodes[i+1];

				data.initNode(setting, level, node, parentNode, preNode, nextNode);
				data.addNodeCache(setting, node);

				var url = view.makeNodeUrl(setting, node);
				var fontcss = view.makeNodeFontCss(setting, node);
				var fontStyle = [];
				for (var f in fontcss) {
					fontStyle.push(f, ":", fontcss[f], ";");
				}

				var childHtml = [];
				if (node[childsKey] && node[childsKey].length > 0) {
					childHtml = view.appendNodes(setting, level + 1, node[childsKey], node);
				}
				html.push("<li id='", node.tId, "' treenode>",
					"<button type='button' id='", node.tId, consts.id.SWITCH,
					"' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH," onfocus='this.blur();'></button>");
				data.getBeforeA(setting, node, html);
				html.push("<a id='", node.tId, consts.id.A, "' treeNode", consts.id.A," onclick=\"", (node.click || ''),
					"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
					"'>");
				data.getInnerBeforeA(setting, node, html);
				html.push("<button type='button' id='", node.tId, consts.id.ICON,
					"' title='' treeNode", consts.id.ICON," onfocus='this.blur();' class='", view.makeNodeIcoClass(setting, node), "' style='", view.makeNodeIcoStyle(setting, node), "'></button><span id='", node.tId, consts.id.SPAN,
					"'>",node[nameKey].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),"</span>");
				data.getInnerAfterA(setting, node, html);
				html.push("</a>");
				data.getAfterA(setting, node, html);
				html.push("<ul id='", node.tId, consts.id.UL, "' class='", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
				html.push(childHtml.join(''));
				html.push("</ul></li>");
			}
			return html;
		},
		asyncNode: function(setting, node) {
			var i, l;
			if (node && (node.isAjaxing || !node.isParent)) {
				return;
			}
			if (node) {
				node.isAjaxing = true;
				var icoObj = $("#" + node.tId + consts.id.ICON);
				icoObj.attr("class", "ico_loading");
			}

			var tmpParam = "";
			for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
				tmpParam += (tmpParam.length > 0 ? "&": "") + setting.async.autoParam[i] + "=" + node[setting.async.autoParam[i]];
			}
			if (tools.isArray(setting.asyncParamOther)) {
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
				url: tools.apply(setting.async.url, [node], setting.async.url),
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
					view.setNodeLineIcos(setting, node);
					if (newNodes && newNodes != "") {
						newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
						view.addNodes(setting, node, newNodes, false);
					} else {
						view.addNodes(setting, node, [], false);
					}
					setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					data.getRoot(setting).expandTriggerFlag = false;
					view.setNodeLineIcos(setting, node);
					if (node) node.isAjaxing = null;
					setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
				}
			});
		},
		cancelPreSelectedNode: function (setting, node) {
			var list = data.getRoot(setting).curSelectedList;
			for (var i=0, j=list.length-1; j>=i; j--) {
				if (!node || node === list[j]) {
					$("#" + list[j].tId + consts.id.A).removeClass(consts.node.CURSELECTED);
					view.setNodeName(setting, list[j]);
					if (node) {
						data.removeSelectedNode(setting, node);
						break;
					}
				}
			}
			if (!node) data.getRoot(setting).curSelectedList = [];
		},
		createNodeCallback: function(setting, nodes) {
			var childsKey = setting.data.key.childs;
			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i];
				tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
				setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node]);
				if (node[childsKey] && node[childsKey].length > 0) {
					view.createNodeCallback(setting, node[childsKey], node);
				}
			}
		},
		createNodes: function(setting, level, nodes, parentNode) {
			if (!nodes) return;
			var zTreeHtml = view.appendNodes(setting, level, nodes, parentNode);
			if (!parentNode) {
				setting.treeObj.append(zTreeHtml.join(''));
			} else {
				$("#" + parentNode.tId + consts.id.UL).append(zTreeHtml.join(''));
			}
			view.createNodeCallback(setting, nodes);
		},
		expandCollapseNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting);
			var childsKey = setting.data.key.childs;
			if (!node || node.open == expandFlag) {
				tools.apply(callback, []);
				return;
			}
			if (root.expandTriggerFlag) {
				callback = function(){
					if (node.open) {
						setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node]);
					} else {
						setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node]);
					}
				};
				root.expandTriggerFlag = false;
			}

			var switchObj = $("#" + node.tId + consts.id.SWITCH);
			var icoObj = $("#" + node.tId + consts.id.ICON);
			var ulObj = $("#" + node.tId + consts.id.UL);

			if (node.isParent) {
				node.open = !node.open;
				if (node.iconOpen && node.iconClose) {
					icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
				}

				if (node.open) {
					view.replaceSwitchClass(switchObj, consts.folder.OPEN);
					view.replaceIcoClass(node, icoObj, consts.folder.OPEN);
					if (animateFlag == false || setting.view.expandSpeed == "") {
						ulObj.show();
						tools.apply(callback, []);
					} else {
						if (node[childsKey] && node[childsKey].length > 0) {
							ulObj.show(setting.view.expandSpeed, callback);
						} else {
							ulObj.show();
							tools.apply(callback, []);
						}
					}
				} else {
					view.replaceSwitchClass(switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
					if (animateFlag == false || setting.view.expandSpeed == "") {
						ulObj.hide();
						tools.apply(callback, []);
					} else {
						ulObj.hide(setting.view.expandSpeed, callback);
					}
				}
			} else {
				tools.apply(callback, []);
			}
		},
		expandCollapseParentNode: function(setting, node, expandFlag, animateFlag, callback) {
			if (!node) return;
			if (!node.parentTId) {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
				return ;
			} else {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag);
			}
			if (node.parentTId) {
				view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
			}
		},
		expandCollapseSonNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting);
			var childsKey = setting.data.key.childs;
			var treeNodes = (node) ? node[childsKey]: root[childsKey];
			var selfAnimateSign = (node) ? false : animateFlag;
			if (treeNodes) {
				for (var i = 0, l = treeNodes.length; i < l; i++) {
					if (treeNodes[i]) view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
				}
			}
			view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback );
		},
		makeNodeFontCss: function(setting, node) {
			var fontCss = tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
			return (fontCss && ((typeof fontCss) != "function")) ? fontCss : {};
		},
		makeNodeIcoClass: function(setting, node) {
			var icoCss = ["ico"];
			if (!node.isAjaxing) {
				icoCss[0] = (node.iconSkin ? node.iconSkin : "") + " " + icoCss[0];
				if (node.isParent) {
					icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
				} else {
					icoCss.push(consts.folder.DOCU);
				}
			}
			return icoCss.join('_');
		},
		makeNodeIcoStyle: function(setting, node) {
			var icoStyle = [];
			if (!node.isAjaxing) {
				var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node.icon;
				if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
				if (setting.view.showIcon == false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
					icoStyle.push("width:0px;height:0px;");
				}
			}
			return icoStyle.join('');
		},
		makeNodeLineClass: function(setting, node) {
			var lineClass = ["switch"];
			if (setting.view.showLine) {
				if (node.level == 0 && node.isFirstNode && node.isLastNode) {
					lineClass.push(consts.line.ROOT);
				} else if (node.level == 0 && node.isFirstNode) {
					lineClass.push(consts.line.ROOTS);
				} else if (node.isLastNode) {
					lineClass.push(consts.line.BOTTOM);
				} else {
					lineClass.push(consts.line.CENTER);
				}

			} else {
				lineClass.push(consts.line.NOLINE);
			}
			if (node.isParent) {
				lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
			} else {
				lineClass.push(consts.folder.DOCU);
			}
			return lineClass.join('_');
		},
		makeNodeTarget: function(node) {
			return (node.target || "_blank");
		},
		makeNodeUrl: function(setting, node) {
			return node.url ? node.url : null;
		},
		makeUlLineClass: function(setting, node) {
			return (setting.view.showLine && !node.isLastNode) ?consts.line.LINE : "";
		},
		replaceIcoClass: function(node, obj, newName) {
			if (!obj || node.isAjaxing) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
		},
		replaceSwitchClass: function(obj, newName) {
			if (!obj) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.line.ROOT:
				case consts.line.ROOTS:
				case consts.line.CENTER:
				case consts.line.BOTTOM:
				case consts.line.NOLINE:
					tmpList[1] = newName;
					break;
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[2] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
		},
		selectNode: function(setting, node, addFlag) {
			if (!addFlag) {
				view.cancelPreSelectedNode(setting);
			}
			$("#" + node.tId + consts.id.A).addClass(consts.node.CURSELECTED);
			data.addSelectedNode(setting, node);
		},
		setNodeFontCss: function(setting, treeNode) {
			var aObj = $("#" + treeNode.tId + consts.id.A);
			var fontCss = view.makeNodeFontCss(setting, treeNode);
			if (fontCss) {
				aObj.css(fontCss);
			}
		},
		setNodeLineIcos: function(setting, node) {
			if (!node) return;
			var switchObj = $("#" + node.tId + consts.id.SWITCH);
			var ulObj = $("#" + node.tId + consts.id.UL);
			var icoObj = $("#" + node.tId + consts.id.ICON);

			var ulLine = view.makeUlLineClass(setting, node);
			if (ulLine.length==0) {
				ulObj.removeClass(consts.line.LINE);
			} else {
				ulObj.addClass(ulLine);
			}
			switchObj.attr("class", view.makeNodeLineClass(setting, node));
			icoObj.removeAttr("style");
			icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
			icoObj.attr("class", view.makeNodeIcoClass(setting, node));
		},
		setNodeName: function(setting, node) {
			var nameKey = setting.data.key.name;
			var nObj = $("#" + node.tId + consts.id.SPAN);
			nObj.empty();
			nObj.text(node[nameKey]);
		},
		setNodeTarget: function(node) {
			var aObj = $("#" + node.tId + consts.id.A);
			aObj.attr("target", view.makeNodeTarget(node));
		},
		setNodeUrl: function(setting, node) {
			var aObj = $("#" + node.tId + consts.id.A);
			var url = view.makeNodeUrl(setting, node);
			if (url == null || url.length == 0) {
				aObj.removeAttr("href");
			} else {
				aObj.attr("href", url);
			}
		},
		switchNode: function(setting, node) {
			var childsKey = setting.data.key.childs;
			if (node.open || (node && node[childsKey] && node[childsKey].length > 0)) {
				view.expandCollapseNode(setting, node, !node.open);
			} else if (setting.async.enable) {
				if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
					view.expandCollapseNode(setting, node, !node.open);
					return;
				}
				view.asyncNode(setting, node);
			} else if (node) {
				view.expandCollapseNode(setting, node, !node.open);
			}
		}
	};
	
	$.fn.zTree = {
		consts : _consts,
		_z : {
			tools: tools,
			view: view,
			event: event,
			data: data
		},
		getZTreeObj: function(treeId) {
			var o = settings[treeId];
			return o ? o.treeObj : null;
		},
		init: function(obj, zSetting, zNodes) {
			var setting = tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeId = obj.attr("id");
			setting.treeObj = obj;
			setting.treeObj.empty();
			settings[setting.treeId] = setting;

			data.initRoot(setting);
			var root = data.getRoot(setting);
			var childsKey = setting.data.key.childs;
			zNodes = zNodes ? (tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
				root[childsKey] = data.transformTozTreeFormat(setting, zNodes);
			} else {
				root[childsKey] = zNodes;
			}
			
			data.initCache(setting);
			event.bindTree(setting);
			event.bindEvent(setting);
			if (root[childsKey] && root[childsKey].length > 0) {
				view.createNodes(setting, 0, root[childsKey]);
			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
				view.asyncNode(setting);
			}
			obj.zTreeTools = {
				setting: setting,
				cancelSelectedNode : function(node) {
					view.cancelPreSelectedNode(this.setting, node);
				},
				expandAll : function(expandFlag) {
					view.expandCollapseSonNode(this.setting, null, expandFlag, true);
				},
				expandNode : function(node, expandFlag, sonSign, focus) {
					if (!node) return;

					if (expandFlag) {
						if (node.parentTId) view.expandCollapseParentNode(this.setting, node.getParentNode(), expandFlag, false);
					}
					if (sonSign) {
						view.expandCollapseSonNode(this.setting, node, expandFlag, false, function() {
							if (focus !== false) {$("#" + node.tId + consts.id.ICON).focus().blur();}
						});
					} else if (node.open != expandFlag) {
						view.switchNode(this.setting, node);
						if (focus !== false) {$("#" + node.tId + consts.id.ICON).focus().blur();}
					}
				},
				getNodes : function() {
					return data.getNodes(this.setting);
				},
				getNodeByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodeByParam(this.setting, parentNode?parentNode[this.setting.data.key.childs]:data.getNodes(this.setting), key, value);
				},
				getNodeByTId : function(tId) {
					return data.getNodeCache(this.setting, tId);
				},
				getNodesByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParam(this.setting, parentNode?parentNode[this.setting.data.key.childs]:data.getNodes(this.setting), key, value);
				},
				getNodesByParamFuzzy : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParamFuzzy(this.setting, parentNode?parentNode[this.setting.data.key.childs]:data.getNodes(this.setting), key, value);
				},
				getNodeIndex : function(node) {
					if (!node) return null;
					var childsKey = setting.data.key.childs;
					var parentNode = node.getParentNode();
					parentNode = (parentNode== null) ? data.getRoot(this.setting) : parentNode;
					for (var i=0, l = parentNode[childsKey].length; i < l; i++) {
						if (parentNode[childsKey][i] == node) return i;
					}
					return -1;
				},
				getSelectedNodes : function() {
					var r = [], list = data.getRoot(this.setting).curSelectedList;
					for (var i=0, l=list.length; i<l; i++) {
						r.push(list[i]);
					}
					return r;
				},
				isSelectedNode : function(node) {
					return data.isSelectedNode(this.setting, node);
				},
				reAsyncChildNodes : function(parentNode, reloadType) {
					if (!this.setting.async.enable) return;
					var isRoot = !parentNode;
					if (isRoot) {
						parentNode = data.getRoot(this.setting);
					}
					if (reloadType=="refresh") {
						parentNode[this.setting.data.key.childs] = [];
						if (isRoot) {
							this.setting.treeObj.empty();
						} else {
							var ulObj = $("#" + parentNode.tId + consts.id.UL);
							ulObj.empty();
						}
					}
					view.asyncNode(this.setting, isRoot? null:parentNode);
				},
				refresh : function() {
					this.setting.treeObj.empty();
					var root = data.getRoot(this.setting);
					var nodes = root[this.setting.data.key.childs]
					data.initRoot(this.setting);
					root[this.setting.data.key.childs] = nodes
					data.initCache(this.setting);
					view.createNodes(this.setting, 0, root[this.setting.data.key.childs]);
				},
				selectNode : function(node, addFlag) {
					if (!node) return;
					if (tools.uCanDo(this.setting)) {
						view.selectNode(this.setting, node, addFlag);
						if (node.parentTId) {
							view.expandCollapseParentNode(this.setting, node.getParentNode(), true, false, function() {
								$("#" + node.tId + consts.id.ICON).focus().blur();
							});
						} else {
							$("#" + node.tId + consts.id.ICON).focus().blur();
						}
					}
				},
				transformTozTreeNodes : function(simpleNodes) {
					return data.transformTozTreeFormat(this.setting, simpleNodes);
				},
				transformToArray : function(nodes) {
					return data.transformToArrayFormat(this.setting, nodes);
				},
				updateNode : function(node, checkTypeFlag) {
					if (!node) return;
					if (tools.uCanDo(this.setting)) {
						view.setNodeName(this.setting, node);
						view.setNodeTarget(node);
						view.setNodeUrl(this.setting, node);
						view.setNodeLineIcos(this.setting, node);
						view.setNodeFontCss(this.setting, node);
					}
				}
			}
			data.getZTreeTools(setting, obj);
		}
	};

	var zt = $.fn.zTree;
	var consts = zt.consts;
})(jQuery);