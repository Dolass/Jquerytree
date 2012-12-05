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
	//default event proxy of exLib
	_eventProxy = function(e) {},
	//default init node of exLib
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {},
	//add dom for check
	_beforeA = function(setting, node, html) {},
	//update zTreeObj, add method of exLib
	_zTreeTools = function(setting, zTreeTools) {
//		zTreeTools.xxx1 = function() {}
//		zTreeTools.xxx2 = function() {}
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
	_view = {},

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

//	Override method in core
//	var _createNodes = view.createNodes;
//	view.createNodes = function(setting, level, nodes, parentNode) {
//		if (_createNodes) _createNodes.apply(view, arguments);
//		if (!nodes) return;
//		view.repairParentChkClassWithSelf(setting, parentNode);
//	}
	
})(jQuery);