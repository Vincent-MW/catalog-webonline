(function(a) {
    a.extend(a.fn, {
    	_initHideEffect:["customAnimation","flying","graduallyIn","fadeIn","fadeInOut","flipinX","flip","lightSpeedIn","spiralBg","flash","whirl","flashWhirl","flashOnce","flashOnce10","smallZoom","smallToBig","centerToBig","bounce","bounceT","bounceR","bounceB","bounceL","laterShow","tanxingfangda","tanxingsuoxiao","zoomInDown","xialuofangda","congzuogunru","congyougunru","congyoushache","flipin","gunru","zhankai","huaru","furufuchu","guanghuan","diaoru","diaoru","pengbi"],							//初始化需要隐藏的效果数组
    	
		// 判断浏览器内核类型
		_vendor			: function () {
							var _elementStyle	= document.createElement('div').style;
							var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
								transform,
								i = 0,
								l = vendors.length;
					
							for ( ; i < l; i++ ) {
								transform = vendors[i] + 'ransform';
								if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
							}
							return false;
						},
    	
    	//判断是否有控制该元素显示的元素
    	checkIsCanPlayEffect: function(ele) {
    		var flag = true;
    		var startTime = new Date().getTime();
    		var thisComID = $(ele).attr("comID");
//    		console.info("检测当前元素是否有触发"+thisComID);
    		if(typeof allTriggerDatas!=="undefined"){
				var checkEventAction = function(curEventTriggers){
					$.each(curEventTriggers,function(){
						$.each(this,function(){
	    					if(this.type=="itemAction"&&typeof this.action !=="undefined"){
	    						$.each(this.action,function(){
	    							if(thisComID == this.itemComID&&this.actionType=="show"){
	    								flag = false;
	    							}
	    						});
	    					}
						});
					});
				}
				for(var triggerComID in allTriggerDatas.itemTriggers){
					checkEventAction(allTriggerDatas.itemTriggers[triggerComID]);
				}
				for(var effectID in allTriggerDatas.effectTriggers){
					checkEventAction(allTriggerDatas.effectTriggers[effectID]);
				}
    		}else{//旧版
	    		var pageDiv = $(ele).parent("div");
	    		if(pageDiv.length==0){
	    			pageDiv = $(ele).parent().parent("div");
	    		}
	    		pageDiv.find(".animation").each(function(){
	    			var playtarget = $(this).attr("playtarget");
	    			if((typeof(playtarget)!='undefined')&&playtarget!=null&&playtarget.indexOf("'"+thisComID+"','type':'show'")>-1){
	    				flag = false;
	    			}
	    		});
    		}
//    		console.info(ele);
//    		console.info("检测完成耗时："+flag+(new Date().getTime() - startTime));
    		return flag;
        },
        //播放某个元素的动画 effectList未指定则从元素属性animationType中获取
        playEffect:function(ele,effectList){
        	//如果是gif则把Gif清理
        	if($(ele).isGifItem()){
        		$(ele).find(".uniImg").attr("src",$(ele).find(".uniImg").data("src")).show();
        	}
        	
        	$(ele).trigger("playEffect");//派发播放动画事件
        	var curAnimationName = effectList||$(ele).attr("animationType");
			if(curAnimationName==""){
				if($(ele).attr("initHide")==null)$(ele).show().css("opacity","1");//兼容老版本 2017-08-03
				return;
			}
			if($(ele).data("playing")){//当前有动画正在播放
				return;
			}
			var animationNamesArray = curAnimationName.split(" ");
			for(var i=0;i<animationNamesArray.length;i++){
				$(ele).removeClass(animationNamesArray[i]);
			}
			if($(ele).data("curPlayEffectName")&&/curveMove_.*?/.test($(ele).data("curPlayEffectName"))){
				//路径移动保持上一个状态
			}else{
				//还原初始样式
//				console.info("还原初始样式");
				var originr = $(ele).attr("originr");
				var cssStyle = "translate(0,0) scale(1) rotate("+originr+"deg)";
				$(ele).css("transform",cssStyle);
			}
			
			$(ele).data("effectList",animationNamesArray.join(","));
			$(ele).data("playing","true");
			setTimeout(function(){
				$(ele).doPlayEffect();
			},100);
        },
        doPlayEffect:function(){
        	var ele = this;
        	var previousEffectName = $(ele).data("curPlayEffectName");
        	var isFirstEffect = $(ele).data("curPlayEffectName")==null;//是否是第一个播放的动画
        	var effectList = $(ele).data("effectList");
        	if(effectList==null||effectList.length==0){
        		//没有要播放的动画了
//        		$(ele).data("curPlayEffectName",null);
        		$(ele).data("playing","false");
        		$(ele).data("effectList","");
        		return;
        	}
        	var animationNamesArray = effectList.split(",");
        	var curEffectName = animationNamesArray.shift();
    		if(animationNamesArray.length>0){
    			$(ele).data("effectList",animationNamesArray.join(","));
    		}else{
    			$(ele).data("effectList","");
    		}
        	//移出当前动画
			if($(ele).data("curPlayEffectName")){
				//设置为上一个动画的结束状态
				try{
					$(ele).setEleStyleByKeyframesPostion($(ele).data("curPlayEffectName"),false,false);
				}catch(e){}
				$(ele).removeClass($(ele).data("curPlayEffectName"));
			}
        	$(ele).data("curPlayEffectName",curEffectName);
        	$(ele).show();
			if(/^zzcx_/.test(curEffectName)){//逐字出现
				$(ele).uniTyped({"cssName":curEffectName});
			}else if(/^curveMove_/.test(curEffectName)){//路径移动
				$(ele).css("opacity",1).uniPathMove();
			}else if(/zhankai_.*?/.test(curEffectName)){//展开特殊处理
				var $childrenEle = $(ele).find(".vectorText").length>0?$(ele).find(".vectorText"):$(ele).find("img");
				//css效果
				$childrenEle.setEleStyleByKeyframesPostion(curEffectName,true,isFirstEffect);
				$(ele).css("opacity",1);
				$childrenEle.addClass(curEffectName);
			}else{
				//css效果
				$(ele).setEleStyleByKeyframesPostion(curEffectName,true,isFirstEffect);
				$(ele).addClass(curEffectName);
			}
			var curAnimationObj = $(ele);
			$(ele).off('webkitAnimationStart animationStart');
			$(ele).on('webkitAnimationStart animationStart',function(){
				//查找有没有播放前需要播放的音乐（旧版，新版没有了20170614）
				$(ele).parent().find("audio[cssname='"+curEffectName+"'][playbefor='1']").each(function(){
					if(typeof car2 !="undefined")car2.audio_stop();
					if(typeof uniSwiper !="undefined")uniSwiper.audio_stop();
					var that = this;
					getWXPlay(function(){
						that.play();
					});
				});
				$(ele).triggerAction("playBefor",curEffectName);//新版 20170614
			});
			$(ele).off('webkitAnimationEnd animationEnd');
			$(ele).on('webkitAnimationEnd animationEnd',function(){
				//（旧版，新版没有了20170614）
				curAnimationObj.parent().find("audio[cssname='"+curEffectName+"'][playbefor='0']").each(function(){
					if(typeof car2 !="undefined")car2.audio_stop();
					if(typeof uniSwiper !="undefined")uniSwiper.audio_stop();
					var that = this;
					getWXPlay(function(){
						that.play();
					});
				});
				$(ele).triggerAction("playEnd",curEffectName);//新版 20170614
				
				$(ele).doPlayEffect();
			});
        },
        //设置元素样式为css3 keyframes的某个位置的样式
        setEleStyleByKeyframesPostion:function(effectName,isStart,isFirstEffect){
        	var that = this;
        	var isCanTransform = typeof($(this)[0].style.transform) !=="undefined";
        	all:
        		for(var i=0,len=document.styleSheets.length;i<len;i++){
        			var curStyleSheet = document.styleSheets[i];
        			if(curStyleSheet.cssRules){
	        			for(var j=0,len2=curStyleSheet.cssRules.length;j<len2;j++){
	        				var curRules = curStyleSheet.cssRules[j];
	        				if(curRules.constructor.name=="CSSKeyframesRule"){
	//        					console.info(curRules.name);
	        					if(curRules.name.replace("Keyframes","") == effectName){
	        						var endStyle = curRules.cssRules[isStart?0:(curRules.cssRules.length-1)].cssText;
	        						endStyle = /.*?\{(.*?)\}.*?/.exec(endStyle)[1];
	        						if(endStyle){
	        							var endStyleJson = {};
	        							$.each(endStyle.split(";"),function(){
	        								if($.trim(this)!=""){
	        									var curStyleArray =  this.split(":");
	        									var styleName = curStyleArray[0];
	        									if(styleName.indexOf("-webkit-")>-1&&isCanTransform){
	        										styleName = styleName.replace("-webkit-","");
	        									}
	        									if(/zhankai_.*?/.test(effectName)){//展开特殊处理
	        										endStyleJson[styleName] = curStyleArray[1].replace("scaleX(0.1)","scaleX(0)").replace("scaleY(0.1)","scaleY(0)");
	        									}else{
	        										endStyleJson[styleName] = curStyleArray[1];
	        									}
	        								}
	        							});
	        							if(isStart){
		        							if(isFirstEffect&&(/whirl_.*?/.test(effectName)||/flying_.*?/.test(effectName)||/huaru_.*?/.test(effectName)||/graduallyIn_.*?/.test(effectName))){//旋转处于第一个动画特殊处理
		        								endStyleJson["opacity"] = "0";
		        							}
	        							}
	        							$(this).css(endStyleJson);
	        						}
	        						break all;
	        					}
	        				}
	        			}
        			}	
        		}
        },
        //停止播放动画
        stopEffect:function(ele){
        	//如果是gif则把Gif清理
        	if($(ele).isGifItem()){
        		$(ele).find(".uniImg").attr("src","");
        	}
        	
        	$(ele).data("playing","false");
        	var curAnimationName = $(ele).attr("animationType");
 			var animationNamesArray = curAnimationName.split(" ");
 			$(ele).off('webkitAnimationStart animationStart');
 			$(ele).off('webkitAnimationEnd animationEnd');
 			for(var i=0;i<animationNamesArray.length;i++){
 				$(ele).removeClass(animationNamesArray[i]);
 			}
 			try{
 				//停止打字效果
 				$(ele).uniTypedStopEffect();
 				//停止路径
 				$(ele).uniPathMoveStop();
 			}catch (e) {
				// TODO: handle exception
			}
 			if($(ele).data("curPlayEffectName")){
 				$(ele).removeClass($(ele).data("curPlayEffectName"));
		   }
 			$(ele).data("curPlayEffectName",null);
 			$(ele).initItemStatus();
// 			if(animationNamesArray.length>0){
// 	 			if(this.isInitNeedHide(animationNamesArray[0])){
// 	 				$(ele).hide().css("opacity",0);
// 	 			}
// 			}
 			//拖拽元素回复到初始状态
 			if($(ele).hasClass("dragItem")){
 				var uniDrag =  jQuery(ele).data("uniDrag");
				if(typeof uniDrag !="undefined"&&uniDrag!=null){
					uniDrag.reset();
				}
 			}
 			//还原初始状态
 			var r = $(ele).attr("originR");
 			if(typeof r!== "undefined"){
 				$(ele).css("transform","translate(0,0) rotate("+r+"deg)");
 			}
        },
        //元素初始化时是否是隐藏状态
        isInitNeedHide:function(curAnimationName){
    		var flag = false;
    		for(var i=0;i<this._initHideEffect.length;i++){
    			var curName = this._initHideEffect[i];
    			if(curAnimationName.indexOf(curName)>-1){
    				flag = true;
    				break;
    			}
    		}
    		return flag;
    	},
    	//检测元素第一个动画是否默认隐藏
    	checkItemFirstEffectIsInitHide:function(){
	    	var flag = false;
	    	var curAnimationName = $(this).attr("animationType");
	    	if(curAnimationName){
	    		var animationNamesArray = curAnimationName.split(" ");
	    		if(animationNamesArray.length>0){
	    			curAnimationName = animationNamesArray[0];
	    			flag = $(this).isInitNeedHide(curAnimationName);
	    		}
	    	}
	    	return flag;
	    },
    	//初始化元素状态
    	initItemStatus:function(){
    		if($(this).attr("initHide")!=null){
    			//新版靠用户指定是否初始隐藏
    			if($(this).attr("initHide")=="true"){
    				$(this).hide();
    			}else{
    				if($(this).checkItemFirstEffectIsInitHide()){
    					$(this).hide().css("opacity",0);
    				}else{
    					$(this).show();
    				}
    			}
    		}else{
    			//旧版 2017-08-03
    			if($(this).checkItemFirstEffectIsInitHide()||!$.fn.checkIsCanPlayEffect(this)){
    				$(this).hide().css("opacity",0);
    			}
    		}
    	},
    	//移出动画样式
    	removeEffectStyleName:function(ele){
    		var obj = ele;
    		try{
	    		var allAni = obj.attr("animationtype").split(" ");
	    		for(var eff in allAni){
	    			if(obj.hasClass(allAni[eff])){
	    				obj.removeClass(allAni[eff]);
	    			}
	    		}
	    		if($(ele).data("curPlayEffectName")){
	    			obj.removeClass($(ele).data("curPlayEffectName"));
    		   }
    		}catch(e){}
    	},
    	//元素触发动作 			(已弃用)
    	triggerItemAction:function(ele){
    		var playTarget = $(ele).attr("playtarget");
    		if(playTarget==null){
    			return;
    		}
			playTarget = playTarget.replace(/'/g,"\"");
			var playtargets = JSON.parse(playTarget);
			for(var i=0;i<playtargets.length;i++){
				var target = playtargets[i].target;
				var actionType = playtargets[i].type;
				if(actionType=="show"){
					$(ele).parent().find("div[comid='"+target+"']").each(function(){
						$.fn.playEffect(this);
					});
				}else{
					var hideTarget = $(ele).parent().find("div[comid='"+target+"']");
					hideTarget.find("audio,video").each(function(){
						this.pause();
						this.currentTime = 0;
					});
					hideTarget.css("opacity","1").animate({opacity:0},500,'ease',function(){
						$(this).hide();
					});
					$.fn.removeEffectStyleName(hideTarget);
				}
			}
    	},
    	//为元素加触发事件监听
    	addTriggerEventListener:function(){
    		if(this.length==0){
    			return;
    		}
    		var ele = this[0];
    		$(ele).attr("slide_dir","");
    		$(ele).attr("touchType","");
    		var comID = $(ele).attr("comID");
    		var curTriggers =  allTriggerDatas.itemTriggers[comID];
    		for(var actionEventType in curTriggers){
    			if(actionEventType=="click"){
    				//点击
    				$(ele).click(function(){
    					$(ele).triggerAction("click");
    				});
    			}else if(actionEventType=="mouse_over"){
    				//鼠标移入
    				var cfg = curTriggers[actionEventType][0];
    				
    				jQuery(ele).off('mouseenter').unbind('mouseleave');
    				jQuery(ele).hover(function(){
    					if(cfg.showType=="showBorder"){
    						var borderColor = cfg.border_color;
    						$(this).addClass("all-transition");
    						$(this).css({"box-shadow":"0px 0px 6px 6px "+borderColor});
    					}else if(cfg.showType=="toBig"){
    						$(this).children().addClass("all-transition").css({"transform":"scale(1.1)","-webkit-transform":"scale(1.1)"});
    					}
    					//提示框
        				if($.trim(cfg.tipStr).length>0){
        					$(ele).showTip(cfg);
        				}
					},function(){
						if(cfg.showType=="showBorder"){
    						$(this).css({"box-shadow":"none"});
    					}else if(cfg.showType=="toBig"){
    						$(this).children().css({"transform":"scale(1)","-webkit-transform":"scale(1)"});
    					}
						if($.itemTip&&$.itemTip.ele)$.itemTip.ele.css("opacity",0);
					});
				}else{
    				//触控
    				var hammer = new Hammer(ele);
    				if((/^slide_.*$/).test(actionEventType)){
    					//停止向上派发事件，防止冲突
    					$(ele).on("touchstart mousedown",function(ev){
    						ev&&(ev.stopPropagation()||ev.preventDefault());
    					});
    					//滑动
    					var dir = actionEventType.replace("slide_","");
    					hammer.get("swipe").set({direction: Hammer.DIRECTION_ALL});
    					$(ele).attr("slide_dir",$(ele).attr("slide_dir")+","+dir);
    					hammer.on("swipe",function(ev) {
    						if(ev.offsetDirection==2){//向右滑动
    							if($(ele).attr("slide_dir").split(",").indexOf("right")>-1){
    								$(ele).triggerAction("slide_right");
    							}
    						}else if(ev.offsetDirection==4){//向左滑动
    							if($(ele).attr("slide_dir").split(",").indexOf("left")>-1){
    								$(ele).triggerAction("slide_left");
    							}
    						}else if(ev.offsetDirection==16){//向上滑动
    							if($(ele).attr("slide_dir").split(",").indexOf("top")>-1){
    								$(ele).triggerAction("slide_top");
    							}
    						}else if(ev.offsetDirection==8){//向下滑动
    							if($(ele).attr("slide_dir").split(",").indexOf("bottom")>-1){
    								$(ele).triggerAction("slide_bottom");
    							}
    						}
    						ev&&ev.srcEvent&&(ev.srcEvent.stopPropagation()||ev.srcEvent.preventDefault());
    					});
    				}else if((/^touch.*$/).test(actionEventType)){
    					//停止向上派发事件，防止冲突
    					$(ele).on("touchstart mousedown",function(ev){
    						ev&&(ev.stopPropagation()||ev.preventDefault());
    					});
    					$(ele).attr("touchType",$(ele).attr("touchType")+","+actionEventType);
    					//按住
    					hammer.on("press",function(ev){
    						var curTouchTypes = $(ele).attr("touchType").split(",");
    						if(curTouchTypes.indexOf("touchstart")>-1){
    							$(ele).triggerAction("touchstart");
    						}
    						if(curTouchTypes.indexOf("touchend")>-1){
    							$(ele).off("touchend mouseup");
    							$(ele).on("touchend mouseup",function(){
    								$(ele).triggerAction("touchend");
    							});
    						}
    						ev&&ev.srcEvent&&(ev.srcEvent.stopPropagation()||ev.srcEvent.preventDefault());
    					});
    				}
    			}
    		}
    	},
    	/**
    	 * 显示提示框
    	 */
    	showTip:function(cfg){
    		var bgColor = cfg.tipBgColor;
    		var textColor = cfg.tipTextColor;
    		var str = cfg.tipStr;
    		
    		if(typeof $.itemTip == 'undefined'){
    			$.itemTip = {ele:$("<div class='item-tip'></div>").appendTo($("body"))};
    		}
    		var curX = $(this).offset().left+$(this).width()/2;
    		var curY = $(this).offset().top;
    		$.itemTip.ele.html(str).css({"background-color":bgColor,"color":textColor,"left":curX+"px","top":curY+"px","opacity":1});
    	},
    	//触发元素的事件
    	triggerAction:function(eventType,effectName){
    		if(typeof allTriggerDatas !=="undefined"){
	    		var comID = $(this).attr("comID");
	    		var curTriggers =  null;
	    		if(/play[Befor|End]/i.test(eventType)){
	    			if(allTriggerDatas.effectTriggers)curTriggers =  allTriggerDatas.effectTriggers[effectName];
	    		}else{
	    			if(allTriggerDatas.itemTriggers)curTriggers =  allTriggerDatas.itemTriggers[comID];
	    		}
	    		if(curTriggers!=null){
	    			for(var actionEventType in curTriggers){
	    				if(eventType==actionEventType){
	    					var curEventTriggers = curTriggers[actionEventType];
	    					for(var i=0;i<curEventTriggers.length;i++){
	    						var curTrigger = curEventTriggers[i];
	    						try{
	    							triggerActions.doTrigger(curTrigger);
	    						}catch(e){}
	    					}
	    					break;
	    				}
	    			}
	    		}
    		}
    	},
    	//元素是否是GIF
    	isGifItem:function(){
    		if($(this).find(".uniImg").length==1){
	        	return (/^.*?\.gif(\?[a-z0-9]*)?$/i.test($(this).find(".uniImg").data("src")));
    		}
    		return false;
    	}
    })
})(Zepto);