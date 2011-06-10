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
	var settings = [], roots = [], cache = [], zId = 0,
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
	_root = {
		childs:[],
		expandTriggerFlag: false,
		curSelectedList: [],
		curEditNode: null,
		proxyList: []
	};
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
				exRoot: function(s) {
					$.extend(true, _root, s);
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

			},
			logic: {
				
		}
		},
		init: function(obj, zSetting, zNodes) {
			var setting = zt._z.tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeObjId = $(obj).attr("id");
			setting.treeObj = $(obj);

			var root = zt._z.tools.clone(_root);

		}
	};

	var zt = $.fn.zTree;
})(jQuery);