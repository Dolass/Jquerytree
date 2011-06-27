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
		},
		node: {
			CURSELECTED_EDIT: "curSelectedNode_Edit",
			TMPTARGET_TREE: "tmpTargetTree",
			TMPTARGET_NODE: "tmpTargetNode"
		}
	},
	_setting = {
		edit: {
			enable: false,
			showRemoveBtn: true,
			showRenameBtn: true,
			showHoverDom: true,
			drag: {
				isCopy: true,
				isMove: true
			}
		},
		view: {
			addHoverDom: null,
			removeHoverDom: null
		},
		callback: {
			beforeDrag:null,
			beforeDragOpen:null,
			beforeDrop:null,
			beforeEditName:null,
			beforeRemove:null,
			beforeRename:null,
			onDrag:null,
			onDrop:null,
			onEditName:null,
			onRemove:null
		}
	},
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		r.curEditNode = null;
		r.curEditInput = null;
		r.curHoverNode = null;
		r.dragStatus = 0;
	},
	_initCache = function(treeId) {},
	_bindEvent = function(setting) {
		var o = setting.treeObj;
		var c = consts.event;
		o.unbind(c.EDITNAME);
		o.bind(c.EDITNAME, function (event, treeId, treeNode) {
			tools.apply(setting.callback.onEditName, [event, treeId, treeNode]);
		});

		o.unbind(c.REMOVE);
		o.bind(c.REMOVE, function (event, treeId, treeNode) {
			tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
		});

		o.unbind(c.DRAG);
		o.bind(c.DRAG, function (event, treeId, treeNode) {
			tools.apply(setting.callback.onDrag, [event, treeId, treeNode]);
		});

		o.unbind(c.DROP);
		o.bind(c.DROP, function (event, treeId, treeNode, targetNode, moveType) {
			tools.apply(setting.callback.onDrop, [event, treeId, treeNode, targetNode, moveType]);
		});
	},
	_eventProxy = function(e) {
		var target = e.target;
		var setting = data.getSetting(e.data.treeId);
		var relatedTarget = e.relatedTarget;
		var tId = "", node = null;
		var nodeEventType = "", treeEventType = "";
		var nodeEventCallback = null, treeEventCallback = null;
		var tmp = null;

		if (tools.eqs(e.type, "mouseover")) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tmp.parentNode.id;
				nodeEventType = "hoverOverNode";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			tmp = tools.getMDom(setting, relatedTarget, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (!tmp) {
				tId = "remove";
				nodeEventType = "hoverOutNode";
			}
		} else if (tools.eqs(e.type, "mousedown")) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tmp.parentNode.id;
				nodeEventType = "mousedownNode";
			}
		}
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "mousedownNode" :
					nodeEventCallback = _handler.onMousedownNode;
					break;
				case "hoverOverNode" :
					nodeEventCallback = _handler.onHoverOverNode;
					break;
				case "hoverOutNode" :
					nodeEventCallback = _handler.onHoverOutNode;
					break;
			}
		}
//		if (nodeEventType || treeEventType) {
//			tools.noSel(setting);
//		}
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
		n.isHover = false;
		n.editNameStatus = false;
	},
