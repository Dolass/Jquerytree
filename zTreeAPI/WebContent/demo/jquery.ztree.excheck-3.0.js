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
	},
	_setting = {
		check: {
			enable: false,
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
		r.radioCheckedList = [];
	},
	_initCache = function(treeId) {},
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.CHECK);
		o.bind(c.CHECK, function (event, treeId, node) {
			tools.apply(setting.callback.onCheck, [event, treeId, node]);
		});
	},
	_eventProxy = function(e) {
		var target = e.target,
		setting = data.getSetting(e.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null;

		if (tools.eqs(e.type, "mouseover")) {
			if (setting.check.enable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "mouseoverCheck";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			if (setting.check.enable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "mouseoutCheck";
			}
		} else if (tools.eqs(e.type, "click")) {
			if (setting.check.enable && tools.eqs(target.tagName, "button") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = target.parentNode.id;
				nodeEventType = "checkNode";
			}
		}
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
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
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var checkedKey = setting.data.key.checked;
		n[checkedKey] = !!n[checkedKey];
		n.checkedOld = n[checkedKey];
		n.nocheck = !!n.nocheck;
		n.check_Focus = false;
		n.check_True_Full = true;
		n.check_False_Full = true;
		n.getCheckStatus = function() {return data.getCheckStatus(setting, n);};
	},
	_beforeA = function(setting, node, html) {
		var checkedKey = setting.data.key.checked;
		if (setting.check.enable) {
			data.makeChkFlag(setting, node);
			if (setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL && node[checkedKey] ) {
				var r = data.getRoot(setting);
				r.radioCheckedList.push(node);
			}
			html.push("<button type='button' ID='", node.tId, consts.id.CHECK, "' class='", view.makeChkClass(setting, node), "' treeNode", consts.id.CHECK," onfocus='this.blur();' ",(node.nocheck === true?"style='display:none;'":""),"></button>");
		}
	},
	_zTreeTools = function(setting, zTreeTools) {
		zTreeTools.checkNode = function(node, checked, checkTypeFlag) {
			var checkedKey = this.setting.data.key.checked;
			if (tools.uCanDo(this.setting) && this.setting.check.enable && node.nocheck !== true) {
				node[checkedKey] = !!checked;
				var checkObj = $("#" + node.tId + consts.id.CHECK);
				if (checkTypeFlag) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
				setting.treeObj.trigger(consts.event.CHECK, [setting.treeId, node]);
			}
		}

		zTreeTools.checkAllNodes = function(checked) {
			view.repairAllChk(this.setting, checked);
		}

		zTreeTools.getCheckedNodes = function(checked) {
			var childsKey = this.setting.data.key.childs;
			checked = (checked != false);
			return data.getTreeCheckedNodes(this.setting, data.getRoot(setting)[childsKey], checked);
		}

		zTreeTools.getChangeCheckedNodes = function() {
			var childsKey = this.setting.data.key.childs;
			return data.getTreeChangeCheckedNodes(this.setting, data.getRoot(setting)[childsKey]);
		}

		var _updateNode = zTreeTools.updateNode;
		zTreeTools.updateNode = function(node, checkTypeFlag) {
			if (_updateNode) _updateNode.apply(zTreeTools, arguments);
			if (!node || !this.setting.check.enable) return;
			var nObj = $("#" + node.tId);
			if (nObj.get(0) && tools.uCanDo(this.setting)) {
				var checkObj = $("#" + node.tId + consts.id.CHECK);
				if (checkTypeFlag == true) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
			}
		}
	},

	_data = {
		getCheckStatus: function(setting, node) {
			if (!setting.check.enable || node.nocheck) return null;
			var checkedKey = setting.data.key.checked,
			r = {
				checked: node[checkedKey],
				half: ((node[checkedKey] || setting.check.chkStyle == consts.radio.STYLE) ? (!node.check_True_Full) : (!node.check_False_Full) )
			};
			return r;
		},
		getTreeCheckedNodes: function(setting, nodes, checked, results) {
			if (!nodes) return [];
			var childsKey = setting.data.key.childs,
			checkedKey = setting.data.key.checked;
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i][checkedKey] == checked) {
					results.push(nodes[i]);
				}
				data.getTreeCheckedNodes(setting, nodes[i][childsKey], checked, results);
			}
			return results;
		},
		getTreeChangeCheckedNodes: function(setting, nodes, results) {
			if (!nodes) return [];
			var childsKey = setting.data.key.childs,
			checkedKey = setting.data.key.checked;
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i][checkedKey] != nodes[i].checkedOld) {
					results.push(nodes[i]);
				}
				data.getTreeChangeCheckedNodes(setting, nodes[i][childsKey], results);
			}
			return results;
		},
		makeChkFlag: function(setting, node) {
			if (!node) return;
			var childsKey = setting.data.key.childs,
			checkedKey = setting.data.key.checked,
			chkFlag = {"trueFlag": true, "falseFlag": true};
			if (node[childsKey]) {
				for (var i = 0, l = node[childsKey].length; i < l; i++) {
					var tmpTrue = (node[childsKey][i].nocheck === true) ? false : node[childsKey][i][checkedKey],
					tmpFalse = (node[childsKey][i].nocheck === true) ? false : !node[childsKey][i][checkedKey];
					if (setting.check.chkStyle == consts.radio.STYLE && (tmpTrue || !node[childsKey][i].check_True_Full)) {
						chkFlag.trueFlag = false;
					} else if (setting.check.chkStyle != consts.radio.STYLE && node[checkedKey] && (tmpFalse || !node[childsKey][i].check_True_Full)) {
						chkFlag.trueFlag = false;
					} else if (setting.check.chkStyle != consts.radio.STYLE && !node[checkedKey] && (tmpTrue || !node[childsKey][i].check_False_Full)) {
						chkFlag.falseFlag = false;
					}
					if (!chkFlag.trueFlag || !chkFlag.falseFlag) break;
				}
			}
			node.check_True_Full = chkFlag.trueFlag;
			node.check_False_Full = chkFlag.falseFlag;
		}
	},

	_event = {

	},

	_handler = {
		onCheckNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId),
			checkedKey = setting.data.key.checked;
			if (tools.apply(setting.callback.beforeCheck, [setting.treeId, node], true) == false) return true;
			node[checkedKey] = !node[checkedKey];
			view.checkNodeRelation(setting, node);
			var checkObj = $("#" + node.tId + consts.id.CHECK);
			view.setChkClass(setting, checkObj, node);
			view.repairParentChkClassWithSelf(setting, node);
			setting.treeObj.trigger(consts.event.CHECK, [setting.treeId, node]);
			return true;
		},
		onMouseoverCheck: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			checkObj = $("#" + node.tId + consts.id.CHECK);
			node.checkboxFocus = true;
			view.setChkClass(setting, checkObj, node);
			return true;
		},
		onMouseoutCheck: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			checkObj = $("#" + node.tId + consts.id.CHECK);
			node.checkboxFocus = false;
			view.setChkClass(setting, checkObj, node);
			return true;
		}
	},

	_tools = {

	},

	_view = {
		checkNodeRelation: function(setting, node) {
			var pNode, i, l,
			childsKey = setting.data.key.childs,
			checkedKey = setting.data.key.checked,
			r = consts.radio;
			if (setting.check.chkStyle == r.STYLE) {
				var radioCheckedList = data.getRoot(setting).radioCheckedList;
				if (node[checkedKey]) {
					if (setting.check.radioType == r.TYPE_ALL) {
						for (i = radioCheckedList.length-1; i >= 0; i--) {
							pNode = radioCheckedList[i];
							pNode[checkedKey] = false;
							radioCheckedList.splice(i, 1);

							view.setChkClass(setting, $("#" + pNode.tId + consts.id.CHECK), pNode);
							if (pNode.parentTId != node.parentTId) {
								view.repairParentChkClassWithSelf(setting, pNode);
							}
						}
						radioCheckedList.push(node);
					} else {
						var parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
						for (i = 0, l = parentNode[childsKey].length; i < l; i++) {
							pNode = parentNode[childsKey][i];
							if (pNode[checkedKey] && pNode != node) {
								pNode[checkedKey] = false;
								view.setChkClass(setting, $("#" + pNode.tId + consts.id.CHECK), pNode);
							}
						}
					}
				} else if (setting.check.radioType == r.TYPE_ALL) {
					for (i = 0, l = radioCheckedList.length; i < l; i++) {
						if (node == radioCheckedList[i]) {
							radioCheckedList.splice(i, 1);
							break;
						}
					}
				}

			} else {
				if (node[checkedKey] && setting.check.chkboxType.Y.indexOf("s") > -1) {
					view.setSonNodeCheckBox(setting, node, true);
				}
				if (node[checkedKey] && setting.check.chkboxType.Y.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, true);
				}
				if (!node[checkedKey] && setting.check.chkboxType.N.indexOf("s") > -1) {
					view.setSonNodeCheckBox(setting, node, false);
				}
				if (!node[checkedKey] && setting.check.chkboxType.N.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, false);
				}
			}
		},
		makeChkClass: function(setting, node) {
			var checkedKey = setting.data.key.checked,
			c = consts.checkbox, r = consts.radio,
			chkName = setting.check.chkStyle + "_" + (node[checkedKey] ? c.TRUE : c.FALSE)
			+ "_" + ((node[checkedKey] || setting.check.chkStyle == r.STYLE) ? (node.check_True_Full? c.FULL:c.PART) : (node.check_False_Full? c.FULL:c.PART) );
			chkName = node.checkboxFocus ? chkName + "_" + c.FOCUS : chkName;
			return c.DEFAULT + " " + chkName;
		},
		repairAllChk: function(setting, checked) {
			var checkedKey = setting.data.key.checked,
			childsKey = setting.data.key.childs,
			root = data.getRoot(setting);
			if (setting.check.enable) {
				for (var i = 0, l = root[childsKey].length; i<l ; i++) {
					var node = root[childsKey][i];
					node[checkedKey] = checked;
					view.setSonNodeCheckBox(setting, node, checked);
				}
			}
		},
		repairChkClass: function(setting, node) {
			if (!node) return;
			data.makeChkFlag(setting, node);
			var checkObj = $("#" + node.tId + consts.id.CHECK);
			view.setChkClass(setting, checkObj, node);
		},
		repairParentChkClass: function(setting, node) {
			if (!node || !node.parentTId) return;
			var pNode = node.getParentNode();
			view.repairChkClass(setting, pNode);
			view.repairParentChkClass(setting, pNode);
		},
		repairParentChkClassWithSelf: function(setting, node) {
			if (!node) return;
			var childsKey = setting.data.key.childs;
			if (node[childsKey] && node[childsKey].length > 0) {
				view.repairParentChkClass(setting, node[childsKey][0]);
			} else {
				view.repairParentChkClass(setting, node);
			}
		},
		setChkClass: function(setting, obj, node) {
			if (!obj) return;
			if (node.nocheck === true) {
				obj.hide();
			} else {
				obj.show();
			}
			obj.removeClass();
			obj.addClass(view.makeChkClass(setting, node));
		},
		setParentNodeCheckBox: function(setting, node, value) {
			var childsKey = setting.data.key.childs,
			checkedKey = setting.data.key.checked,
			checkObj = $("#" + node.tId + consts.id.CHECK);
			if (node.nocheck !== true) {
				node[checkedKey] = value;
				view.setChkClass(setting, checkObj, node);
			}
			if (node.parentTId) {
				var pSign = true;
				if (!value) {
					for (var i = 0, l = node.getParentNode()[childsKey].length; i < l; i++) {
						if (node.getParentNode()[childsKey][i][checkedKey]) {
							pSign = false;
							break;
						}
					}
				}
				if (pSign) {
					view.setParentNodeCheckBox(setting, node.getParentNode(), value);
				}
			}
		},
		setSonNodeCheckBox: function(setting, node, value) {
			if (!node) return;
			var childsKey = setting.data.key.childs,
			checkedKey = setting.data.key.checked,
			checkObj = $("#" + node.tId + consts.id.CHECK);

			if (node != data.getRoot(setting) && node.nocheck !== true) {
				node[checkedKey] = value;
				node.check_True_Full = true;
				node.check_False_Full = true;
				view.setChkClass(setting, checkObj, node);
			}

			if (!node[childsKey]) return;
			for (var i = 0, l = node[childsKey].length; i < l; i++) {
				if (node[childsKey][i]) view.setSonNodeCheckBox(setting, node[childsKey][i], value);
			}
		}
	},

	_z = {
		tools: _tools,
		view: _view,
		event: _event,
		data: _data
	};
	$.extend(true, $.fn.zTree.consts, _consts);
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree,
	tools = zt._z.tools,
	consts = zt.consts,
	view = zt._z.view,
	data = zt._z.data,
	event = zt._z.event;

	data.exSetting(_setting);
	data.addInitBind(_bindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy);
	data.addInitRoot(_initRoot);
	data.addBeforeA(_beforeA);
	data.addZTreeTools(_zTreeTools);

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode) {
		if (_createNodes) _createNodes.apply(view, arguments);
		if (!nodes) return;
		view.repairParentChkClassWithSelf(setting, parentNode);
	}
})(jQuery);