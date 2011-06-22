/*
 * JQuery zTree exedit 3.0
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
	var _consts = {
		event: {
			DRAG: "ztree_drag",
			DROP: "ztree_drop",
			EDITNAME: "ztree_editname",
			REMOVE: "ztree_rename"
		},
		id: {
			EDIT: "_edit",
			INPUT: "_input",
			REMOVE: "_remove"
		},
		move: {
			TYPE_INNER: "inner",
			TYPE_BEFORE: "before",
			TYPE_AFTER: "after",
			MINMOVESIZE: 5
		}
	},
	_setting = {
		view: {
			addHoverDom: null,
			removeHoverDom: null
		},
		callback: {
			
		}
	},
	_initRoot = function (setting) {},
	_initCache = function(treeId) {},
	_bindEvent = function(setting) {
		var o = setting.treeObj;
		var c = consts.event;
		o.unbind(c.CHECK);
		o.bind(c.CHECK, function (event, treeId, node) {
			tools.apply(setting.callback.onCheck, [event, treeId, node]);
		});
	},
	_eventProxy = function(e) {
		var target = e.target;
		var setting = data.getSetting(e.data.treeId);
		var relatedTarget = e.relatedTarget;
		var tId = "";
		var nodeEventType = "", treeEventType = "";
		var nodeEventCallback = null, treeEventCallback = null;
		var tmp = null;

		if (tools.eqs(e.type, "mouseover")) {
			if (setting.chk.enable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "mouseoverCheck";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			if (setting.chk.enable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "mouseoutCheck";
			}
		} else if (tools.eqs(e.type, "click")) {
			if (setting.chk.enable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "checkNode";
			}
		}
		if (tId.length>0) {
			e.data.treeNode = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "checkNode" :
					nodeEventCallback = _handler.onCheckNode;
					break;
				case "mouseoverCheck" :
					nodeEventCallback = _handler.onMouseoverCheck;
					break;
				case "mouseoutCheck" :
					nodeEventCallback = _handler.onMouseoutCheck;
					break;
			}
		} else {
			e.data.treeNode = null;
		}
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
		var checkedKey = setting.data.key.checked;
		n[checkedKey] = !!n[checkedKey];
		n.checkedOld = n[checkedKey];
		n.check_Focus = false;
		n.check_True_Full = true;
		n.check_False_Full = true;
	},
	_beforeA = function(setting, node, html) {},
	_zTreeTools = function(setting, obj) {
		obj.zTreeTools.getCheckedNodes = function(checked) {
			var childsKey = this.setting.data.key.childs;
			checked = (checked != false);
			return data.getTreeCheckedNodes(this.setting, data.getRoot(setting)[childsKey], checked);
		}

		obj.zTreeTools.getChangeCheckedNodes = function() {
			var childsKey = this.setting.data.key.childs;
			return data.getTreeChangeCheckedNodes(this.setting, data.getRoot(setting)[childsKey]);
		}

		var updateNode = obj.zTreeTools.updateNode;
		obj.zTreeTools.updateNode = function(node, checkTypeFlag) {
			if (updateNode) updateNode.apply(obj.zTreeTools, arguments);
			if (!node) return;
//				if (st.checkEvent(this.setting)) {
					var checkObj = $("#" + node.tId + consts.id.CHECK);
					if (this.setting.chk.enable) {
						if (checkTypeFlag == true) view.checkNodeRelation(this.setting, node);
						view.setChkClass(this.setting, checkObj, node);
						view.repairParentChkClassWithSelf(this.setting, node);
					}
//				}
		}
	};
	
	var _data = {
		
	};

	var _event = {

	};

	var _handler = {
		
	};

	var _tools = {

	};

	var _view = {
		
	};

	var _z = {
		tools: _tools,
		view: _view,
		event: event,
		data: _data
	};
	$.extend(true, $.fn.zTree.consts, _consts);
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree;
	var tools = zt._z.tools;
	var consts = zt.consts;
	var view = zt._z.view;
	var data = zt._z.data;
	var event = zt._z.event;

	data.exSetting(_setting);
	data.addInitBind(_bindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy);
	data.addInitRoot(_initRoot);
//	data.addBeforeA(_beforeA);
	data.addZTreeTools(_zTreeTools);

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode) {
		if (_createNodes) _createNodes.apply(view, arguments);
		if (!nodes) return;
		view.repairParentChkClassWithSelf(setting, parentNode);
	}

})(jQuery);