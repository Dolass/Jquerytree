/*
 * JQuery zTree 2.0
 * http://code.google.com/p/jquerytree/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Date: 2010-07-18
 *
 */

(function($) {

	var ZTREE_CLICK = "ZTREE_CLICK";
	var ZTREE_CHANGE = "ZTREE_CHANGE";
	var ZTREE_DRAG = "ZTREE_DRAG";
	var ZTREE_DROP = "ZTREE_DROP";
	var ZTREE_ASYNC_SUCCESS = "ZTREE_ASYNC_SUCCESS";
	var ZTREE_ASYNC_ERROR = "ZTREE_ASYNC_ERROR";

	var IDMark_Switch = "_switch";
	var IDMark_Icon = "_ico";
	var IDMark_Span = "_span";
	var IDMark_Input = "_input";
	var IDMark_Edit = "_edit";
	var IDMark_Del = "_del";
	var IDMark_Ul = "_ul";
	var IDMark_A = "_a";

	var LineMark_Root = "root";
	var LineMark_Roots = "roots";
	var LineMark_Center = "center";
	var LineMark_Bottom = "bottom";
	var LineMark_NoLine = "noLine";
	var LineMark_Line = "line";

	var FolderMark_Open = "open";
	var FolderMark_Close = "close";
	var FolderMark_Docu = "docu";

	var Class_CurSelectedNode = "curSelectedNode";
	var Class_CurSelectedNode_Edit = "curSelectedNode_Edit";
	var Class_TmpTargetTree = "tmpTargetTree";
	var Class_TmpTargetNode = "tmpTargetNode";
	
	var Check_Style_Box = "checkbox";
	var Check_Style_Radio = "radio";
	var CheckBox_Default = "chk";
	var CheckBox_False = "false";
	var CheckBox_True = "true";
	var CheckBox_Full = "full";
	var CheckBox_Part = "part";
	var CheckBox_Focus = "focus";
	var Radio_Type_All = "all";
	var Radio_Type_Level = "level";

	var settings = new Array();
	var zTreeId = 0;

	//zTree构造函数
	$.fn.zTree = function(zTreeSetting, zTreeNodes) {

		var setting = {
			//Tree 唯一标识，主UL的ID
			treeObjId: "",
			//是否显示CheckBox
			checkable: false,
			//是否在编辑状态
			editable: false,
			//是否显示树的线
			showLine: true,
			//当前被选择的TreeNode
			curTreeNode: null,
			//当前正被编辑的TreeNode
			curEditTreeNode: null,
			//是否处于拖拽期间 0: not Drag; 1: doing Drag
			dragStatus: 0,
			dragNodeShowBefore: false,
			//选择CheckBox 或 Radio
			checkStyle: Check_Style_Box,
			//checkBox点击后影响父子节点设置（checkStyle=Check_Style_Radio时无效） 			
			checkType: {
				"Y": "ps",
				"N": "ps"
			},
			//radio 最大个数限制类型，每一级节点限制 或 整棵Tree的全部节点限制（checkStyle=Check_Style_Box时无效）
			checkRadioType:Radio_Type_Level,
			//checkRadioType = Radio_Type_All 时，保存被选择节点的堆栈
			checkRadioCheckedList:[],
			//是否异步获取节点数据
			async: false,
			//获取节点数据的URL地址
			asyncUrl: "",
			//获取节点数据时，必须的数据名称，例如：id、name
			asyncParam: [],
			//其它参数
			asyncParamOther: [],
			root: {
				isRoot: true,
				nodes: []
			} // 例子：{ "id":0,	"name":"tree",	"icon":"",	"url":"",	"target":"_self"}
		};

		if (zTreeSetting) {
			$.extend(setting, zTreeSetting);
		}

		setting.treeObjId = this.attr("id");
		setting.root.tId = -1;
		setting.root.name = "ZTREE ROOT";
		setting.root.isRoot = true;
		setting.checkRadioCheckedList = [];
		zTreeId = 0;

		if (zTreeNodes) {
			setting.root.nodes = zTreeNodes;
		}
		settings[setting.treeObjId] = setting;

		$("#" + setting.treeObjId).empty();

		if (setting.root.nodes && setting.root.nodes.length > 0) {
			initTreeNodes(setting, 0, setting.root.nodes);
		} else if (setting.async && setting.asyncUrl && setting.asyncUrl.length > 0) {
			asyncGetNode(setting);
		}
		
		bindTreeNodes(this);

		return new zTreePlugin().init(this);

	};

	//绑定事件
	function bindTreeNodes(treeObj) {
		treeObj.unbind(ZTREE_CLICK);		
		treeObj.bind(ZTREE_CLICK, function (event, treeId, treeNode) {
		  if ((typeof zTreeOnClick) == "function") zTreeOnClick(event, treeId, treeNode);
		});

		treeObj.unbind(ZTREE_CHANGE);
		treeObj.bind(ZTREE_CHANGE, function (event, treeId, treeNode) {
		  if ((typeof zTreeOnChange) == "function") zTreeOnChange(event, treeId, treeNode);
		});

		treeObj.unbind(ZTREE_DRAG);
		treeObj.bind(ZTREE_DRAG, function (event, treeId, treeNode) {
		  if ((typeof zTreeOnDrag) == "function") zTreeOnDrag(event, treeId, treeNode);
		});

		treeObj.unbind(ZTREE_DROP);
		treeObj.bind(ZTREE_DROP, function (event, treeId, treeNode, targetNode) {
		  if ((typeof zTreeOnDrop) == "function") zTreeOnDrop(event, treeId, treeNode, targetNode);
		});

		treeObj.unbind(ZTREE_ASYNC_SUCCESS);
		treeObj.bind(ZTREE_ASYNC_SUCCESS, function (event, treeId, msg) {
		  if ((typeof zTreeOnAsyncSuccess) == "function") zTreeOnAsyncSuccess(event, treeId, msg);
		});

		treeObj.unbind(ZTREE_ASYNC_ERROR);
		treeObj.bind(ZTREE_ASYNC_ERROR, function (event, treeId, XMLHttpRequest, textStatus, errorThrown) {
		  if ((typeof zTreeOnAsyncError) == "function") zTreeOnAsyncError(event, treeId, XMLHttpRequest, textStatus, errorThrown);
		});
		
	}

	//初始化并显示节点Json对象
	function initTreeNodes(setting, level, treeNodes, parentNode) {
		if (!treeNodes) return;

		for (var i = 0; i < treeNodes.length; i++) {
			var node = treeNodes[i];
			node.level = level;
			node.tId = setting.treeObjId + "_" + (++zTreeId);
			node.parentNode = parentNode;
			node.checkedNew = (node.checkedNew == undefined)? (node.checked == true) : node.checkedNew;
			node.check_Focus = false;
			node.check_True_Full = true;
			node.check_False_Full = true;
			node.editNameStatus = false;

			var tmpParentNode = (parentNode) ? parentNode: setting.root;

			//允许在非空节点上增加节点
			node.isFirstNode = (tmpParentNode.nodes.length == treeNodes.length) && (i == 0);
			node.isLastNode = (i == (treeNodes.length - 1));

			if (node.nodes && node.nodes.length > 0) {
				node.open = (node.open) ? true: false;
				node.isParent = true;
				showTree(setting, node);
				initTreeNodes(setting, level + 1, node.nodes, node);

			} else {
				node.isParent = (node.isParent) ? true: false;
				showTree(setting, node);
				
				//只在末级节点的最后一个进行checkBox修正
				if (setting.checkable && i == treeNodes.length - 1) {
					repairParentChkClass(setting, node);
				}
			}
		}
	}

	//显示单个节点
	function showTree(setting, treeNode) {

		//获取父节点
		var p = treeNode.parentNode;
		if (!p) {
			p = $("#" + setting.treeObjId);
		} else {
			p = $("#" + treeNode.parentNode.tId + IDMark_Ul);
		}

		var html = "<li id='" + treeNode.tId + "' class='tree-node'>" + "<button class=\"switch\" id='" + treeNode.tId + IDMark_Switch + "' title='' onfocus='this.blur();'></button>" + "<a id='" + treeNode.tId + IDMark_A + "' onclick=\"" + (treeNode.click || '') + "\" ><button class=\"" + treeNode.iconSkin + " ico\" id='" + treeNode.tId + IDMark_Icon + "' title='' onfocus='this.blur();'></button><span id='" + treeNode.tId + IDMark_Span + "'></span></a>" + "<ul id='" + treeNode.tId + IDMark_Ul + "'></ul>" + "</li>";
		p.append(html);
		
		var switchObj = $("#" + treeNode.tId + IDMark_Switch);
		var aObj = $("#" + treeNode.tId + IDMark_A);
		var nObj = $("#" + treeNode.tId + IDMark_Span);
		var ulObj = $("#" + treeNode.tId + IDMark_Ul);
		
		nObj.text(treeNode.name);
		var icoObj = $("#" + treeNode.tId + IDMark_Icon);

		//设置Line、Ico等css属性
		if (setting.showLine) {
			if (treeNode.level == 0 && treeNode.isFirstNode && treeNode.isLastNode) {
				switchObj.attr("class", switchObj.attr("class") + "_" + LineMark_Root);
			} else if (treeNode.level == 0 && treeNode.isFirstNode) {
				switchObj.attr("class", switchObj.attr("class") + "_" + LineMark_Roots);
			} else if (treeNode.isLastNode) {
				switchObj.attr("class", switchObj.attr("class") + "_" + LineMark_Bottom);
			} else {
				switchObj.attr("class", switchObj.attr("class") + "_" + LineMark_Center);
			}
			if (!treeNode.isLastNode) {
				ulObj.addClass(LineMark_Line);
			}
		} else {
			switchObj.attr("class", switchObj.attr("class") + "_" + LineMark_NoLine);
		}
		if (treeNode.isParent) {
			var tmpOpen = (treeNode.open ? ("_" + FolderMark_Open) : ("_" + FolderMark_Close));
			switchObj.attr("class", switchObj.attr("class") + tmpOpen);
			icoObj.attr("class", icoObj.attr("class") + tmpOpen);
		} else {
			switchObj.attr("class", switchObj.attr("class") + "_" + FolderMark_Docu);
			icoObj.attr("class", icoObj.attr("class") + "_" + FolderMark_Docu);
		}
		if (treeNode.icon) icoObj.attr("style", "background:url(" + treeNode.icon + ") 0 0 no-repeat;");

		//增加树节点展开、关闭事件
		ulObj.css({
			"display": (treeNode.open ? "block": "none")
		});
		if (treeNode.isParent) {
			switchObj.bind('click', {
				treeObjId: setting.treeObjId,
				treeNode: treeNode
			},
			onSwitchNode);
			aObj.bind('dblclick', {
				treeObjId: setting.treeObjId,
				treeNode: treeNode
			},
			onSwitchNode);
		}
		aObj.bind('click',
		function() {
			//除掉默认事件，防止文本被选择
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			//设置节点为选中状态
			selectNode(setting, treeNode);
			//触发click事件
			$("#" + setting.treeObjId).trigger(ZTREE_CLICK, [setting.treeObjId, treeNode]);
		});

		//显示CheckBox Or Radio
		if (setting.checkable) {
			switchObj.after("<BUTTON type='BUTTON' ID='" + treeNode.tId + "_check' onfocus='this.blur();' ></BUTTON>");
			
			var checkObj = $("#" + treeNode.tId + "_check");
			
			if (setting.checkStyle == Check_Style_Radio && setting.checkRadioType == Radio_Type_All && treeNode.checkedNew ) {
				setting.checkRadioCheckedList = setting.checkRadioCheckedList.concat([treeNode]);
			}
			
			setChkClass(setting, checkObj, treeNode);
			
			checkObj.bind('click',
			function() {
				treeNode.checkedNew = !treeNode.checkedNew;
				if (setting.checkStyle == Check_Style_Radio) {
					if (treeNode.checkedNew) {
						if (setting.checkRadioType == Radio_Type_All) {
							for (var i = setting.checkRadioCheckedList.length-1; i >= 0; i--) {
								var pNode = setting.checkRadioCheckedList[i];
								pNode.checkedNew = false;
								setting.checkRadioCheckedList.splice(i, 1);
								
								setChkClass(setting, $("#" + pNode.tId + "_check"), pNode);
								if (pNode.parentNode != treeNode.parentNode) {
									repairParentChkClassWithSelf(setting, pNode);
								}
							}
							setting.checkRadioCheckedList = setting.checkRadioCheckedList.concat([treeNode]);
						} else {
							var parentNode = (treeNode.parentNode) ? treeNode.parentNode : setting.root;
							for (var son = 0; son < parentNode.nodes.length; son++) {
								var pNode = parentNode.nodes[son];
								if (pNode.checkedNew && pNode != treeNode) {
									pNode.checkedNew = false;
									setChkClass(setting, $("#" + pNode.tId + "_check"), pNode);
								}
							}
						}
					} else if (setting.checkRadioType == Radio_Type_All) {
						for (var i = 0; i < setting.checkRadioCheckedList.length; i++) {
							if (treeNode == setting.checkRadioCheckedList[i]) {
								setting.checkRadioCheckedList.splice(i, 1);
								break;
							}
						}
					}
					
				} else {
					if (treeNode.checkedNew && setting.checkType.Y.indexOf("p") > -1) {
						setParentNodeCheckBox(setting, treeNode, true);
					}
					if (treeNode.checkedNew && setting.checkType.Y.indexOf("s") > -1) {
						setSonNodeCheckBox(setting, treeNode, true);
					}
					if (!treeNode.checkedNew && setting.checkType.N.indexOf("p") > -1) {
						setParentNodeCheckBox(setting, treeNode, false);
					}
					if (!treeNode.checkedNew && setting.checkType.N.indexOf("s") > -1) {
						setSonNodeCheckBox(setting, treeNode, false);
					}
				}
				setChkClass(setting, checkObj, treeNode);
				repairParentChkClassWithSelf(setting, treeNode);

				//触发 CheckBox 点击事件
				$("#" + setting.treeObjId).trigger(ZTREE_CHANGE, [setting.treeObjId, treeNode]);

			});
			
			checkObj.bind('mouseover',
			function() {
				treeNode.checkboxFocus = true;
				setChkClass(setting, checkObj, treeNode);
			});

			checkObj.bind('mouseout',
			function() {
				treeNode.checkboxFocus = false;
				setChkClass(setting, checkObj, treeNode);
			});
		}

		aObj.attr("target", (treeNode.target || "_blank"));
		if (treeNode.url && !setting.editable) aObj.attr("href", treeNode.url);
		
		//编辑、删除按钮
		if (setting.editable) {
			aObj.hover(
				function() {
					if (setting.dragStatus == 0) {
						removeEditBtn(treeNode); 
						removeDelBtn(treeNode);
						var editStr = "<button class='edit' id='" + treeNode.tId + IDMark_Edit + "' title='' onfocus='this.blur();'></button>";
						var delStr = "<button class='del' id='" + treeNode.tId + IDMark_Del + "' title='' onfocus='this.blur();'></button>";
						if (treeNode.editNameStatus) {
							editStr = "";
						}
						aObj.append(editStr + delStr);
						
						$("#" + treeNode.tId + IDMark_Edit).bind('click', 
							function() {removeEditBtn(treeNode); editTreeNode(setting, treeNode);}
						).bind('mousedown',
							function(eventMouseDown) {return false;}
						);
						$("#" + treeNode.tId + IDMark_Del).bind('click', 
							function() {removeTreeNode(setting, treeNode);}
						).bind('mousedown',
							function(eventMouseDown) {return false;}
						);
						
					}
				},
				function() {
					removeEditBtn(treeNode); 
					removeDelBtn(treeNode); 
				}
			);
		}

		aObj.bind('mousedown',
		function(eventMouseDown) {

			//右键不能拖拽
			if (eventMouseDown.button == 2 || !setting.editable) return;

			var doc = document;
			var curNode;
			var tmpTarget;

			$(doc).mousemove(function(event) {

				//除掉默认事件，防止文本被选择
				window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

				$("body").css("cursor", "pointer");
				var switchObj = $("#" + treeNode.tId + IDMark_Switch);

				if (setting.dragStatus == 0 && treeNode.isParent && treeNode.open) {
					expandAndCollapseNode(treeNode);
					setting.dragNodeShowBefore = true;
				}

				if (setting.dragStatus == 0 && !treeNode.editNameStatus) {
					setting.dragStatus = 1;

					showIfameMask(true);

					//设置节点为选中状态
					selectNode(setting, treeNode);
					removeEditBtn(treeNode);
					removeDelBtn(treeNode);

					var tmpNode = $("#" + treeNode.tId).clone();
					tmpNode.attr("id", treeNode.tId + "_tmp");
					tmpNode.css("padding", "0");
					tmpNode.children("#" + treeNode.tId + IDMark_A).removeClass(Class_CurSelectedNode);
					tmpNode.children("#" + treeNode.tId + IDMark_Ul).css("display", "none");

					curNode = $("<ul class='zTreeDragUL'></ul>").append(tmpNode);
					curNode.attr("id", treeNode.tId + IDMark_Ul + "_tmp");
					curNode.addClass($("#" + setting.treeObjId).attr("class"));
					curNode.appendTo("body");

					//触发 DRAG 拖拽事件，返回正在拖拽的源数据对象
					$("#" + setting.treeObjId).trigger(ZTREE_DRAG, [setting.treeObjId, treeNode]);

				}

				if (setting.dragStatus == 1) {
					if (tmpTarget) {
						tmpTarget.removeClass(Class_TmpTargetTree);
						tmpTarget.removeClass(Class_TmpTargetNode);
					}
					tmpTarget = null;

					if (event.target.id == setting.treeObjId && treeNode.parentNode != null) {
						//非根节点 移到 根
						tmpTarget = $("#" + setting.treeObjId);
						tmpTarget.addClass(Class_TmpTargetTree);

					} else if (event.target.id && $("#" + setting.treeObjId).find("#" + event.target.id).length > 0) {
						//任意节点 移到 其他节点
						var targetObj = $("#" + event.target.id);
						while (!targetObj.is("li") && targetObj.attr("id") != setting.treeObjId) {
							targetObj = targetObj.parent();
						};

						//如果移到自己 或者自己的父级/子集，则不能当做临时目标
						if (treeNode.parentNode && targetObj.attr("id") != treeNode.tId && targetObj.attr("id") != treeNode.parentNode.tId && $("#" + treeNode.tId).find("#" + targetObj.attr("id")).length == 0) {
							//非根节点移动
							targetObj.children("a").addClass(Class_TmpTargetNode);
							tmpTarget = targetObj.children("a");
						} else if (treeNode.parentNode == null && targetObj.attr("id") != treeNode.tId && $("#" + treeNode.tId).find("#" + targetObj.attr("id")).length == 0) {
							//根节点移动
							targetObj.children("a").addClass(Class_TmpTargetNode);
							tmpTarget = targetObj.children("a");
						}
					}
				}

				var dX = (doc.body.scrollLeft == 0) ? doc.documentElement.scrollLeft: doc.body.scrollLeft;
				var dY = (doc.body.scrollTop == 0) ? doc.documentElement.scrollTop: doc.body.scrollTop;

				if (curNode) {
					curNode.css({
						"top": (event.clientY + dY + 3) + "px",
						"left": (event.clientX + dX + 3) + "px"
					});
				}
				
				return false;

			});

			$(doc).mouseup(function(event) {
				$(doc).unbind("mousemove");
				$(doc).unbind("mouseup");
				$("body").css("cursor", "auto");
				if (tmpTarget) {
					tmpTarget.removeClass(Class_TmpTargetTree);
					tmpTarget.removeClass(Class_TmpTargetNode);
				}
				showIfameMask(false);

				if (setting.dragStatus == 0) return;
				setting.dragStatus = 0;

				if (treeNode.isParent && setting.dragNodeShowBefore && !treeNode.open) {
					expandAndCollapseNode(treeNode);
					setting.dragNodeShowBefore = false;
				}

				if (curNode) curNode.remove();

				//显示树上 移动后的节点							
				if (tmpTarget) {

					var tmpTargetNodeId = "";
					if (tmpTarget.attr("id") == setting.treeObjId) {
						//转移到根节点
						tmpTargetNodeId = null;
					} else {
						//转移到子节点
						tmpTarget = tmpTarget.parent();
						while (!tmpTarget.is("li") && tmpTarget.attr("id") != setting.treeObjId) {
							tmpTarget = tmpTarget.parent();
						};
						tmpTargetNodeId = tmpTarget.attr('id');
					}

					var dragTargetNode = tmpTargetNodeId == null ? null: getTreeNodeByTId(setting.root.nodes, tmpTargetNodeId);

					moveTreeNode(setting, dragTargetNode, treeNode);

					//触发 DROP 拖拽事件，返回拖拽的目标数据对象
					$("#" + setting.treeObjId).trigger(ZTREE_DROP, [setting.treeObjId, treeNode, dragTargetNode]);

				} else {
					//触发 DROP 拖拽事件，返回null
					$("#" + setting.treeObjId).trigger(ZTREE_DROP, [setting.treeObjId, null, null]);
				}
			});
			
			return false;
		});

	}

	//获取对象的绝对坐标
	function getAbsPoint(obj) {
		var r = new Array(2);
		oRect = obj.getBoundingClientRect();
		r[0] = oRect.left;
		r[1] = oRect.top;
		return r;
	}
	
	//设置光标位置函数
	function setCursorPosition(obj, pos){
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

	var dragMaskList = new Array();
	//显示、隐藏 Iframe的遮罩层（主要用于避免拖拽不流畅）
	function showIfameMask(showSign) {
		//清空所有遮罩
		while (dragMaskList.length > 0) {
			dragMaskList[0].remove();
			dragMaskList.shift();
		}
		if (showSign) {
			//显示遮罩
			var iframeList = $("iframe");
			for (var i = 0; i < iframeList.length; i++) {
				var obj = iframeList.get(i);
				var r = getAbsPoint(obj);
				var dragMask = $("<div id='zTreeMask_" + i + "' class='zTreeMask' style='top:" + r[1] + "px; left:" + r[0] + "px; width:" + obj.offsetWidth + "px; height:" + obj.offsetHeight + "px;'></div>");
				dragMask.appendTo("body");
				dragMaskList.push(dragMask);
			}
		}
	}

	//对于button替换class 拼接字符串
	function replaceSwitchClass(obj, newName) {
		if (!obj) return;

		var tmpName = obj.attr("class");
		if (tmpName == undefined) return;
		var tmpList = tmpName.split("_");
		switch (newName) {
		case LineMark_Root:
		case LineMark_Roots:
		case LineMark_Center:
		case LineMark_Bottom:
		case LineMark_NoLine:
			tmpList[1] = newName;
			break;
		case FolderMark_Open:
		case FolderMark_Close:
		case FolderMark_Docu:
			tmpList[2] = newName;
			break;
		}

		obj.attr("class", tmpList.join("_"));
	}
	function replaceIcoClass(obj, newName) {
		if (!obj) return;

		var tmpName = obj.attr("class");
		if (tmpName == undefined) return;
		var tmpList = tmpName.split("_");
		switch (newName) {
		case FolderMark_Open:
		case FolderMark_Close:
		case FolderMark_Docu:
			tmpList[1] = newName;
			break;
		}

		obj.attr("class", tmpList.join("_"));
	}
	
	//删除 编辑、删除按钮
	function removeEditBtn(treeNode) {		
		$("#" + treeNode.tId + IDMark_Edit).unbind().remove();
	}
	function removeDelBtn(treeNode) {		
		$("#" + treeNode.tId + IDMark_Del).unbind().remove();
	}
	
	//设置CheckBox的Class类型，主要用于显示子节点是否全部被选择的样式
	function setChkClass(setting, obj, treeNode) {
		if (!obj) return;
		obj.removeClass();
		var chkName = setting.checkStyle + "_" + (treeNode.checkedNew ? CheckBox_True : CheckBox_False)
			+ "_" + ((treeNode.checkedNew || setting.checkStyle == Check_Style_Radio) ? (treeNode.check_True_Full? CheckBox_Full:CheckBox_Part) : (treeNode.check_False_Full? CheckBox_Full:CheckBox_Part) );
		chkName = treeNode.checkboxFocus ? chkName + "_" + CheckBox_Focus : chkName;
		obj.addClass(CheckBox_Default);
		obj.addClass(chkName);
	}
	//修正父节点选择的样式
	function repairParentChkClass(setting, treeNode) {
		if (!treeNode || !treeNode.parentNode) return;
		var trueSign = true;
		var falseSign = true;
		for (var son = 0; son < treeNode.parentNode.nodes.length; son++) {
			if (setting.checkStyle == Check_Style_Radio && (treeNode.parentNode.nodes[son].checkedNew || !treeNode.parentNode.nodes[son].check_True_Full)) {
				trueSign = false;
			} else if (setting.checkStyle != Check_Style_Radio && treeNode.parentNode.checkedNew && (!treeNode.parentNode.nodes[son].checkedNew || !treeNode.parentNode.nodes[son].check_True_Full)) {
				trueSign = false;
			} else if (setting.checkStyle != Check_Style_Radio && !treeNode.parentNode.checkedNew && (treeNode.parentNode.nodes[son].checkedNew || !treeNode.parentNode.nodes[son].check_False_Full)) {
				falseSign = false;
			}
			if (!trueSign || !falseSign) break;
		}
		treeNode.parentNode.check_True_Full = trueSign;
		treeNode.parentNode.check_False_Full = falseSign;
		var checkObj = $("#" + treeNode.parentNode.tId + "_check");
		setChkClass(setting, checkObj, treeNode.parentNode);
		repairParentChkClass(setting, treeNode.parentNode);
	}	
	function repairParentChkClassWithSelf(setting, treeNode) {
		if (treeNode.nodes && treeNode.nodes.length > 0) {
			repairParentChkClass(setting, treeNode.nodes[0]);
		} else {
			repairParentChkClass(setting, treeNode);
		}
	}

	//点击展开、折叠节点
	function onSwitchNode(event) {
		var setting = settings[event.data.treeObjId];
		var treeNode = event.data.treeNode;
		switchNode(setting, treeNode);
	}

	function switchNode(setting, treeNode) {
		if (treeNode && treeNode.nodes && treeNode.nodes.length > 0) {
			expandAndCollapseNode(treeNode);
		} else if (setting.async && !setting.editable) {
			asyncGetNode(setting, treeNode);
		}
	}

	function asyncGetNode(setting, treeNode) {

		var tmpParam = "";
		for (var i = 0; treeNode && i < setting.asyncParam.length; i++) {
			tmpParam += (tmpParam.length > 0 ? "&": "") + setting.asyncParam[i] + "=" + treeNode[setting.asyncParam[i]];
		}
		for (var i = 0; i < setting.asyncParamOther.length; i += 2) {
			tmpParam += (tmpParam.length > 0 ? "&": "") + setting.asyncParamOther[i] + "=" + setting.asyncParamOther[i + 1];
		}

		$.ajax({
			type: "POST",
			url: setting.asyncUrl,
			data: tmpParam,
			success: function(msg) {
				if (!msg || msg.length == 0) {
					return;
				}
				var newNodes = "";
				try {
					newNodes = eval("(" + msg + ")");
				} catch(err) {}

				if (newNodes && newNodes != "") {
					addTreeNodes(setting, treeNode, newNodes);
				}
				$("#" + setting.treeObjId).trigger(ZTREE_ASYNC_SUCCESS, [setting.treeObjId, msg]);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$("#" + setting.treeObjId).trigger(ZTREE_ASYNC_ERROR, [setting.treeObjId, XMLHttpRequest, textStatus, errorThrown]);
			}
		});
	}

	// 展开 或者 折叠 节点下级
	function expandAndCollapseNode(treeNode) {
		var switchObj = $("#" + treeNode.tId + IDMark_Switch);
		var icoObj = $("#" + treeNode.tId + IDMark_Icon);
		var ulObj = $("#" + treeNode.tId + IDMark_Ul);

		if (treeNode.isParent && treeNode.nodes && treeNode.nodes.length > 0) {
			ulObj.toggle("fast");
			if (switchObj.attr("class").indexOf(FolderMark_Close) > 0) {
				replaceSwitchClass(switchObj, FolderMark_Open);
				replaceIcoClass(icoObj, FolderMark_Open);
				treeNode.open = true;
			} else {
				replaceSwitchClass(switchObj, FolderMark_Close);
				replaceIcoClass(icoObj, FolderMark_Close);
				treeNode.open = false;
			}
		}
	}

	//遍历子节点展开 或 折叠
	function expandCollapseSonNode(treeObjId, treeNode, expandSign) {
		if (!treeObjId) return;

		if (treeNode && treeNode.open != expandSign) {
			expandAndCollapseNode(treeNode);
		}

		var treeNodes = (treeNode) ? treeNode.nodes: settings[treeObjId].root.nodes;

		if (!treeNodes) return;
		for (var son = 0; son < treeNodes.length; son++) {
			if (treeNodes[son]) expandCollapseSonNode(treeObjId, treeNodes[son], expandSign);
		}
	}

	//遍历父节点展开 或 折叠
	function expandCollapseParentNode(treeObjId, treeNode, expandSign) {
		if (!treeObjId) return;

		if (treeNode && treeNode.open != expandSign) {
			expandAndCollapseNode(treeNode);
		}

		if (!treeNode.parentNode) return;
		expandCollapseParentNode(treeObjId, treeNode.parentNode, expandSign);
	}

	//遍历父节点设置checkbox
	function setParentNodeCheckBox(setting, treeNode, value) {
		var checkObj = $("#" + treeNode.tId + "_check");
		treeNode.checkedNew = value;
		setChkClass(setting, checkObj, treeNode);
		if (treeNode.parentNode) {
			var pSign = true;
			if (!value) {
				for (var son = 0; son < treeNode.parentNode.nodes.length; son++) {
					if (treeNode.parentNode.nodes[son].checkedNew) {
						pSign = false;
						break;
					}
				}
			}
			if (pSign) {
				setParentNodeCheckBox(setting, treeNode.parentNode, value);
			}
		}
	}

	//遍历子节点设置checkbox
	function setSonNodeCheckBox(setting, treeNode, value) {
		if (!treeNode) return;
		var checkObj = $("#" + treeNode.tId + "_check");
		
		treeNode.checkedNew = value;
		setChkClass(setting, checkObj, treeNode);
		
		if (!treeNode.nodes) return;
		for (var son = 0; son < treeNode.nodes.length; son++) {
			if (treeNode.nodes[son]) setSonNodeCheckBox(setting, treeNode.nodes[son], value);
		}
	}

	//遍历子节点设置level,主要用于移动节点后的处理
	function setSonNodeLevel(parentNode, treeNode) {
		if (!treeNode) return;
		treeNode.level = (parentNode)? parentNode.level + 1 : 0;
		if (!treeNode.nodes) return;
		for (var son = 0; son < treeNode.nodes.length; son++) {
			if (treeNode.nodes[son]) setSonNodeLevel(treeNode, treeNode.nodes[son]);
		}
	}

	//增加子节点
	function addTreeNodes(setting, parentNode, newNodes) {
		if (parentNode) {
			//目标节点必须在当前树内
			if ($("#" + setting.treeObjId).find("#" + parentNode.tId).length == 0) return;

			target_switchObj = $("#" + parentNode.tId + IDMark_Switch);
			target_icoObj = $("#" + parentNode.tId + IDMark_Icon);
			target_aObj = $("#" + parentNode.tId + IDMark_A);
			target_ulObj = $("#" + parentNode.tId + IDMark_Ul);

			//处理节点在目标节点的图片、线
			if (!parentNode.open) {
				replaceSwitchClass(target_switchObj, FolderMark_Close);
				replaceIcoClass(target_icoObj, FolderMark_Close);			
				parentNode.open = false;
				target_ulObj.css({
					"display": "none"
				});
			}

			//如果目标节点不是父节点，增加树节点展开、关闭事件
			if (!parentNode.isParent) {
				target_switchObj.unbind('click');
				target_switchObj.bind('click',
				function() {
					expandAndCollapseNode(parentNode);
				});
				target_aObj.unbind('dblclick');
				target_aObj.bind('dblclick', {
					treeObjId: setting.treeObjId,
					treeNode: parentNode
				},
				onSwitchNode);
			}

			addTreeNodesData(parentNode, newNodes);
			initTreeNodes(setting, parentNode.level + 1, newNodes, parentNode);
			//如果选择某节点，则必须展开其全部父节点
			expandCollapseParentNode(setting.treeObjId, parentNode, true);
		} else {
			addTreeNodesData(setting.root, newNodes);
			initTreeNodes(setting, 0, newNodes, null);
		}
	}

	//增加节点数据
	function addTreeNodesData(parentNode, treenodes) {
		if (!parentNode.nodes) parentNode.nodes = [];
		if (parentNode.nodes.length > 0) {
			var tmpId = parentNode.nodes[parentNode.nodes.length - 1].tId;
			parentNode.nodes[parentNode.nodes.length - 1].isLastNode = false;
			if (parentNode.nodes[parentNode.nodes.length - 1].isFirstNode) {
				replaceSwitchClass($("#" + tmpId + IDMark_Switch), LineMark_Roots);
			} else {
				replaceSwitchClass($("#" + tmpId + IDMark_Switch), LineMark_Center);
			}
			$("#" + tmpId + IDMark_Ul).addClass(LineMark_Line);
		}
		parentNode.isParent = true;
		parentNode.nodes = parentNode.nodes.concat(treenodes);
	}

	//移动子节点
	function moveTreeNode(setting, targetNode, treeNode) {
		if (targetNode == treeNode) return;
		var oldParentNode = treeNode.parentNode == null ? setting.root: treeNode.parentNode;

		var targetNodeIsRoot = (targetNode === null || targetNode == setting.root);
		if (targetNodeIsRoot && targetNode === null) targetNode = setting.root;

		var src_switchObj = $("#" + treeNode.tId + IDMark_Switch);
		var src_ulObj = $("#" + treeNode.tId + IDMark_Ul);

		var targetObj;
		var target_switchObj;
		var target_icoObj;
		var target_aObj;
		var target_ulObj;

		if (targetNodeIsRoot) {
			//转移到根节点
			targetObj = $("#" + setting.treeObjId);
			target_ulObj = targetObj;

		} else {
			//转移到子节点
			target_switchObj = $("#" + targetNode.tId + IDMark_Switch);
			target_icoObj = $("#" + targetNode.tId + IDMark_Icon);
			target_aObj = $("#" + targetNode.tId + IDMark_A);
			target_ulObj = $("#" + targetNode.tId + IDMark_Ul);
		}

		//处理节点在目标处的图片、线
		replaceSwitchClass(target_switchObj, FolderMark_Open);
		replaceIcoClass(target_icoObj, FolderMark_Open);
		targetNode.open = true;
		target_ulObj.css({
			"display": "block"
		});

		//如果目标节点不是父节点，且不是根，增加树节点展开、关闭事件
		if (!targetNode.isParent && !targetNodeIsRoot) {
			target_switchObj.unbind('click');
			target_switchObj.bind('click',
			function() {
				expandAndCollapseNode(targetNode);
			});
			target_aObj.unbind('dblclick');
			target_aObj.bind('dblclick', {
				treeObjId: setting.treeObjId,
				treeNode: targetNode
			},
			onSwitchNode);
		}

		target_ulObj.append($("#" + treeNode.tId).detach());

		//进行数据结构修正
		var tmpSrcIndex = -1;
		for (var i = 0; i < oldParentNode.nodes.length; i++) {
			if (oldParentNode.nodes[i].tId == treeNode.tId) tmpSrcIndex = i;
		}
		if (tmpSrcIndex >= 0) {
			oldParentNode.nodes.splice(tmpSrcIndex, 1);
		}

		if (!targetNode.nodes) {
			targetNode.nodes = new Array();
		} else if (setting.showLine && targetNode.nodes.length > 0) {
			//处理目标节点中当前最后一个节点的图标、线
			targetNode.nodes[targetNode.nodes.length - 1].isLastNode = false;
			var tmp_ulObj = $("#" + targetNode.nodes[targetNode.nodes.length - 1].tId + IDMark_Ul);
			var tmp_switchObj = $("#" + targetNode.nodes[targetNode.nodes.length - 1].tId + IDMark_Switch);
			tmp_ulObj.addClass(LineMark_Line);
			if (targetNodeIsRoot && targetNode.nodes[targetNode.nodes.length - 1].isFirstNode) {
				//节点 移到 根，并且原来只有一个根节点
				replaceSwitchClass(tmp_switchObj, LineMark_Roots);

			} else {
				replaceSwitchClass(tmp_switchObj, LineMark_Center);
			}
		}

		//数据节点转移
		if (targetNodeIsRoot) {
			//成为根节点，则不操作目标节点数据
			treeNode.parentNode = null;
		} else {
			//成为子节点		
			targetNode.isParent = true;
			treeNode.parentNode = targetNode;
		}
		setSonNodeLevel(treeNode.parentNode, treeNode);
		targetNode.nodes.splice(targetNode.nodes.length, 0, treeNode);

		treeNode.isLastNode = true;
		treeNode.isFirstNode = (targetNode.nodes.length == 1);
		//设置被移动节点为最后一个节点
		if (setting.showLine) {
			replaceSwitchClass(src_switchObj, LineMark_Bottom);
			src_ulObj.removeClass(LineMark_Line);
		}

		//处理原节点的父节点的图标、线
		if (oldParentNode.nodes.length < 1) {
			//原所在父节点无子节点
			oldParentNode.isParent = false;
			var tmp_ulObj = $("#" + oldParentNode.tId + IDMark_Ul);
			var tmp_switchObj = $("#" + oldParentNode.tId + IDMark_Switch);
			var tmp_icoObj = $("#" + oldParentNode.tId + IDMark_Icon);
			replaceSwitchClass(tmp_switchObj, FolderMark_Docu);
			replaceIcoClass(tmp_icoObj, FolderMark_Docu);
			tmp_ulObj.css("display", "none");

		} else if (setting.showLine) {
			//原所在父节点有子节点
			oldParentNode.nodes[oldParentNode.nodes.length - 1].isLastNode = true;
			oldParentNode.nodes[oldParentNode.nodes.length - 1].isFirstNode = (oldParentNode.nodes.length == 1);
			var tmp_ulObj = $("#" + oldParentNode.nodes[oldParentNode.nodes.length - 1].tId + IDMark_Ul);
			var tmp_switchObj = $("#" + oldParentNode.nodes[oldParentNode.nodes.length - 1].tId + IDMark_Switch);
			var tmp_icoObj = $("#" + oldParentNode.nodes[oldParentNode.nodes.length - 1].tId + IDMark_Icon);
			if (oldParentNode == setting.root) {
				if (oldParentNode.nodes.length == 1) {
					//原为根节点 ，且移动后只有一个根节点
					replaceSwitchClass(tmp_switchObj, LineMark_Root);
				} else {
					var tmp_first_switchObj = $("#" + oldParentNode.nodes[0].tId + IDMark_Switch);
					replaceSwitchClass(tmp_first_switchObj, LineMark_Roots);
					replaceSwitchClass(tmp_switchObj, LineMark_Bottom);
				}

			} else {
				replaceSwitchClass(tmp_switchObj, LineMark_Bottom);
			}

			tmp_ulObj.removeClass(LineMark_Line);
		}

		//移动后，则必须展开新位置的全部父节点
		expandCollapseParentNode(setting.treeObjId, targetNode, true);
	}
	
	//编辑子节点名称
	function editTreeNode(setting, treeNode) {
		
		$("#" + treeNode.tId + IDMark_A).addClass(Class_CurSelectedNode_Edit);
		$("#" + treeNode.tId + IDMark_Span).html("<input type=text class='rename' id='" + treeNode.tId + IDMark_Input + "'>");
		
		var inputObj = $("#" + treeNode.tId + IDMark_Input);
		inputObj.attr("value", treeNode.name);
		inputObj.focus();
		setCursorPosition(inputObj.get(0), treeNode.name.length);
		treeNode.editNameStatus = true;
		setting.curEditTreeNode = treeNode;
		
		//拦截A的mousedown监听
		inputObj.bind('mousedown',
				function(eventMouseDown) {
			//setting.editNameStatus = true;
		});
		inputObj.bind('mouseup',
				function(eventMouseDown) {
			//setting.editNameStatus = false;
		});
		inputObj.bind('click',
				function(eventMouseDown) {
			return false;
		});
		
	}

	//删除子节点
	function removeTreeNode(setting, treeNode) {
		var parentNode = treeNode.parentNode == null ? setting.root: treeNode.parentNode;
		if (setting.curTreeNode === treeNode) setting.curTreeNode = null;
		if (setting.curEditTreeNode === treeNode) setting.curEditTreeNode = null;

		$("#" + treeNode.tId).remove();

		//进行数据结构修正
		var tmpSrcIndex = -1;
		for (var i = 0; i < parentNode.nodes.length; i++) {
			if (parentNode.nodes[i].tId == treeNode.tId) tmpSrcIndex = i;
		}
		if (tmpSrcIndex >= 0) {
			parentNode.nodes.splice(tmpSrcIndex, 1);
		}

		//处理原节点的父节点的图标、线
		if (parentNode.nodes.length < 1) {
			//原所在父节点无子节点
			parentNode.isParent = false;
			var tmp_ulObj = $("#" + parentNode.tId + IDMark_Ul);
			var tmp_switchObj = $("#" + parentNode.tId + IDMark_Switch);
			var tmp_icoObj = $("#" + parentNode.tId + IDMark_Icon);
			replaceSwitchClass(tmp_switchObj, FolderMark_Docu);
			replaceIcoClass(tmp_icoObj, FolderMark_Docu);
			tmp_ulObj.css("display", "none");

		} else if (setting.showLine) {
			//原所在父节点有子节点
			parentNode.nodes[parentNode.nodes.length - 1].isLastNode = true;
			parentNode.nodes[parentNode.nodes.length - 1].isFirstNode = (parentNode.nodes.length == 1);
			var tmp_ulObj = $("#" + parentNode.nodes[parentNode.nodes.length - 1].tId + IDMark_Ul);
			var tmp_switchObj = $("#" + parentNode.nodes[parentNode.nodes.length - 1].tId + IDMark_Switch);
			var tmp_icoObj = $("#" + parentNode.nodes[parentNode.nodes.length - 1].tId + IDMark_Icon);
			if (parentNode == setting.root) {
				if (parentNode.nodes.length == 1) {
					//原为根节点 ，且移动后只有一个根节点
					replaceSwitchClass(tmp_switchObj, LineMark_Root);
				} else {
					var tmp_first_switchObj = $("#" + parentNode.nodes[0].tId + IDMark_Switch);
					replaceSwitchClass(tmp_first_switchObj, LineMark_Roots);
					replaceSwitchClass(tmp_switchObj, LineMark_Bottom);
				}

			} else {
				replaceSwitchClass(tmp_switchObj, LineMark_Bottom);
			}

			tmp_ulObj.removeClass(LineMark_Line);
		}
	}

	//根据 tId 获取 节点的数据对象
	function getTreeNodeByTId(treeNodes, treeId) {
		if (!treeNodes || !treeId) return null;
		for (var i = 0; i < treeNodes.length; i++) {
			if (treeNodes[i].tId == treeId) {
				return treeNodes[i];
			}
			var tmp = getTreeNodeByTId(treeNodes[i].nodes, treeId);
			if (tmp) return tmp;
		}
		return null;
	}

	//取消之前选中节点状态
	function canclePreSelectedNode(setting) {
		if (setting.curTreeNode) {
			$("#" + setting.curTreeNode.tId + IDMark_A).removeClass(Class_CurSelectedNode_Edit);
			$("#" + setting.curTreeNode.tId + IDMark_A).removeClass(Class_CurSelectedNode);
			$("#" + setting.curTreeNode.tId + IDMark_Span).text(setting.curTreeNode.name);
		}
	}
	//取消之前编辑节点状态
	function canclePreEditNode(setting) {
		if (setting.curEditTreeNode) {
			$("#" + setting.curEditTreeNode.tId + IDMark_A).removeClass(Class_CurSelectedNode_Edit);
			$("#" + setting.curEditTreeNode.tId + IDMark_A).removeClass(Class_CurSelectedNode);
			$("#" + setting.curEditTreeNode.tId + IDMark_Span).text(setting.curEditTreeNode.name);
			setting.curEditTreeNode.editNameStatus = false;
		}
	}
	
	//设置节点为当前选中节点
	function selectNode(setting, treeNode) {
		
		if (setting.curTreeNode == treeNode) return;
		canclePreSelectedNode(setting);	
		canclePreEditNode(setting);
		$("#" + treeNode.tId + IDMark_A).addClass(Class_CurSelectedNode);
		setting.curTreeNode = treeNode;
	}
	
	//获取全部 checked = true or false 的节点集合
	function getTreeCheckedNodes(treeNodes, checked) {
		if (!treeNodes) return [];
		var results = [];
		for (var i = 0; i < treeNodes.length; i++) {
			if (treeNodes[i].checkedNew == checked) {
				results = results.concat([treeNodes[i]]);
			}
			var tmp = getTreeCheckedNodes(treeNodes[i].nodes, checked);
			if (tmp.length > 0) results = results.concat(tmp);
		}
		return results;
	}

	function zTreePlugin(){
		return {
			container:null,

			init: function(obj) {
				this.container = obj;
				return this;
			},

			refresh : function() {
				var treeObjId = this.container.attr("id");
				$("#" + treeObjId).empty();
				settings[treeObjId].curTreeNode = null;
				zTreeId = 0;
				initTreeNodes(settings[treeObjId], 0, settings[treeObjId].root.nodes);
			},

			setEditable : function(editable) {
				var treeObjId = this.container.attr("id");
				settings[treeObjId].editable = editable;
				return this.refresh();
			},

			getNodes : function() {
				var treeObjId = this.container.attr("id");
				return settings[treeObjId].root.nodes;
			},

			getSelectedNode : function() {
				var treeObjId = this.container.attr("id");
				return settings[treeObjId].curTreeNode;
			},

			getCheckedNodes : function(selected) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId) return;
				selected = (selected != false);
				return getTreeCheckedNodes(settings[treeObjId].root.nodes, selected);
			},

			getNodeByTId : function(treeId) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId || !treeId) return;
				return getTreeNodeByTId(settings[treeObjId].root.nodes, treeId);
			},
			
			getNodeIndex : function(treeNode) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId || !treeNode) return;
				var parentNode = (treeNode.parentNode == null) ? settings[treeObjId].root : treeNode.parentNode;
				for (var i=0; i<parentNode.nodes.length; i++) {
					if (parentNode.nodes[i] == treeNode) return i;
				}
				return -1;
			},

			expandAll : function(expandSign) {
				var treeObjId = this.container.attr("id");
				expandCollapseSonNode(treeObjId, null, expandSign);
			},

			expandNode : function(treeNode, expandSign, sonSign) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId || !treeNode) return;

				if (sonSign) {
					expandCollapseSonNode(treeObjId, treeNode, expandSign);
				} else if (treeNode.open != expandSign) {
					switchNode(settings[treeObjId], treeNode);
				}

				if (expandSign) {
					//如果展开某节点，则必须展开其全部父节点
					expandCollapseParentNode(treeObjId, treeNode, expandSign);
				}
			},

			selectNode : function(treeNode) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId || !treeNode) return;

				selectNode(settings[treeObjId], treeNode);
				//如果选择某节点，则必须展开其全部父节点
				expandCollapseParentNode(treeObjId, treeNode, true);
			},

			addNodes : function(parentNode, newNodes) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId || !newNodes) return;
				if (!parentNode) parentNode = null;
				addTreeNodes(settings[treeObjId], parentNode, newNodes);

			},

			moveNode : function(targetNode, treeNode) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId || !treeNode) return;
				
				if (targetNode && (treeNode.parentNode == targetNode || $("#" + treeNode.tId).find("#" + targetNode.tId).length > 0)) {
					return;
				} else if (!targetNode) {
					targetNode = null;
				}
				moveTreeNode(settings[treeObjId], targetNode, treeNode);
			},

			removeNode : function(treeNode) {
				var treeObjId = this.container.attr("id");
				if (!treeObjId || !treeNode) return;
				removeTreeNode(settings[treeObjId], treeNode);
			}

		};
	};



})(jQuery);