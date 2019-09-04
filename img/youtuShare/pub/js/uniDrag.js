(function($){
	var UniDrag,
	bindGlobalEvent;
	var curDragObj=null;
	//获取两点间距离
	var towPointLenth = function(p1,p2){
		var xdiff = p2.x - p1.x;            // 计算两个点的横坐标之差
		var ydiff = p2.y - p1.y;            // 计算两个点的纵坐标之差
		return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
	}
	var getPagePoint = function(e){
		var mouseX = 0;
		var mouseY = 0;
		if(/^touch\w*?/i.test(e.type)){
			mouseX = window.event.touches[0].pageX;
			mouseY = window.event.touches[0].pageY;
		}else{
			mouseX = e.pageX;
			mouseY = e.pageY;
		}
		return {x:mouseX,y:mouseY};
	}
	/* 
     * 获取el被缩放的倍数 
     */ 
	var getZoomLeve = function(el){
        var ret = 1;
        var transform =  el.parents(".pageCon").css("-webkit-transform")
        if(transform){
        	var result = /scale\((\d+[.]*[\d]*)+\)/.exec(transform);
        	if(result&&result.length>1){
        		ret = result[1];
        	}
        }
        return ret;  
    }
	
	bindGlobalEvent = function(){
		$(document).bind("touchmove mousemove",function(e){
			if(curDragObj!=null){
				var that = curDragObj;
				if(that.startMove){
					var mouseX = 0;
					var mouseY = 0;
					if(e.type == "touchmove"){
						mouseX = window.event.touches[0].pageX;
						mouseY = window.event.touches[0].pageY;
					}else{
						mouseX = e.pageX;
						mouseY = e.pageY;
					}
					var eleZoom = getZoomLeve(that.$element);
					var oldX = that.$element.css("left").replace("px","");
					var oldY = that.$element.css("top").replace("px","");
					
					var newX = oldX;
					var newY = oldY;
					
					if(that.settings.dragConstraint.toLowerCase()=="b"){//范围约束
						var constraintRect = that.getConstraintRect();
						var targetX = that.oldPoint.x+(mouseX-that.startPoint.x)/eleZoom;
						var targetY = that.oldPoint.y+(mouseY-that.startPoint.y)/eleZoom;
						
						if(targetX<constraintRect.minX){
							newX = constraintRect.minX;
						}else if(targetX>constraintRect.maxX){
							newX = constraintRect.maxX;
						}else{
							newX = targetX;
						}
						if(targetY<constraintRect.minY){
							newY = constraintRect.minY;
						}else if(targetY>constraintRect.maxY){
							newY = constraintRect.maxY;
						}else{
							newY = targetY;
						}
					}else{
						if(that.settings.dragConstraint.toLowerCase()=="none"||that.settings.dragConstraint.toLowerCase()=="h"){
							newX = that.oldPoint.x+(mouseX-that.startPoint.x)/eleZoom;
						}
						if(that.settings.dragConstraint.toLowerCase()=="none"||that.settings.dragConstraint.toLowerCase()=="v"){
							newY = that.oldPoint.y+(mouseY-that.startPoint.y)/eleZoom;
						}
					}
					if(typeof newX == "undefined"){
						newX = oldX;
					}
					if(typeof newY == "undefined"){
						newY = oldY;
					}
					if(that.settings.dragDirection!="any"){
						//方向检查
						if(that.settings.dragDirection.indexOf("L")>-1){
							if(newX>oldX){
								newX=oldX;
							}
						}
						if(that.settings.dragDirection.indexOf("R")>-1){
							if(newX<oldX){
								newX=oldX;
							}
						}
						if(that.settings.dragDirection.indexOf("T")>-1){
							if(newY>oldY){
								newY=oldY;
							}
						}
						if(that.settings.dragDirection.indexOf("B")>-1){
							if(newY<oldY){
								newY=oldY;
							}
						}
					}
					moveCurDragItem(that,newX,newY);
				}
				e.preventDefault();
			}
		});
		$(document).bind("touchend mouseup",function(e){
			$(".dragItem").each(function(){
				var uniDrag =  $(this).data("uniDrag");
				if(typeof uniDrag !="undefined"&&uniDrag!=null&&curDragObj==uniDrag){
					uniDrag.startMove = false;
					uniDrag.dropCall.call(uniDrag);
				}
			});
			curDragObj = null;
		});
	}
	/**
	 * 移动元素到指定位置
	 * @param that			uniDrag对象
	 * @param newX
	 * @param newY
	 */
	moveCurDragItem = function(that,newX,newY){
		var oldX = that.$element.css("left");
		var oldY = that.$element.css("top");
		that.$element.css("left",newX+"px");
		that.$element.css("top",newY+"px");
		that.$element.triggerHandler("uniDrag:move",[newX,newY]);
		//联动元素
		if(typeof that.settings.withOtherItemStr !=="undefined"){
			var withOtherItem =  that.settings.withOtherItemStr.split(",");
			if(withOtherItem.length>0){
				try{
					var offsetX = parseFloat(newX - parseFloat(oldX.replace("px","")));
					var offsetY = parseFloat(newY - parseFloat(oldY.replace("px","")));
					$.each(withOtherItem,function(){
						var moveItem = that.$element.parent().find(".item[comID='"+this+"']");
						if(moveItem.length>0){
							try{
								var oldX = parseFloat(moveItem.css("left").replace("px",""));
								var oldY = parseFloat(moveItem.css("top").replace("px",""));
								moveItem.css({left:oldX+offsetX+"px",top:oldY+offsetY});
							}catch(error){}
						}
					});
				}catch(error){}
			}
		}
	}
	
	
	
	bindGlobalEvent();
	
	UniDrag = (function(){
		function UniDrag(element,options){
			 //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.uniDrag.defaults, options);
            this.$element = $(element);
            this.initEvent();
		}
		UniDrag.prototype = {
				initEvent:function(){
					var  that = this;
					that.$element.bind("touchstart mousedown",function(e){
						that.stopAutoMove();
						curDragObj = that;
						that.startMove = true;
						var oldX = that.$element[0].offsetLeft;
						var oldY = that.$element[0].offsetTop;
						that.oldPoint = {x:oldX,y:oldY};
						if(typeof that.originPoint=="undefined"){
							that.originPoint = {x:oldX,y:oldY};//保存原始坐标
						}
						var startX = 0;
						var startY = 0;
						if(e.type == "touchstart"){
				        	startX = window.event.touches[0].pageX;
				        	startY = window.event.touches[0].pageY;
						}else{
							startX = e.pageX;
							startY = e.pageY;
						}
						that.startPoint = {x:startX,y:startY};
						return false;
					});
					if(that.settings.dragConstraint.toLowerCase()=="b"&&that.settings.dragAutoMove&&that.settings.dragAutoMove.direction!="none"){
						that.$element.bind("playEffect",function(){
							//自动移动
							that.playing = true;
							that.doAutoMove();
						});
					}
				},
				stopAutoMove:function(){
					this.playing = false;
				},
				
				//计算自动移动的速度
				calculateAutoMoveSpeed:function(fps){
					var that = this;
					var direction = this.settings.dragAutoMove.direction;
					var duration = this.settings.dragAutoMove.duration;
					var constraintRect = that.getConstraintRect();
					
					var xMoveCount = constraintRect.maxX-constraintRect.minX;
					var yMoveCount = constraintRect.maxY-constraintRect.minY;
					
					if(typeof fps === "undefined"){
						fps = 60;
					}
					var frameCount = duration*fps;//总的帧数量
					
					this.autoMoveSpeedX = 0;//x轴每帧移动距离
					this.autoMoveSpeedY = 0;//y轴每帧移动距离
					switch(direction){
						case "l"://从左向右
							this.autoMoveSpeedX = xMoveCount/frameCount;
							break;
						case "r":	//从右向左
						this.autoMoveSpeedX = -xMoveCount/frameCount;
							break;
						case "t"://从上到下
							this.autoMoveSpeedY = yMoveCount/frameCount;
							break;
						case "b":	//从下到上
							this.autoMoveSpeedY = -yMoveCount/frameCount;
							break;
					}
					
				},
				/**
				 * 执行在自动移动
				 */
				doAutoMove:function(){
					var that = this;
					var delay = this.settings.dragAutoMove.delay;
					var duration = this.settings.dragAutoMove.duration;
					var repeatCount = this.settings.dragAutoMove.repeatCount;
					var constraintRect = that.getConstraintRect();
					
					var startTime1 = new Date().getTime();
					var startTime = new Date().getTime();
					function animloop() {
						if(!that.playing){
							return;
						}
						that.calculateAutoMoveSpeed(that.settings.curFPS);
						var curX = parseFloat(that.$element.css("left").replace("px",""));
						var curY = parseFloat(that.$element.css("top").replace("px",""));
						//结束条件
						var isEnd = false;
						if(that.autoMoveSpeedX!=0){//左右移动
							if(that.autoMoveSpeedX>0){//从左向右移动
								if(curX>=constraintRect.maxX){
									isEnd = true;
								}
							}else{//从右向左移动
								if(curX<=constraintRect.minX){
									isEnd = true;
								}
							}
						}
						if(that.autoMoveSpeedY!=0){//上下移动
							if(that.autoMoveSpeedY>0){//从上向下移动
								if(curY>=constraintRect.maxY){
									isEnd = true;
								}
							}else{//从下向上移动
								if(curY<=constraintRect.minY){
									isEnd = true;
								}
							}
						}
						if(isEnd){
							return;
						}
						//刷新帧
						var endX = Math.min(constraintRect.maxX,Math.max(constraintRect.minX,curX+that.autoMoveSpeedX));
						var endY = Math.min(constraintRect.maxY,Math.max(constraintRect.minY,curY+that.autoMoveSpeedY));
						
						moveCurDragItem(that,endX,endY);
						
						that.settings.curFPS = Math.round(1000/(new Date().getTime()-startTime));
						startTime = new Date().getTime();
						requestAnimFrame(animloop);
					}
					setTimeout(function(){
						startTime = new Date().getTime();
						requestAnimFrame(animloop);
					},delay*1000);
				},
				/**
				 * 获取拖拽限制的区域
				 */
				getConstraintRect:function(){
					if(typeof this.settings.constraintRect === "undefined"){
						var constraintRect = {};
						var that = this;
						var bound = that.settings.dragBound.split(",");
						constraintRect.minX = bound[0];
						constraintRect.minY = bound[1];
						constraintRect.maxX = bound[2]-that.$element.width()+parseFloat(bound[0]);
						constraintRect.maxY = bound[3]-that.$element.height()+parseFloat(bound[1]);
						this.settings.constrainRect = constraintRect; 
						return constraintRect;
					}else{
						return this.settings.constrainRect;
					}
				},
				//拖拽放下调用
				dropCall:function(){
					var that = this;
					var curTargetPoint = null;//拖拽到目标的对象
					if(typeof that.settings.target !="undefined"&&that.settings.target.length>0){
						var dropPoint = {x:that.$element[0].offsetLeft,y:that.$element[0].offsetTop};
						var offsetLen = Math.sqrt(Math.pow(that.$element[0].clientWidth,2)+Math.pow(that.$element[0].clientHeight,2));
						offsetLen *= 0.7;
						$.each(that.settings.target,function(){
							if(towPointLenth(dropPoint,this)<offsetLen){
								curTargetPoint = this;
								if(that.settings.dragInto=="clear"){//置入消失
									that.$element.fadeOut();
								}else if(that.settings.dragInto=="reset"){//置入后还原
									that.$element.animate({"left":that.originPoint.x,"top":that.originPoint.y},300);
								}else{//置入后自动移动到目标坐标
									if(that.settings.autInto){
										that.$element.animate({"left":this.x,"top":this.y},300);
									}
								}
								return false;
							}
						});
					}
					if(curTargetPoint!=null){
						if(curTargetPoint.triggers){
							$.each(curTargetPoint.triggers,function(){
	    						triggerActions.doTrigger(this);
							});
						}
					}else{
						if(that.settings.dragEnd == "reset"){//还原
							that.$element.animate({"left":that.originPoint.x,"top":that.originPoint.y},300);
						}
					}
				},
				reset:function(){
					//复原
					var originX = this.$element.attr("endX");
					var originY = this.$element.attr("endY");
					moveCurDragItem(this,originX,originY);
					this.$element.show();
				}
		};
		return UniDrag;
	})();
	
	/**
     * 这里是将UniDrag对象 转为jQuery插件的形式进行调用
     * 定义一个插件 plugin
     */
    $.fn.uniDrag = function(options){
        return this.each(function () {
            var $this = $(this),
                instance = $this.data('uniDrag');
            if (!instance) {
                $this.data('uniDrag', new UniDrag(this,options));
                instance = $this.data('uniDrag');
            }else{
            	instance.init(options);
            }
            if (typeof options === 'string') instance[options]();
        })
    };
    
    /**
     * 插件的默认值
     */
    $.fn.uniDrag.defaults = {
    		dragStart:"move",//拖动开始				move：移动，keep：保持
    		dragEnd:"keep",//拖动结束(未置入) 		keep：保持，reset：复原
    		dragInto:"move",//置入时					move: 移动，copy：复制，clear：消失，reset:复原
    		dragConstraint:"none",//拖拽约束 		none:没有，h：水平，v：垂直 b:指定区域
    		dragDirection:"any",	//拖拽方向				any:任意方向，LT:左上 LB：左下 RT:右上 RB:右下
    		target:[{x:400,y:600}],//拖拽目标点
    		autInto:true,//置入时是否自动移动到目标坐标	
    		dragBound:null,//拖拽边界					{minX:0,maxX:11,minY:0,maxY}
    };
    /**
     * 优雅处： 通过data-xxx 的方式 实例化插件。
     * 这样的话 在页面上就不需要显示调用了。
     * 可以查看bootstrap 里面的JS插件写法
     */
    $(function(){
    	$(".dragItem").each(function(){
    		var dragOption = null;
    		if(allTriggerDatas.itemDragCfg){
    			dragOption = allTriggerDatas.itemDragCfg[$(this).attr("comID")];
    		}else{
    			dragOption = eval("("+$(this).attr("dragOption")+")");
    		}
    		$(this).uniDrag(dragOption);
    	});
    });
})(jQuery);