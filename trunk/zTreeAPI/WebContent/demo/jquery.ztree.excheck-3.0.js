/*
 * JQuery zTree excheck 3.0
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

	var _consts = {
		event: {
			CHECK: "ztree_check"
		},
		id: {
			CHECK: "_check"
		},
		checkbox: {
			STYLE: "checkbox",
			DEFAULT: "chk",
			FALSE: "false",
			TRUE: "true",
			FULL: "full",
			PART: "part",
			FOCUS: "focus"
		},
		radio: {
			STYLE: "radio",
			TYPE_ALL: "all",
			TYPE_LEVEL: "level"
		}
	}
	$.extend(true, $.fn.zTree.consts, _consts);

	var _z = {
		tools: _tools,
		view: _view,
		event: event,
		data: _data
	};
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree;
	var tools = zt._z.tools;
	var consts = zt.consts;
	var view = zt._z.view;
	var data = zt._z.data;
	var event = zt._z.event;
	
	var _setting = {
		chk: {
			enable: true,
			chkStyle: _consts.checkbox.STYLE,
			radioType: _consts.radio.TYPE_LEVEL,
			chkboxType: {
				"Y": "ps",
				"N": "ps"
			}
		},
		data: {
			key: {
				checked: "checked"
			}
		},
		callback: {
			beforeCheck:null,
			onCheck:null
		}
	},
	_initRoot = function (setting) {
		var r = data.getRoot(setting);		
		r.checkedList = [];
	},
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
	};
	data.exSetting(_setting);

	data.addInitBind(_bindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy);
	data.addInitRoot(_initRoot);

//	$.fn.zTree = {
//		init0: function(obj, zSetting, zNodes) {
//			var setting = tools.clone(_setting);
//			$.extend(true, setting, zSetting);
//			setting.treeId = obj.attr("id");
//			setting.treeObj = obj;
//			setting.treeObj.empty();
//			settings[setting.treeId] = setting;
//
//			data.initRoot(setting.treeId);
//			var root = roots[setting.treeId];
//			zNodes = zNodes ? (tools.isArray(zNodes)? zNodes : [zNodes]) : [];
//			if (setting.data.simpleData.enable) {
//				root[setting.data.key.childs] = data.transformTozTreeFormat(setting, zNodes);
//			} else {
//				root[setting.data.key.childs] = zNodes;
//			}
//
//			data.initCache(setting.treeId);
//			event.bindTree(setting);
//			event.bindEvent(setting);
//			if (root.childs && root.childs.length > 0) {
//				view.createNodes(setting, 0, root.childs);
//			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
//				view.asyncNode(setting);
//			}
//			obj.zTreeTools = {
//				setting: setting,
//				cancelSelectedNode : function(node) {
//					st.cancelPreSelectedNode(this.setting, node);
//				},
//				expandAll : function(expandSign) {
//					view.expandCollapseSonNode(this.setting, null, expandSign, true);
//				},
//				expandNode : function(node, expandSign, sonSign, focus) {
//					if (!node) return;
//
//					if (expandSign) {
//						if (node.parentTId) view.expandCollapseParentNode(this.setting, node.getParentNode(), expandSign, false);
//					}
//					if (sonSign) {
//						view.expandCollapseSonNode(this.setting, node, expandSign, false, function() {
//							if (focus !== false) {$("#" + node.tId + consts.id.ICON).focus().blur();}
//						});
//					} else if (node.open != expandSign) {
//						view.switchNode(this.setting, node);
//						if (focus !== false) {$("#" + node.tId + consts.id.ICON).focus().blur();}
//					}
//				},
//				getNodes : function() {
//					return data.getNodes(this.setting);
//				},
//				getNodeByParam : function(key, value, parentNode) {
//					if (!key) return null;
//					return data.getNodeByParam(this.setting, parentNode?parentNode[this.setting.data.key.childs]:data.getNodes(this.setting), key, value);
//				},
//				getNodeByTId : function(tId) {
//					return data.getNodeCache(this.setting, tId);
//				},
//				getNodesByParam : function(key, value, parentNode) {
//					if (!key) return null;
//					return data.getNodesByParam(this.setting, parentNode?parentNode[this.setting.data.key.childs]:data.getNodes(this.setting), key, value);
//				},
//				getNodesByParamFuzzy : function(key, value, parentNode) {
//					if (!key) return null;
//					return data.getNodesByParamFuzzy(this.setting, parentNode?parentNode[this.setting.data.key.childs]:data.getNodes(this.setting), key, value);
//				},
//				getNodeIndex : function(node) {
//					if (!node) return null;
//					var childsKey = setting.data.key.childs;
//					var parentNode = node.getParentNode();
//					parentNode = (parentNode== null) ? data.getRoot(this.setting) : parentNode;
//					for (var i=0, l = parentNode[childsKey].length; i < l; i++) {
//						if (parentNode[childsKey][i] == node) return i;
//					}
//					return -1;
//				},
//				getSelectedNodes : function() {
//					return data.getRoot(this.setting).curSelectedList
//				},
//				reAsyncChildNodes : function(parentNode, reloadType) {
//					if (!this.setting.async.enable) return;
//					var isRoot = !parentNode;
//					if (isRoot) {
//						parentNode = data.getRoot(this.setting);
//					}
//					if (reloadType=="refresh") {
//						parentNode[this.setting.data.key.childs] = [];
//						if (isRoot) {
//							this.setting.treeObj.empty();
//						} else {
//							var ulObj = $("#" + parentNode.tId + consts.id.UL);
//							ulObj.empty();
//						}
//					}
//					view.asyncNode(this.setting, isRoot? null:parentNode);
//				},
//				selectNode : function(node, addFlag) {
//					if (!node) return;
////					if (st.checkEvent(this.setting)) {
//						view.selectNode(this.setting, node, addFlag);
//						if (node.parentTId) {
//							view.expandCollapseParentNode(this.setting, node.getParentNode(), true, false, function() {
//								$("#" + node.tId + consts.id.ICON).focus().blur();
//							});
//						} else {
//							$("#" + node.tId + consts.id.ICON).focus().blur();
//						}
////					}
//				},
//				transformTozTreeNodes : function(simpleNodes) {
//					return data.transformTozTreeFormat(this.setting, simpleNodes);
//				},
//				transformToArray : function(nodes) {
//					return data.transformToArrayFormat(this.setting, nodes);
//				},
//				updateNode : function(node, checkTypeFlag) {
//					if (!node) return;
////					if (st.checkEvent(this.setting)) {
////						var checkObj = $("#" + node.tId + consts.id.CHECK);
////						if (this.setting.checkable) {
////							if (checkTypeFlag == true) checkNodeRelation(this.setting, node);
////							setChkClass(this.setting, checkObj, node);
////							repairParentChkClassWithSelf(this.setting, node);
////						}
//						view.setNodeName(this.setting, node);
//						view.setNodeTarget(node);
//						view.setNodeUrl(this.setting, node);
//						view.setNodeLineIcos(this.setting, node);
//						view.setNodeFontCss(this.setting, node);
////					}
//				}
//			}
//		}
//	};

})(jQuery);