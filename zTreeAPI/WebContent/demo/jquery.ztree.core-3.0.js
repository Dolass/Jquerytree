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
			hoverDomFlag: true,
//			addHoverDom: null,
//			removeHoverDom: null,
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
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		if (!r) {
			r = {};
			data.setRoot(setting, r);
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
		var c = consts.event;
		o.unbind(c.NODECREATED);
		o.bind(c.NODECREATED, function (event, treeId, node) {
			tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
		});

		o.unbind(c.CLICK);
		o.bind(c.CLICK, function (event, treeId, node) {
			tools.apply(setting.callback.onClick, [event, treeId, node]);
		});

//		o.unbind(c.CHECK);
//		o.bind(c.CHECK, function (event, treeId, treeNode) {
//			tools.apply(setting.callback.onCheck, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.EDITNAME);
//		o.bind(c.EDITNAME, function (event, treeId, treeNode) {
//			tools.apply(setting.callback.onEditName, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.REMOVE);
//		o.bind(c.REMOVE, function (event, treeId, treeNode) {
//			tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.DRAG);
//		o.bind(c.DRAG, function (event, treeId, treeNode) {
//			tools.apply(setting.callback.onDrag, [event, treeId, treeNode]);
//		});
//
//		o.unbind(c.DROP);
//		o.bind(c.DROP, function (event, treeId, treeNode, targetNode, moveType) {
//			tools.apply(setting.callback.onDrop, [event, treeId, treeNode, targetNode, moveType]);
//		});

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
		var relatedTarget = event.relatedTarget;
		var tId = "";
		var nodeEventType = "", treeEventType = "";
		var nodeEventCallback = null, treeEventCallback = null;
		var tmp = null;

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
			treeEventType = "mousedown";
//			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+IDMark_A}]);
//			if (tmp) {
//				tId = tmp.parentNode.id;
//				nodeEventType = "mousedownNode";
//			}
		} else if (tools.eqs(event.type, "mouseup")) {
			treeEventType = "mouseup";
		} else if (tools.eqs(event.type, "contextmenu")) {
			treeEventType = "contextmenu";
		} else if (tools.eqs(event.type, "click")) {
			if (tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.SWITCH) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "switchNode";
//			} else if (setting.checkable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+IDMark_Check) !== null) {
//				tId = target.parentNode.id;
//				nodeEventType = "checkNode";
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

//		if (tId.length>0 || treeEventType.length>0) {
//			if (nodeEventType!="hoverOverNode" && nodeEventType != "hoverOutNode"
//				&& nodeEventType!="mouseoverCheck" && nodeEventType != "mouseoutCheck"
//				&& target.getAttribute("treeNode"+IDMark_Input) === null
//				&& !st.checkEvent(setting)) return false;
//		}
		var stop = false;
		if (tId.length>0) {
			stop = true;
			event.data.treeNode = data.getNodeCache(setting, tId);
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
//					nodeEventCallback = handler.onHoverOverNode(event);
//					break;
//				case "hoverOutNode" :
//					nodeEventCallback = handler.onHoverOutNode(event);
//					break;
			}
		} else {
			event.data.treeNode = null;
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
			stop: stop,
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
		n.editNameStatus = false;
//		n[setting.checkedCol] = !!node[setting.checkedCol];
//		n.checkedOld = node[setting.checkedCol];
//		n.check_Focus = false;
//		n.check_True_Full = true;
//		n.check_False_Full = true;
	},
	_init = {
		bind: [_bindEvent],
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [_eventProxy],
		roots: [_initRoot]
	};

	var data = {
		addNodeCache: function(setting, node) {
			caches[setting.treeId].nodes[node.tId] = node;
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
		exSetting: function(s) {
			$.extend(true, _setting, s);
		},
		fixPIdKeyValue: function(setting, node) {
			if (setting.data.simpleData.enable) {
				node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPid;
			}
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
		initRoot: function(setting) {
			for (var i=0, j=_init.roots.length; i<j; i++) {
				_init.roots[i].apply(this, arguments);
			}
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
			var results = event.doProxy(e);
			if (!(tools.eqs(e.target.tagName, "input"))) {
				tools.noSel();
			}
			var r = true;
			for (var i=0, l=results.length; i<l; i++) {
				var proxyResult = results[i];
				if (proxyResult.nodeEventCallback) {
					r = r && proxyResult.nodeEventCallback.apply(proxyResult, arguments);
				}
				if (proxyResult.treeEventCallback) {
					r = r && proxyResult.treeEventCallback.apply(proxyResult, arguments);
				}
			}
			return r;
		}
	};

	var handler = {
		onSwitchNode: function (event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;

			if (node.open) {
				if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			} else {
				if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			}
		},
		onClickNode: function (event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;
			if (tools.apply(setting.callback.beforeClick, [setting.treeId, node], true) == false) return;
			view.selectNode(setting, node, event.ctrlKey);
			setting.treeObj.trigger(consts.event.CLICK, [setting.treeId, node]);
			console.log(node);
		},
		onZTreeMousedown: function(event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;
			if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeMouseup: function(event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;
			if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeDblclick: function(event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;
			if (tools.apply(setting.callback.beforeDblclick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onDblclick, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeContextmenu: function(event) {
			var setting = settings[event.data.treeId];
			var node = event.data.treeNode;
			if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
			}
			return (typeof setting.callback.onRightClick) != "function";
		}
	};

	var st = {
//		checkEvent: function(setting) {
//			return st.checkCancelPreEditNode(setting);
//		},
		cancelPreSelectedNode: function (setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if (!node || node === root.curSelectedList[i]) {
					$("#" + root.curSelectedList[i].tId + consts.id.A).removeClass(consts.node.CURSELECTED);
					view.setNodeName(setting, root.curSelectedList[i]);
				}
//				removeTreeDom(setting, root.curSelectedList[i]);
			}
			root.curSelectedList = [];
		},
//		checkCancelPreEditNode: function (setting) {
//			var root = getRoot(setting);
//			if (setting.curEditTreeNode) {
//				var inputObj = setting.curEditInput;
//				if ( tools.apply(setting.callback.confirmRename, [setting.treeId, setting.curEditTreeNode, inputObj.val()], true) === false) {
//					setting.curEditTreeNode.editNameStatus = true;
//					tools.inputFocus(inputObj);
//					return false;
//				}
//			}
//			return true;
//		},
		cancelPreEditNode: function (setting, newName) {
//			var root = getRoot(setting);
//			if (setting.curEditTreeNode) {
//				var inputObj = $("#" + setting.curEditTreeNode.tId + IDMark_Input);
//				setting.curEditTreeNode[setting.nameCol] = newName ? newName:inputObj.val();
//				//触发rename事件
//				setting.treeObj.trigger(ZTREE_RENAME, [setting.treeId, setting.curEditTreeNode]);
//
//				$("#" + setting.curEditTreeNode.tId + IDMark_A).removeClass(Class_CurSelectedNode_Edit);
//				inputObj.unbind();
//				setNodeName(setting, setting.curEditTreeNode);
//				setting.curEditTreeNode.editNameStatus = false;
//				setting.curEditTreeNode = null;
//				setting.curEditInput = null;
//			}
//			return true;
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
			var oRect = obj.getBoundingClientRect();
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
			window.getSelection ? window.getSelection().removeAllRanges() : setTimeout(function(){
				document.selection.empty();
			}, 10);
		}
	};

	var view = {
//		addHoverDom: function(setting, node) {
//			if (setting.view.hoverDomFlag) {
//				node.isHover = true;
//				if (setting.edit.enable) {
//					addEditBtn(setting, node);
//					addRemoveBtn(setting, node);
//				}
//				tools.apply(setting.view.addHoverDom, [setting.treeId, node]);
//			}
//		},
		addNodes: function(setting, parentNode, newNodes, isSilent) {
			if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
				return;
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
		addSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			if (!view.isSelectedNode(setting, node)) {
				root.curSelectedList.push(node);
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
				//beforeA()
				//			if (setting.checkable) {
				//				makeChkFlag(setting, node);
				//				if (setting.checkStyle == Check_Style_Radio && setting.checkRadioType == Radio_Type_All && node[setting.checkedCol] ) {
				//					setting.checkRadioCheckedList = setting.checkRadioCheckedList.concat([node]);
				//				}
				//				html.push("<button type='button' ID='", node.tId, IDMark_Check, "' class='", makeChkClass(setting, node), "' treeNode", IDMark_Check," onfocus='this.blur();' ",(node.nocheck === true?"style='display:none;'":""),"></button>");
				//			}
				html.push("<a id='", node.tId, consts.id.A, "' treeNode", consts.id.A," onclick=\"", (node.click || ''),
					"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
					"'><button type='button' id='", node.tId, consts.id.ICON,
					"' title='' treeNode", consts.id.ICON," onfocus='this.blur();' class='", view.makeNodeIcoClass(setting, node), "' style='", view.makeNodeIcoStyle(setting, node), "'></button><span id='", node.tId, consts.id.SPAN,
					"'>",node[nameKey].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),"</span></a><ul id='", node.tId, consts.id.UL, "' class='", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
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
			//		repairParentChkClassWithSelf(setting, parentNode);
			view.createNodeCallback(setting, nodes);
		},
		expandCollapseNode: function(setting, node, expandSign, animateSign, callback) {
			var root = data.getRoot(setting);
			var childsKey = setting.data.key.childs;
			if (!node || node.open == expandSign) {
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
					if (animateSign == false || setting.view.expandSpeed == "") {
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
					if (animateSign == false || setting.view.expandSpeed == "") {
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
		expandCollapseParentNode: function(setting, node, expandSign, animateSign, callback) {
			if (!node) return;
			if (!node.parentTId) {
				view.expandCollapseNode(setting, node, expandSign, animateSign, callback);
				return ;
			} else {
				view.expandCollapseNode(setting, node, expandSign, animateSign);
			}
			if (node.parentTId) {
				view.expandCollapseParentNode(setting, node.getParentNode(), expandSign, animateSign, callback);
			}
		},
		expandCollapseSonNode: function(setting, node, expandSign, animateSign, callback) {
			var root = data.getRoot(setting);
			var childsKey = setting.data.key.childs;
			var treeNodes = (node) ? node[childsKey]: root[childsKey];
			var selfAnimateSign = (node) ? false : animateSign;
			if (treeNodes) {
				for (var i = 0, l = treeNodes.length; i < l; i++) {
					if (treeNodes[i]) view.expandCollapseSonNode(setting, treeNodes[i], expandSign, selfAnimateSign);
				}
			}
			view.expandCollapseNode(setting, node, expandSign, animateSign, callback );
		},
		isSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i]) return true;
			}
			return false;
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
			return (node.url && setting.view.urlEnable) ? node.url : null;
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
			var root = data.getRoot(setting);
			if (view.isSelectedNode(setting, node) && ((root.curEditNode == node && node.editNameStatus))) {
				return;
			}
//			st.cancelPreEditNode(setting);
			if (!addFlag) {
				st.cancelPreSelectedNode(setting);
			}

//			if (setting.edit.enable && node.editNameStatus) {
//				$("#" + node.tId + consts.id.SPAN).html("<input type=text class='rename' id='" + node.tId + consts.id.INPUT + "' treeNode" + consts.id.INPUT + " >");
//
//				var inputObj = $("#" + node.tId + consts.id.INPUT);
//				setting.curEditInput = inputObj;
//				inputObj.attr("value", node[setting.nameCol]);
//				tools.inputFocus(inputObj);
//
//				//拦截A的click dblclick监听
//				inputObj.bind('blur', function(event) {
//					if (st.checkEvent(setting)) {
//						node.editNameStatus = false;
//						selectNode(setting, node);
//					}
//				}).bind('keyup', function(event) {
//					if (event.keyCode=="13") {
//						if (st.checkEvent(setting)) {
//							node.editNameStatus = false;
//							selectNode(setting, node);
//						}
//					} else if (event.keyCode=="27") {
//						inputObj.attr("value", node[setting.nameCol]);
//						node.editNameStatus = false;
//						selectNode(setting, node);
//					}
//				}).bind('click', function(event) {
//					return false;
//				}).bind('dblclick', function(event) {
//					return false;
//				});
//
//				$("#" + node.tId + consts.id.A).addClass(consts.node.CURSELECTED_EDIT);
//				setting.curEditTreeNode = node;
//			} else {
				$("#" + node.tId + consts.id.A).addClass(consts.node.CURSELECTED);
//			}
//			addHoverDom(setting, node);
			view.addSelectedNode(setting, node);
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
			var ulObj = $("#" + node.tId + consts.id.Ul);
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
			zNodes = zNodes ? (tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
				root[setting.data.key.childs] = data.transformTozTreeFormat(setting, zNodes);
			} else {
				root[setting.data.key.childs] = zNodes;
			}
			
			data.initCache(setting.treeId);
			event.bindTree(setting);
			event.bindEvent(setting);
			if (root.childs && root.childs.length > 0) {
				view.createNodes(setting, 0, root.childs);
			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
				view.asyncNode(setting);
			}
			obj.zTreeTools = {
				setting: setting,
				cancelSelectedNode : function(node) {
					st.cancelPreSelectedNode(this.setting, node);
				},
				expandAll : function(expandSign) {
					view.expandCollapseSonNode(this.setting, null, expandSign, true);
				},
				expandNode : function(node, expandSign, sonSign, focus) {
					if (!node) return;

					if (expandSign) {
						if (node.parentTId) view.expandCollapseParentNode(this.setting, node.getParentNode(), expandSign, false);
					}
					if (sonSign) {
						view.expandCollapseSonNode(this.setting, node, expandSign, false, function() {
							if (focus !== false) {$("#" + node.tId + consts.id.ICON).focus().blur();}
						});
					} else if (node.open != expandSign) {
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
					return data.getRoot(this.setting).curSelectedList
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
				selectNode : function(node, addFlag) {
					if (!node) return;
//					if (st.checkEvent(this.setting)) {
						view.selectNode(this.setting, node, addFlag);
						if (node.parentTId) {
							view.expandCollapseParentNode(this.setting, node.getParentNode(), true, false, function() {
								$("#" + node.tId + consts.id.ICON).focus().blur();
							});
						} else {
							$("#" + node.tId + consts.id.ICON).focus().blur();
						}
//					}
				},
				transformTozTreeNodes : function(simpleNodes) {
					return data.transformTozTreeFormat(this.setting, simpleNodes);
				},
				transformToArray : function(nodes) {
					return data.transformToArrayFormat(this.setting, nodes);
				},
				updateNode : function(node, checkTypeFlag) {
					if (!node) return;
//					if (st.checkEvent(this.setting)) {
//						var checkObj = $("#" + node.tId + consts.id.CHECK);
//						if (this.setting.checkable) {
//							if (checkTypeFlag == true) checkNodeRelation(this.setting, node);
//							setChkClass(this.setting, checkObj, node);
//							repairParentChkClassWithSelf(this.setting, node);
//						}
						view.setNodeName(this.setting, node);
						view.setNodeTarget(node);
						view.setNodeUrl(this.setting, node);
						view.setNodeLineIcos(this.setting, node);
						view.setNodeFontCss(this.setting, node);
//					}
				}
			}
		}
	};

	var zt = $.fn.zTree;
//	var tools = zt._z.tools;
	var consts = zt.consts;
//	var view = zt._z.view;
//	var data = zt._z.data;
//	var zEvent = zt._z.event;
})(jQuery);