//	_beforeA = function(setting, node, html) {},
	_zTreeTools = function(setting, obj) {
//		obj.zTreeTools.getCheckedNodes = function(checked) {
//			var childsKey = this.setting.data.key.childs;
//			checked = (checked != false);
//			return data.getTreeCheckedNodes(this.setting, data.getRoot(setting)[childsKey], checked);
//		}
//
//		obj.zTreeTools.getChangeCheckedNodes = function() {
//			var childsKey = this.setting.data.key.childs;
//			return data.getTreeChangeCheckedNodes(this.setting, data.getRoot(setting)[childsKey]);
//		}
//
//		var updateNode = obj.zTreeTools.updateNode;
//		obj.zTreeTools.updateNode = function(node, checkTypeFlag) {
//			if (updateNode) updateNode.apply(obj.zTreeTools, arguments);
//			if (!node) return;
////				if (st.checkEvent(this.setting)) {
//					var checkObj = $("#" + node.tId + consts.id.CHECK);
//					if (this.setting.chk.enable) {
//						if (checkTypeFlag == true) view.checkNodeRelation(this.setting, node);
//						view.setChkClass(this.setting, checkObj, node);
//						view.repairParentChkClassWithSelf(this.setting, node);
//					}
////				}
//		}
	};
	
	var _data = {
		
	};

	var _event = {

	};

	var _handler = {
		onHoverOverNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode != node) {
//				event.data.treeNode = root.curHoverNode;
				_handler.onHoverOutNode(event);
			}
			root.curHoverNode = node;
			view.addHoverDom(setting, node);
		},
		onHoverOutNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode && !view.isSelectedNode(setting, root.curHoverNode)) {
				view.removeTreeDom(setting, root.curHoverNode);
				root.curHoverNode = null;
			}
		}
	};

	var _tools = {
		inputFocus: function(inputObj) {
			if (inputObj.get(0)) {
				inputObj.focus();
				tools.setCursorPosition(inputObj.get(0), inputObj.val().length);
			}
		},
		setCursorPosition: function(obj, pos){
			if(obj.setSelectionRange) {
				obj.focus();
				obj.setSelectionRange(pos,pos);
			} else if (obj.createTextRange) {
				var range = obj.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		}
	};

	var _view = {
		addEditBtn: function(setting, node) {
			if (node.editNameStatus || $("#" + node.tId + consts.id.EDIT).length > 0) {
				return;
			}
			if (!tools.apply(setting.edit.showRenameBtn, [node], setting.edit.showRenameBtn)) {
				return;
			}
			var nObj = $("#" + node.tId + consts.id.SPAN);
			var editStr = "<button type='button' class='edit' id='" + node.tId + consts.id.EDIT + "' title='' treeNode"+consts.id.EDIT+" onfocus='this.blur();' style='display:none;'></button>";
			nObj.after(editStr);

			$("#" + node.tId + consts.id.EDIT).bind('click',
				function() {
					if (tools.apply(setting.callback.beforeRename, [setting.treeId, node], true) == false) return true;
					view.editNode(setting, node);
					return false;
				}
				).show();
		},
		addRemoveBtn: function(setting, node) {
			if (node.editNameStatus || $("#" + node.tId + consts.id.REMOVE).length > 0) {
				return;
			}
			if (!tools.apply(setting.edit_removeBtn, [node], setting.edit_removeBtn)) {
				return;
			}
			var aObj = $("#" + node.tId + consts.id.A);
			var removeStr = "<button type='button' class='remove' id='" + node.tId + consts.id.REMOVE + "' title='' treeNode"+consts.id.REMOVE+" onfocus='this.blur();' style='display:none;'></button>";
			aObj.append(removeStr);

			$("#" + node.tId + consts.id.REMOVE).bind('click',
				function() {
					if (tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return true;
					view.removeNode(setting, node);
					setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
					return false;
				}
				).bind('mousedown',
				function(eventMouseDown) {
					return true;
				}
				).show();
		},
		addHoverDom: function(setting, node) {
			if (setting.edit.showHoverDom) {
				node.isHover = true;
				if (setting.edit.enable) {
					view.addEditBtn(setting, node);
					view.addRemoveBtn(setting, node);
				}
				tools.apply(setting.view.addHoverDom, [setting, node]);
			}
		},
		cancelPreEditNode: function (setting, newName) {
			var root = data.getRoot(setting);
			var nameKey = setting.data.key.name;
			if (root.curEditNode) {
				var inputObj = $("#" + root.curEditNode.tId + consts.id.INPUT);
				root.curEditNode[nameKey] = newName ? newName:inputObj.val();
				//触发rename事件
				setting.treeObj.trigger(consts.event.EDITNAME, [setting.treeId, root.curEditNode]);

				$("#" + root.curEditNode.tId + consts.id.A).removeClass(consts.node.CURSELECTED_EDIT);
				inputObj.unbind();
				view.setNodeName(setting, root.curEditNode);
				root.curEditNode.editNameStatus = false;
				root.curEditNode = null;
				root.curEditInput = null;
			}
			return true;
		},
		editNode: function(setting, node) {
			node.editNameStatus = true;
			view.removeTreeDom(setting, node);
			view.selectNode(setting, node);
		},
		removeEditBtn: function(node) {
			$("#" + node.tId + consts.id.EDIT).unbind().remove();
		},
		removeRemoveBtn: function(node) {
			$("#" + node.tId + consts.id.REMOVE).unbind().remove();
		},
		removeTreeDom: function(setting, node) {
			node.isHover = false;
			view.removeEditBtn(node);
			view.removeRemoveBtn(node);
			tools.apply(setting.view.removeHoverDom, [setting.treeId, node]);
		}
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

	view.cancelPreSelectedNode = function (setting, node) {
		var root = data.getRoot(setting);
		for (var i=0, j=root.curSelectedList.length; i<j; i++) {
			if (!node || node === root.curSelectedList[i]) {
				$("#" + root.curSelectedList[i].tId + consts.id.A).removeClass(consts.node.CURSELECTED);
				view.setNodeName(setting, root.curSelectedList[i]);
			}
			view.removeTreeDom(setting, root.curSelectedList[i]);
		}
		root.curSelectedList = [];
	}

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode) {
		if (_createNodes) _createNodes.apply(view, arguments);
		if (!nodes) return;
		view.repairParentChkClassWithSelf(setting, parentNode);
	}

	var _selectNode = view.selectNode;
	view.selectNode = function(setting, node, addFlag) {
		var nameKey = setting.data.key.name;
		var root = data.getRoot(setting);
		if (view.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameStatus) {
			console.log("selectNode return....");
			return false;
		}
		console.log("selectNode ....");
		view.cancelPreEditNode(setting);

		if (setting.edit.enable && node.editNameStatus) {
			view.cancelPreSelectedNode(setting);
			$("#" + node.tId + consts.id.SPAN).html("<input type=text class='rename' id='" + node.tId + consts.id.INPUT + "' treeNode" + consts.id.INPUT + " >");

			var inputObj = $("#" + node.tId + consts.id.INPUT);
			inputObj.attr("value", node[nameKey]);
			tools.inputFocus(inputObj);

			//拦截A的click dblclick监听
			inputObj.bind('blur', function(event) {
//				if (st.checkEvent(setting)) {
					node.editNameStatus = false;
					view.selectNode(setting, node);
//				}
			}).bind('keyup', function(event) {
				if (event.keyCode=="13") {
//					if (st.checkEvent(setting)) {
						node.editNameStatus = false;
						view.selectNode(setting, node);
//					}
				} else if (event.keyCode=="27") {
					inputObj.attr("value", node[setting.nameCol]);
					node.editNameStatus = false;
					view.selectNode(setting, node);
				}
			}).bind('click', function(event) {
				return false;
			}).bind('dblclick', function(event) {
				return false;
			});

			$("#" + node.tId + consts.id.A).addClass(consts.node.CURSELECTED_EDIT);
			root.curEditInput = inputObj;
			root.noSelection = false;
			root.curEditNode = node;
			view.addSelectedNode(setting, node);
		} else {
			if (_selectNode) _selectNode.apply(view, arguments);
		}
		view.addHoverDom(setting, node);
		return true;
	}

})(jQuery);