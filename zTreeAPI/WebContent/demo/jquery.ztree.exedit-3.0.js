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
			MINMOVESIZE: 5,
			BORDERMAX: 10,
			BORDERMIN: -5
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
		r.dragFlag = 0;
		r.dragNodeShowBefore = false;
		r.dragMaskList = new Array();
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
		n.editNameFlag = false;
	},
//	_beforeA = function(setting, node, html) {},
	_zTreeTools = function(setting, obj) {
		obj.zTreeTools.addNodes = function(parentNode, newNodes, isSilent) {
			if (!newNodes) return;
			if (!parentNode) parentNode = null;
			var xNewNodes = tools.isArray(newNodes)? newNodes: [newNodes];
			view.addNodes(this.setting, parentNode, xNewNodes, (isSilent==true));
		}
		obj.zTreeTools.cancelEditName = function(newName) {
			var root = data.getRoot(this.setting);
			var nameKey = this.setting.data.key.name;
			if (!root.curEditNode) return;
			var node = root.curEditNode;
			view.cancelCurEditNode(this.setting, newName?newName:node[nameKey]);
		}
		obj.zTreeTools.copyNode = function(targetNode, node, moveType) {
			if (!node) return null;
			var newNode = tools.clone(node);
			if (!targetNode) {
				targetNode = null;
				moveType = consts.move.TYPE_INNER;
			}
			if (moveType == consts.move.TYPE_INNER) {
				view.addNodes(this.setting, targetNode, [newNode]);
			} else {
				view.addNodes(this.setting, targetNode.parentNode, [newNode]);
				view.moveNode(this.setting, targetNode, newNode, moveType, false);
			}
			return newNode;
		}
		obj.zTreeTools.editName = function(node) {
			if (!node) return;
			if (tools.uCanDo(this.setting)) {
				view.editNode(this.setting, node)
			}
		}
		obj.zTreeTools.moveNode = function(targetNode, node, moveType) {
			if (!node) return;
			if (targetNode && ((node.parentTId == targetNode.tId && moveType == consts.move.TYPE_INNER) || $("#" + node.tId).find("#" + targetNode.tId).length > 0)) {
				return;
			} else if (!targetNode) {
				targetNode = null;
			}
			view.moveNode(this.setting, targetNode, node, moveType, false);
		}
		obj.zTreeTools.removeNode = function(node) {
			if (!node) return;
			view.removeNode(this.setting, node);
		}
		obj.zTreeTools.setEditable = function(editable) {
			this.setting.edit.enable = editable;
			return this.refresh();
		}

	};
	
	var _data = {
		setSonNodeLevel: function(setting, parentNode, node) {
			if (!node) return;
			var childsKey = setting.data.key.childs;
			node.level = (parentNode)? parentNode.level + 1 : 0;
			if (!node[childsKey]) return;
			for (var i = 0, l = node[childsKey].length; i < l; i++) {
				if (node[childsKey][i]) data.setSonNodeLevel(setting, node, node[childsKey][i]);
			}
		}
	};

	var _event = {

	};

	var _handler = {
		onHoverOverNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode != node) {
				_handler.onHoverOutNode(event);
			}
			root.curHoverNode = node;
			view.addHoverDom(setting, node);
		},
		onHoverOutNode: function(event, node) {
			var setting = data.getSetting(event.data.treeId),
			root = data.getRoot(setting);
			if (root.curHoverNode && !data.isSelectedNode(setting, root.curHoverNode)) {
				view.removeTreeDom(setting, root.curHoverNode);
				root.curHoverNode = null;
			}
		},
		onMousedownNode: function(eventMouseDown, node) {
			var setting = data.getSetting(eventMouseDown.data.treeId),
			root = data.getRoot(setting);
			//右键、禁用拖拽功能 不能拖拽
			if (eventMouseDown.button == 2 || !setting.edit.enable || (!setting.edit.drag.isCopy && !setting.edit.drag.isMove)) return true;
			//编辑输入框内不能拖拽节点
			var target = eventMouseDown.target;
			if (node.editNameFlag && tools.eqs(target.tagName, "input") && target.getAttribute("treeNode"+consts.id.INPUT) !== null) {
				return true;
			}

			var doc = $(document);
			var curNode;
			var tmpArrow;
			var tmpTarget;
			var isOtherTree = false;
			var targetSetting = setting;
			var preTmpTargetNodeId = null;
			var preTmpMoveType = null;
			var tmpTargetNodeId = null;
			var moveType = consts.move.TYPE_INNER;
			var mouseDownX = eventMouseDown.clientX;
			var mouseDownY = eventMouseDown.clientY;
			var startTime = (new Date()).getTime();

			doc.bind("mousemove", _docMouseMove);
			function _docMouseMove(event) {
				tools.noSel(setting);

				//避免鼠标误操作，对于第一次移动小于consts.move.MINMOVESIZE时，不开启拖拽功能
				if (root.dragFlag == 0 && Math.abs(mouseDownX - event.clientX) < consts.move.MINMOVESIZE
					&& Math.abs(mouseDownY - event.clientY) < consts.move.MINMOVESIZE) {
					return true;
				}
				$("body").css("cursor", "pointer");

				if (root.dragFlag == 0 && node.isParent && node.open) {
					view.expandCollapseNode(setting, node, !node.open);
					root.dragNodeShowBefore = true;
				}
				if (root.dragFlag == 0) {
					//避免beforeDrag alert时，得到返回值之前仍能拖拽的Bug
					root.dragFlag = -1;
					if (tools.apply(setting.callback.beforeDrag, [setting.treeId, node], true) == false) return true;

					root.dragFlag = 1;
					setting.edit.showHoverDom = false;
					tools.showIfameMask(setting, true);

					//设置节点为选中状态
					node.editNameFlag = false;
					view.selectNode(setting, node);
					view.removeTreeDom(setting, node);

					var tmpNode = $("#" + node.tId).clone();
					tmpNode.attr("id", node.tId + "_tmp");
					tmpNode.css("padding", "0");
					tmpNode.children("#" + node.tId + consts.id.A).removeClass(consts.node.CURSELECTED);
					tmpNode.children("#" + node.tId + consts.id.UL).css("display", "none");

					curNode = $("<ul class='zTreeDragUL'></ul>").append(tmpNode);
					curNode.attr("id", node.tId + consts.id.UL + "_tmp");
					curNode.addClass(setting.treeObj.attr("class"));
					curNode.appendTo("body");

					tmpArrow = $("<button class='tmpzTreeMove_arrow'></button>");
					tmpArrow.attr("id", "zTreeMove_arrow_tmp");
					tmpArrow.appendTo("body");

					//触发 DRAG 拖拽事件，返回正在拖拽的源数据对象
					setting.treeObj.trigger(consts.event.DRAG, [setting.treeId, node]);
				}

				if (root.dragFlag == 1 && tmpArrow.attr("id") != event.target.id) {
					if (tmpTarget) {
						tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
						if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE);
					}
					tmpTarget = null;
					tmpTargetNodeId = null;

					//判断是否不同的树
					isOtherTree = false;
					targetSetting = setting;
					var settings = data.getSettings();
					for (var s in settings) {
						if (settings[s].edit.enable && settings[s].treeId != setting.treeId
							&& (event.target.id == settings[s].treeId || $(event.target).parents("#" + settings[s].treeId).length>0)) {
							isOtherTree = true;
							targetSetting = settings[s];
						}
					}

					var docScrollTop = doc.scrollTop();
					var docScrollLeft = doc.scrollLeft();
					var treeOffset = targetSetting.treeObj.offset();
					var scrollHeight = targetSetting.treeObj.get(0).scrollHeight;
					var scrollWidth = targetSetting.treeObj.get(0).scrollWidth;
					var dTop = (event.clientY + docScrollTop - treeOffset.top);
					var dBottom = (targetSetting.treeObj.height() + treeOffset.top - event.clientY - docScrollTop);
					var dLeft = (event.clientX + docScrollLeft - treeOffset.left);
					var dRight = (targetSetting.treeObj.width() + treeOffset.left - event.clientX - docScrollLeft);
					var isTop = (dTop < consts.move.BORDERMAX && dTop > consts.move.BORDERMIN);
					var isBottom = (dBottom < consts.move.BORDERMAX && dBottom > consts.move.BORDERMIN);
					var isLeft = (dLeft < consts.move.BORDERMAX && dLeft > consts.move.BORDERMIN);
					var isRight = (dRight < consts.move.BORDERMAX && dRight > consts.move.BORDERMIN);
					var isTreeInner = dTop > consts.move.BORDERMIN && dBottom > consts.move.BORDERMIN && dLeft > consts.move.BORDERMIN && dRight > consts.move.BORDERMIN;
					var isTreeTop = (isTop && targetSetting.treeObj.scrollTop() <= 0);
					var isTreeBottom = (isBottom && (targetSetting.treeObj.scrollTop() + targetSetting.treeObj.height()+10) >= scrollHeight);
					var isTreeLeft = (isLeft && targetSetting.treeObj.scrollLeft() <= 0);
					var isTreeRight = (isRight && (targetSetting.treeObj.scrollLeft() + targetSetting.treeObj.width()+10) >= scrollWidth);

					if (event.target.id && targetSetting.treeObj.find("#" + event.target.id).length > 0) {
						//任意节点 移到 其他节点
						var targetObj = event.target;
						while (targetObj && targetObj.tagName && !tools.eqs(targetObj.tagName, "li") && targetObj.id != targetSetting.treeId) {
							targetObj = targetObj.parentNode;
						}

						var canMove = false;
						//如果移到自己 或者自己的子集，则不能当做临时目标
						if (node.parentTId && targetObj.id != node.tId && $("#" + node.tId).find("#" + targetObj.id).length == 0) {
							//非根节点移动
							canMove = true;
						} else if (!node.parentTId && targetObj.id != node.tId && $("#" + node.tId).find("#" + targetObj.id).length == 0) {
							//根节点移动
							canMove = true;
						}
						if (canMove) {
							if (event.target.id &&
								(event.target.id == (targetObj.id + consts.id.A) || $(event.target).parents("#" + targetObj.id + consts.id.A).length > 0)) {
								tmpTarget = $(targetObj);
								tmpTargetNodeId = targetObj.id;
							}
						}
					}

					//确保鼠标在zTree内部
					if (isTreeInner && (event.target.id == targetSetting.treeId || $(event.target).parents("#" + targetSetting.treeId).length>0)) {
						//只有移动到zTree容器的边缘才算移到 根（排除根节点在本棵树内的移动）
						if (!tmpTarget && (isTreeTop || isTreeBottom || isTreeLeft || isTreeRight) && (isOtherTree || (!isOtherTree && node.parentTId))) {
							tmpTarget = targetSetting.treeObj;
							tmpTarget.addClass(consts.node.TMPTARGET_TREE);
						}
						//滚动条自动滚动
						if (isTop) {
							targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()-10);
						} else if (isBottom)  {
							targetSetting.treeObj.scrollTop(targetSetting.treeObj.scrollTop()+10);
						}
						if (isLeft) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()-10);
						} else if (isRight) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+10);
						}
						//目标节点在可视区域左侧，自动移动横向滚动条
						if (tmpTarget && tmpTarget != targetSetting.treeObj && tmpTarget.offset().left < targetSetting.treeObj.offset().left) {
							targetSetting.treeObj.scrollLeft(targetSetting.treeObj.scrollLeft()+ tmpTarget.offset().left - targetSetting.treeObj.offset().left);
						}
					}

					curNode.css({
						"top": (event.clientY + docScrollTop + 3) + "px",
						"left": (event.clientX + docScrollLeft + 3) + "px"
					});

					var dX = 0;
					var dY = 0;
					if (tmpTarget && tmpTarget.attr("id")!=targetSetting.treeId) {
						var tmpTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId);
						var tmpNodeObj = $("#" + node.tId);
						var isPrev = (tmpNodeObj.prev().attr("id") == tmpTargetNodeId) ;
						var isNext = (tmpNodeObj.next().attr("id") == tmpTargetNodeId) ;
						var isInner = (node.parentTId && node.parentTId == tmpTargetNodeId) ;

						var canPrev = !isNext;
						var canNext = !isPrev;
						var canInner = !isInner && !(targetSetting.data.keep.leaf && !tmpTargetNode.isParent);
						if (!canPrev && !canNext && !canInner) {
							tmpTarget = null;
							tmpTargetNodeId = "";
							moveType = consts.move.TYPE_INNER;
							tmpArrow.css({
								"display":"none"
							});
							if (window.zTreeMoveTimer) {
								clearTimeout(window.zTreeMoveTimer);
							}
						} else {
							var tmpTargetA = $("#" + tmpTargetNodeId + consts.id.A, tmpTarget);
							tmpTargetA.addClass(consts.node.TMPTARGET_NODE);

							var prevPercent = canPrev ? (canInner ? 0.25 : (canNext ? 0.5 : 1) ) : -1;
							var nextPercent = canNext ? (canInner ? 0.75 : (canPrev ? 0.5 : 0) ) : -1;
							var dY_percent = (event.clientY + docScrollTop - tmpTargetA.offset().top)/tmpTargetA.height();
							if ((prevPercent==1 ||dY_percent<=prevPercent && dY_percent>=-.2) && canPrev) {
								dX = 1 - tmpArrow.width();
								dY = 0 - tmpArrow.height()/2;
								moveType = consts.move.TYPE_BEFORE;
							} else if ((nextPercent==0 || dY_percent>=nextPercent && dY_percent<=1.2) && canNext) {
								dX = 1 - tmpArrow.width();
								dY = tmpTargetA.height() - tmpArrow.height()/2;
								moveType = consts.move.TYPE_AFTER;
							}else {
								dX = 5 - tmpArrow.width();
								dY = 0;
								moveType = consts.move.TYPE_INNER;
							}
							tmpArrow.css({
								"display":"block",
								"top": (tmpTargetA.offset().top + dY) + "px",
								"left": (tmpTargetA.offset().left + dX) + "px"
							});

							if (preTmpTargetNodeId != tmpTargetNodeId || preTmpMoveType != moveType) {
								startTime = (new Date()).getTime();
							}
							if (moveType == consts.move.TYPE_INNER) {
								window.zTreeMoveTimer = setTimeout(function() {
									if (moveType != consts.move.TYPE_INNER) return;
									var targetNode = data.getNodeCache(targetSetting, tmpTargetNodeId);
									if (targetNode && targetNode.isParent && !targetNode.open && (new Date()).getTime() - startTime > 500
										&& tools.apply(targetSetting.callback.beforeDragOpen, [targetSetting.treeId, targetNode], true)) {
										view.switchNode(targetSetting, targetNode);
									}
								}, 600);
							}
						}
					} else {
						moveType = consts.move.TYPE_INNER;
						tmpArrow.css({
							"display":"none"
						});
						if (window.zTreeMoveTimer) {
							clearTimeout(window.zTreeMoveTimer);
						}
					}
					preTmpTargetNodeId = tmpTargetNodeId;
					preTmpMoveType = moveType;
				}
				return false;
			}

			doc.bind("mouseup", _docMouseUp);
			function _docMouseUp(event) {
				if (window.zTreeMoveTimer) {
					clearTimeout(window.zTreeMoveTimer);
				}
				preTmpTargetNodeId = null;
				preTmpMoveType = null;
				doc.unbind("mousemove", _docMouseMove);
				doc.unbind("mouseup", _docMouseUp);
				doc.unbind("selectstart", _docSelect);
				$("body").css("cursor", "auto");
				if (tmpTarget) {
					tmpTarget.removeClass(consts.node.TMPTARGET_TREE);
					if (tmpTargetNodeId) $("#" + tmpTargetNodeId + consts.id.A, tmpTarget).removeClass(consts.node.TMPTARGET_NODE);
				}
				tools.showIfameMask(setting, false);

				setting.edit.showHoverDom = true;
				if (root.dragFlag == 0) return;
				root.dragFlag = 0;

				if (node.isParent && root.dragNodeShowBefore && !node.open) {
					view.expandCollapseNode(setting, node, !node.open);
					root.dragNodeShowBefore = false;
				}

				if (curNode) curNode.remove();
				if (tmpArrow) tmpArrow.remove();

				//显示树上 移动后的节点
				if (tmpTarget && tmpTargetNodeId && node.parentTId && tmpTargetNodeId==node.parentTId && moveType == consts.move.TYPE_INNER) {
					tmpTarget = null;
				}
				if (tmpTarget) {
					var dragTargetNode = tmpTargetNodeId == null ? null: data.getNodeCache(targetSetting, tmpTargetNodeId);
					if (tools.apply(setting.callback.beforeDrop, [targetSetting.treeId, node, dragTargetNode, moveType], true) == false) return;
					var isCopy = (event.ctrlKey && setting.edit.drag.isMove && setting.edit.drag.isCopy) || (!setting.edit.drag.isMove && setting.edit.drag.isCopy);

					var newNode = isCopy ? tools.clone(node) : node;
					if (isOtherTree) {
						if (!isCopy) {view.removeNode(setting, node);}
						if (moveType == consts.move.TYPE_INNER) {
							view.addNodes(targetSetting, dragTargetNode, [newNode]);
						} else {
							view.addNodes(targetSetting, dragTargetNode.getParentNode(), [newNode]);
							view.moveNode(targetSetting, dragTargetNode, newNode, moveType, false);
						}
					}else {
						if (isCopy) {
							if (moveType == consts.move.TYPE_INNER) {
								view.addNodes(targetSetting, dragTargetNode, [newNode]);
							} else {
								view.addNodes(targetSetting, dragTargetNode.getParentNode(), [newNode]);
								view.moveNode(targetSetting, dragTargetNode, newNode, moveType, false);
							}
						} else {
							view.moveNode(targetSetting, dragTargetNode, newNode, moveType);
						}
					}
					view.selectNode(targetSetting, newNode);
					$("#" + newNode.tId + consts.id.ICON).focus().blur();

					//触发 DROP 拖拽事件，返回拖拽的目标数据对象
					setting.treeObj.trigger(consts.event.DROP, [targetSetting.treeId, newNode, dragTargetNode, moveType]);

				} else {
					//触发 DROP 拖拽事件，返回null
					setting.treeObj.trigger(consts.event.DROP, [setting.treeId, null, null, null]);
				}
			}

			doc.bind("selectstart", _docSelect);
			function _docSelect() {
				return false;
			}
			return true;
		}
	};

	var _tools = {
		getAbs: function (obj) {
			var oRect = obj.getBoundingClientRect();
			return [oRect.left,oRect.top]
		},
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
		},
		showIfameMask: function(setting, showSign) {
			var root = data.getRoot(setting);
			//清空所有遮罩
			while (root.dragMaskList.length > 0) {
				root.dragMaskList[0].remove();
				root.dragMaskList.shift();
			}
			if (showSign) {
				//显示遮罩
				var iframeList = $("iframe");
				for (var i = 0, l = iframeList.length; i < l; i++) {
					var obj = iframeList.get(i);
					var r = tools.getAbs(obj);
					var dragMask = $("<div id='zTreeMask_" + i + "' class='zTreeMask' style='background-color:yellow;opacity: 0.3;filter: alpha(opacity=30);    top:" + r[1] + "px; left:" + r[0] + "px; width:" + obj.offsetWidth + "px; height:" + obj.offsetHeight + "px;'></div>");
					dragMask.appendTo("body");
					root.dragMaskList.push(dragMask);
				}
			}
		}
	};

	var _view = {
		addEditBtn: function(setting, node) {
			if (node.editNameFlag || $("#" + node.tId + consts.id.EDIT).length > 0) {
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
					if (tools.apply(setting.callback.beforeEditName, [setting.treeId, node], true) == false) return true;
					view.editNode(setting, node);
					return false;
				}
				).show();
		},
		addRemoveBtn: function(setting, node) {
			if (node.editNameFlag || $("#" + node.tId + consts.id.REMOVE).length > 0) {
				return;
			}
			if (!tools.apply(setting.edit.showRemoveBtn, [node], setting.edit.showRemoveBtn)) {
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
		cancelCurEditNode: function (setting, newName) {
			var root = data.getRoot(setting);
			var nameKey = setting.data.key.name;
			var node = root.curEditNode;
			if (node) {
				var inputObj = root.curEditInput;
				newName = newName ? newName:inputObj.val();
				if ( tools.apply(setting.callback.beforeRename, [setting.treeId, node, newName], true) === false) {
					node.editNameStatus = true;
					tools.inputFocus(inputObj);
					return false;
				} else if (newName !== node[nameKey]) {
					node[nameKey] = newName ? newName:inputObj.val();
					setting.treeObj.trigger(consts.event.EDITNAME, [setting.treeId, node]);
				}
				var aObj = $("#" + node.tId + consts.id.A);
				aObj.removeClass(consts.node.CURSELECTED_EDIT);
				inputObj.unbind();
				view.setNodeName(setting, node);
				node.editNameFlag = false;
				root.curEditNode = null;
				root.curEditInput = null;
				view.selectNode(setting, node, false);
			}
			root.noSelection = true;
			return true;
		},
		editNode: function(setting, node) {
			var root = data.getRoot(setting);
			if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
				return;
			}
			var nameKey = setting.data.key.name;
			node.editNameFlag = true;
			view.removeTreeDom(setting, node);
			view.cancelCurEditNode(setting);
			view.selectNode(setting, node, false);
			$("#" + node.tId + consts.id.SPAN).html("<input type=text class='rename' id='" + node.tId + consts.id.INPUT + "' treeNode" + consts.id.INPUT + " >");

			var inputObj = $("#" + node.tId + consts.id.INPUT);
			inputObj.attr("value", node[nameKey]);
			tools.inputFocus(inputObj);

			inputObj.bind('blur', function(event) {
				view.cancelCurEditNode(setting);
			}).bind('keyup', function(event) {
				if (event.keyCode=="13") {
					view.cancelCurEditNode(setting);
				} else if (event.keyCode=="27") {
					view.cancelCurEditNode(setting, node[nameKey]);
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
		},
		moveNode: function(setting, targetNode, node, moveType, animateFlag) {
			var root = data.getRoot(setting);
			var childsKey = setting.data.key.childs;
			if (targetNode == node) return;
			if (setting.data.keep.leaf && targetNode && !targetNode.isParent && moveType == consts.move.TYPE_INNER) return;
			var oldParentNode = (node.parentTId ? node.getParentNode(): root);

			var targetNodeIsRoot = (targetNode === null || targetNode == root);
			if (targetNodeIsRoot && targetNode === null) targetNode = root;
			if (targetNodeIsRoot) moveType = consts.move.TYPE_INNER;
			var targetParentNode = (targetNode.parentTId ? targetNode.getParentNode() : root);

			if (moveType != consts.move.TYPE_BEFORE && moveType != consts.move.TYPE_AFTER) {
				moveType = consts.move.TYPE_INNER;
			}

			//进行数据结构修正
			var i,l;
			var tmpSrcIndex = -1;
			var tmpTargetIndex = 0;
			var oldNeighbor = null;
			var newNeighbor = null;
			if (node.isFirstNode) {
				tmpSrcIndex = 0;
				if (oldParentNode[childsKey].length > 1 ) {
					oldNeighbor = oldParentNode[childsKey][1];
					oldNeighbor.isFirstNode = true;
				}
			} else if (node.isLastNode) {
				tmpSrcIndex = oldParentNode[childsKey].length -1;
				oldNeighbor = oldParentNode[childsKey][tmpSrcIndex - 1];
				oldNeighbor.isLastNode = true;
			} else {
				for (i = 0, l = oldParentNode[childsKey].length; i < l; i++) {
					if (oldParentNode[childsKey][i].tId == node.tId) {
						tmpSrcIndex = i;
						break;
					}
				}
			}
			if (tmpSrcIndex >= 0) {
				oldParentNode[childsKey].splice(tmpSrcIndex, 1);
			}
			if (moveType != consts.move.TYPE_INNER) {
				for (i = 0, l = targetParentNode[childsKey].length; i < l; i++) {
					if (targetParentNode[childsKey][i].tId == targetNode.tId) tmpTargetIndex = i;
				}
			}
			if (moveType == consts.move.TYPE_INNER) {
				if (targetNodeIsRoot) {
					//成为根节点，则不操作目标节点数据
					node.parentTId = null;
				} else {
					targetNode.isParent = true;
					node.parentTId = targetNode.tId;
				}

				if (!targetNode[childsKey]) targetNode[childsKey] = new Array();
				if (targetNode[childsKey].length > 0) {
					newNeighbor = targetNode[childsKey][targetNode[childsKey].length - 1];
					newNeighbor.isLastNode = false;
				}
				targetNode[childsKey].splice(targetNode[childsKey].length, 0, node);
				node.isLastNode = true;
				node.isFirstNode = (targetNode[childsKey].length == 1);
			} else if (targetNode.isFirstNode && moveType == consts.move.TYPE_BEFORE) {
				targetParentNode[childsKey].splice(tmpTargetIndex, 0, node);
				newNeighbor = targetNode;
				newNeighbor.isFirstNode = false;
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = true;
				node.isLastNode = false;

			} else if (targetNode.isLastNode && moveType == consts.move.TYPE_AFTER) {
				targetParentNode[childsKey].splice(tmpTargetIndex + 1, 0, node);
				newNeighbor = targetNode;
				newNeighbor.isLastNode = false;
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = false;
				node.isLastNode = true;

			} else {
				if (moveType == consts.move.TYPE_BEFORE) {
					targetParentNode[childsKey].splice(tmpTargetIndex, 0, node);
				} else {
					targetParentNode[childsKey].splice(tmpTargetIndex + 1, 0, node);
				}
				node.parentTId = targetNode.parentTId;
				node.isFirstNode = false;
				node.isLastNode = false;
			}
			data.fixPIdKeyValue(setting, node);
			data.setSonNodeLevel(setting, node.getParentNode(), node);

			//进行HTML结构修正
			var targetObj;
			var target_switchObj;
			var target_icoObj;
			var target_ulObj;

			if (targetNodeIsRoot) {
				//转移到根节点
				targetObj = setting.treeObj;
				target_ulObj = targetObj;
			} else {
				//转移到子节点
				targetObj = $("#" + targetNode.tId);
				target_switchObj = $("#" + targetNode.tId + consts.id.SWITCH);
				target_icoObj = $("#" + targetNode.tId + consts.id.ICON);
				target_ulObj = $("#" + targetNode.tId + consts.id.UL);
			}

			//处理目标节点
			if (moveType == consts.move.TYPE_INNER) {
				view.replaceSwitchClass(target_switchObj, consts.folder.OPEN);
				view.replaceIcoClass(targetNode, target_icoObj, consts.folder.OPEN);
				targetNode.open = true;
				target_ulObj.css({"display":"block"});
				target_ulObj.append($("#" + node.tId).remove(null, true));
			} else if (moveType == consts.move.TYPE_BEFORE) {
				targetObj.before($("#" + node.tId).remove(null, true));

			} else if (moveType == consts.move.TYPE_AFTER) {
				targetObj.after($("#" + node.tId).remove(null, true));
			}

			//处理被移动的节点
			view.setNodeLineIcos(setting, node);

			//处理原节点的父节点
			if (!setting.data.keep.parent && oldParentNode[childsKey].length < 1) {
				//原所在父节点无子节点
				oldParentNode.isParent = false;
				var tmp_ulObj = $("#" + oldParentNode.tId + consts.id.UL);
				var tmp_switchObj = $("#" + oldParentNode.tId + consts.id.SWITCH);
				var tmp_icoObj = $("#" + oldParentNode.tId + consts.id.ICON);
				view.replaceSwitchClass(tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(oldParentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (oldNeighbor) {
				//原所在位置需要处理的相邻节点
				view.setNodeLineIcos(setting, oldNeighbor);
			}

			//处理目标节点的相邻节点
			if (newNeighbor) {
				view.setNodeLineIcos(setting, newNeighbor);
			}

			//修正父节点Check状态
			if (setting.checkable) {
				view.repairChkClass(setting, oldParentNode);
				view.repairParentChkClassWithSelf(setting, oldParentNode);
				if (oldParentNode != node.parent)
					view.repairParentChkClassWithSelf(setting, node);
			}

			//移动后，则必须展开新位置的全部父节点
			view.expandCollapseParentNode(setting, node.getParentNode(), true, animateFlag);
		},
		removeEditBtn: function(node) {
			$("#" + node.tId + consts.id.EDIT).unbind().remove();
		},
		removeNode: function(setting, node) {
			var root = data.getRoot(setting);
			var childsKey = setting.data.key.childs;
			var parentNode = (node.parentTId) ? node.getParentNode() : root;
			if (root.curEditNode === node) root.curEditNode = null;

			$("#" + node.tId).remove();
			data.removeSelectedNode(setting, node);
			data.removeNodeCache(setting, node);

			//进行数据结构修正
			for (var i = 0, l = parentNode[childsKey].length; i < l; i++) {
				if (parentNode[childsKey][i].tId == node.tId) {
					parentNode[childsKey].splice(i, 1);
					break;
				}
			}
			var tmp_ulObj,tmp_switchObj,tmp_icoObj;

			//处理原节点的父节点的图标、线
			if (!setting.data.keep.parent && parentNode[childsKey].length < 1) {
				//原所在父节点无子节点
				parentNode.isParent = false;
				parentNode.open = false;
				tmp_ulObj = $("#" + parentNode.tId + consts.id.UL);
				tmp_switchObj = $("#" + parentNode.tId + consts.id.SWITCH);
				tmp_icoObj = $("#" + parentNode.tId + consts.id.ICON);
				view.replaceSwitchClass(tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (setting.view.showLine && parentNode[childsKey].length > 0) {
				//原所在父节点有子节点
				var newLast = parentNode[childsKey][parentNode[childsKey].length - 1];
				newLast.isLastNode = true;
				newLast.isFirstNode = (parentNode[childsKey].length == 1);
				tmp_ulObj = $("#" + newLast.tId + consts.id.UL);
				tmp_switchObj = $("#" + newLast.tId + consts.id.SWITCH);
				tmp_icoObj = $("#" + newLast.tId + consts.id.ICON);
				if (parentNode == root) {
					if (parentNode[childsKey].length == 1) {
						//原为根节点 ，且移动后只有一个根节点
						view.replaceSwitchClass(tmp_switchObj, consts.line.ROOT);
					} else {
						var tmp_first_switchObj = $("#" + parentNode[childsKey][0].tId + consts.id.SWITCH);
						view.replaceSwitchClass(tmp_first_switchObj, consts.line.ROOTS);
						view.replaceSwitchClass(tmp_switchObj, consts.line.BOTTOM);
					}
				} else {
					view.replaceSwitchClass(tmp_switchObj, consts.line.BOTTOM);
				}
				tmp_ulObj.removeClass(consts.line.LINE);
			}
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

	var _cancelPreSelectedNode = view.cancelPreSelectedNode;
	view.cancelPreSelectedNode = function (setting, node) {
		var list = data.getRoot(setting).curSelectedList;
		for (var i=0, j=list.length; i<j; i++) {
			if (!node || node === list[i]) {
				view.removeTreeDom(setting, list[i]);
				if (node) break;
			}
		}
		if (_cancelPreSelectedNode) _cancelPreSelectedNode.apply(view, arguments);
	}

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode) {
		if (_createNodes) _createNodes.apply(view, arguments);
		if (!nodes) return;
		view.repairParentChkClassWithSelf(setting, parentNode);
	}

	view.makeNodeUrl = function(setting, node) {
		return (node.url && !setting.edit.enable) ? node.url : null;
	}

	var _selectNode = view.selectNode;
	view.selectNode = function(setting, node, addFlag) {
		var root = data.getRoot(setting);
		if (data.isSelectedNode(setting, node) && root.curEditNode == node && node.editNameFlag) {
			return false;
		}
		if (_selectNode) _selectNode.apply(view, arguments);
		view.addHoverDom(setting, node);
		return true;
	}

	var _uCanDo = tools.uCanDo;
	tools.uCanDo = function(setting) {
		var root = data.getRoot(setting);
		return (!root.curEditNode) && (_uCanDo ? _uCanDo.apply(view, arguments) : true);
	}


})(jQuery);