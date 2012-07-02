(function($){
	//default consts of exLib
	var _consts = {},
	//default setting of exLib
	_setting = {},
	//default root of exLib
	_initRoot = function (setting) {},
	//default cache of exLib
	_initCache = function(treeId) {},
	//default bind event of exLib
	_bindEvent = function(setting) {},
	//default init node of exLib
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		n.isHidden = !!n.isHidden;
	},
	//add dom for check
	_beforeA = function(setting, node, html) {},
	//update zTreeObj, add method of exLib
	_zTreeTools = function(setting, zTreeTools) {
		zTreeTools.showNodes = function(nodes, options) {
			if (!nodes || nodes.length == 0) {
				return;
			}

		}
		zTreeTools.showNode = function(node, options) {
			if (!node) {
				return;
			}
			
		}
		zTreeTools.hideNodes = function(nodes, options) {
			view.hideNodes(setting, nodes, options);
		}
		zTreeTools.hideNode = function(node, options) {
			if (!node) {
				return;
			}
			view.hideNodes(setting, [node], options);
		}
	},
	//method of operate data
	_data = {},
	//method of event proxy
	_event = {},
	//method of event handler
	_handler = {},
	//method of tools for zTree
	_tools = {},
	//method of operate ztree dom
	_view = {
		makeDOMNodeMainBefore: function(html, setting, node) {
			html.push("<li ", (node.isHidden ? "style='display:none;' " : ""), "id='", node.tId, "' class='level", node.level,"' tabindex='0' hidefocus='true' treenode>");
		},
		showNode: function(setting, node, options) {
			node.isHidden = false;
			$("#" + node.tId).show();
		},
		hideNodes: function(setting, nodes, options) {
			if (!nodes || nodes.length == 0) {
				return;
			}
			var pList = {}, i, j;
			for (i=0, j=nodes.length; i<j; i++) {
				var n = nodes[i];
				if ((n.isFirstNode || n.isLastNode) && !pList[n.parentTId]) {
					var pn = n.getParentNode();
					pList[n.parentTId] = (pn === null) ? data.getRoot(setting) : n.getParentNode();
				}
				view.hideNode(setting, n, options);
			}
			for (var tId in pList) {
				var children = pList[tId][setting.data.key.children];
				view.setFirstNodeForHide(setting, children);
				view.setLastNodeForHide(setting, children);
			}
			
		},
		hideNode: function(setting, node, options) {
			node.isHidden = true;
			node.isFirstNode = false;
			node.isLastNode = false;
			$("#" + node.tId).hide();
		},
		setFirstNodeForHide: function(setting, nodes) {
			var n,i,j;
			for(i=0, j=nodes.length; i<j; i++) {
				n = nodes[i];
				if (n.isFirstNode) {
					return;
				}
				if(!n.isHidden && !n.isFirstNode) {
					n.isFirstNode = true;
					view.setNodeLineIcos(setting, n);
					break;
				}
			}			
		},
		setLastNodeForHide: function(setting, nodes) {
			var n,i;
			for(i=nodes.length-1; i>=0; i--) {
				n = nodes[i];
				if (n.isLastNode) {
					return;
				}
				if(!n.isHidden && !n.isLastNode) {
					n.isLastNode = true;
					view.setNodeLineIcos(setting, n);
					break;
				}
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
	data.addInitRoot(_initRoot);
	data.addBeforeA(_beforeA);
	data.addZTreeTools(_zTreeTools);

//	Override method in core
//	var _createNodes = view.createNodes;
//	view.createNodes = function(setting, level, nodes, parentNode) {
//		if (_createNodes) _createNodes.apply(view, arguments);
//		if (!nodes) return;
//		view.repairParentChkClassWithSelf(setting, parentNode);
//	}

})(jQuery);