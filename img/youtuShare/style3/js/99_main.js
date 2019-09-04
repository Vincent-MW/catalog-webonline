var car2 = {
/****************************************************************************************************/
/*  对象私有变量/函数返回值/通用处理函数
*****************************************************************************************************/	
/*************************
 *  = 对象变量，判断函数
 *************************/
	_viewMode	:	'showAll',					//显示模式  clip：裁切不能露白边	showAll：内容不裁切露白边
	_events 		: {},									// 自定义事件---this._execEvent('scrollStart');
	_windowHeight	: $(window).height(),					// 设备屏幕高度
	_windowWidth 	: $(window).width(),

	_conWidth 	:0,	//页面容器宽度
	_conHeight	:0,//页面容器高度
	
	_rotateNode		: $('.p-ct'),							// 旋转体
	_turnMode		: $("#turnMode").val(),					// 翻页模式

	_page 			: $('.m-page'),							// 模版页面切换的页面集合
	_pageNum		: $('.m-page').size(),					// 模版页面的个数
	_pageNow		: 0,									// 页面当前的index数
	_pageNext		: null,									// 页面下一个的index数

	_preLoadPageCount: 1,									// 预加载页数（第一次加载前几页）

	_touchStartValY	: 0,									// 触摸开始获取的第一个值
	_touchDeltaY	: 0,									// 滑动的距离

	_loopMode		: $("#isLoop").val()=="true",			// 是否开启循环模式
	
	_moveStart		: true,									// 触摸移动是否开始
	_movePosition	: null,									// 触摸移动的方向（上、下）
	_movePosition_c	: null,									// 触摸移动的方向的控制
	_mouseDown		: false,								// 判断鼠标是否按下
	_moveFirst		: true,
	_moveInit		: false,
	_moveing		: false,								//是否正在移动切换
	
	_autoTurning:false,									//是否正在自动翻页
	
	_turnPageDuration:500,							//翻页持续时间

	_firstChange	: false,

	_map 			: $('.ylmap'),							// 地图DOM对象
	_mapValue		: null,									// 地图打开时，存储最近打开的一个地图
	_mapIndex		: null,									// 开启地图的坐标位置

	_audioNode		: $('.u-audio'),						// 声音模块
	_audio			: null,									// 声音对象
	_audio_val		: true,									// 声音是否开启控制
	_hasClickAudioCountorl:false,							// 是否点击过声音控制按钮
	_audioSysOff	: false,								//是否点击音乐开关关闭音乐
	
	_elementStyle	: document.createElement('div').style,	// css属性保存对象
	
	_paddingTop		:0,										//距离顶部距离
	_paddingLeft	:0,										//距离左边距离
	
	_imgScale		:1,										//图片为适应屏幕做的缩放
	
	_maskIndex		:0,										//蒙版出现的位置
	_maskType		:0,										//蒙版类型 0：擦除效果 1：点击消失
	_maskHasDel		:0,										//蒙版是否已经删除
	
	_linkUrl		:'',									//点击了解链接地址
	
	hasSubmitInfo	:false,									//是否已经提交信息成功
	
	hasSubmitInfoForms	:[],								//是否已经提交信息表单列表
	
	rscript : /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

	_UC 			: RegExp("Android").test(navigator.userAgent)&&RegExp("UC").test(navigator.userAgent)? true : false,
	_weixin			: RegExp("MicroMessenger").test(navigator.userAgent)? true : false,
	_iPhoen			: RegExp("iPhone").test(navigator.userAgent)||RegExp("iPod").test(navigator.userAgent)||RegExp("iPad").test(navigator.userAgent)? true : false,
	_Android		: RegExp("Android").test(navigator.userAgent)? true : false,
	_IsPC			: function(){ 
						var userAgentInfo = navigator.userAgent; 
						var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
						var flag = true; 
						for (var v = 0; v < Agents.length; v++) { 
							if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; } 
						} 
						return flag; 
					} ,

/***********************
 *  = gobal通用函数
 ***********************/
 	// 判断函数是否是null空值
	_isOwnEmpty		: function (obj) { 
						for(var name in obj) { 
							if(obj.hasOwnProperty(name)) { 
								return false; 
							} 
						} 
						return true; 
					},
	// 判断浏览器内核类型
	_vendor			: function () {
						var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
							transform,
							i = 0,
							l = vendors.length;
				
						for ( ; i < l; i++ ) {
							transform = vendors[i] + 'ransform';
							if ( transform in this._elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
						}
						return false;
					},
	// 判断浏览器来适配css属性值
	_prefixStyle	: function (style) {
						if ( this._vendor() === false ) return false;
						if ( this._vendor() === '' ) return style;
						return this._vendor() + style.charAt(0).toUpperCase() + style.substr(1);
					},
	// 判断是否支持css transform-3d（需要测试下面属性支持）
	_hasPerspective	: function(){
						var ret = this._prefixStyle('perspective') in this._elementStyle;
						if ( ret && 'webkitPerspective' in this._elementStyle ) {
							this._injectStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
								ret = node.offsetLeft === 9 && node.offsetHeight === 3;
							});
						}
						return !!ret;
					},
		_translateZ : function(){
						if(car2._hasPerspective){
							return ' translateZ(0)';
						}else{
							return '';
						}
					},

	// 判断属性支持是否
	_injectStyles 	: function( rule, callback, nodes, testnames ) {
						var style, ret, node, docOverflow,
							div = document.createElement('div'),
							body = document.body,
							fakeBody = body || document.createElement('body'),
							mod = 'modernizr';

						if ( parseInt(nodes, 10) ) {
							while ( nodes-- ) {
								node = document.createElement('div');
								node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
								div.appendChild(node);
								}
						}

						style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
						div.id = mod;
						(body ? div : fakeBody).innerHTML += style;
						fakeBody.appendChild(div);
						if ( !body ) {
							fakeBody.style.background = '';
							fakeBody.style.overflow = 'hidden';
							docOverflow = docElement.style.overflow;
							docElement.style.overflow = 'hidden';
							docElement.appendChild(fakeBody);
						}

						ret = callback(div, rule);
						if ( !body ) {
							fakeBody.parentNode.removeChild(fakeBody);
							docElement.style.overflow = docOverflow;
						} else {
							div.parentNode.removeChild(div);
						}

						return !!ret;
					},
	// 自定义事件操作
 	_handleEvent 	: function (type) {
						if ( !this._events[type] ) {
							return;
						}

						var i = 0,
							l = this._events[type].length;

						if ( !l ) {
							return;
						}

						for ( ; i < l; i++ ) {
							this._events[type][i].apply(this, [].slice.call(arguments, 1));	
						}
					},
	// 给自定义事件绑定函数
	_on				: function (type, fn) {
						if ( !this._events[type] ) {
							this._events[type] = [];
						}

						this._events[type].push(fn);
					},
	//禁止滚动条
	_scrollStop		: function(){
						//禁止滚动
						$(window).on('touchmove.scroll',function(e){
							if($(e.target).closest(".disableDragX_bak").length==0){
								e.preventDefault();
							}
						});
						$(window).on('scroll.scroll',function(e){
							if($(e.target).closest(".disableDragX_bak").length==0){
								e.preventDefault();
							}
						});
					},
	//启动滚动条
	_scrollStart 	: function(){		
						//开启屏幕禁止
						$(window).off('touchmove.scroll');
						$(window).off('scroll.scroll');
					},
	//滚动条控制事件
	_scrollControl	: function(e){e.preventDefault();},
	trace:function(info){
 		if($(".console").length>0){
 			$(".console").html(info);
 		}else{
	 		var showDiv = $(document.createElement('div')).html(info);
	 		showDiv.addClass("console");
	 		showDiv.css("position","absolute");
	 		showDiv.css("width","300px");
	 		showDiv.css("height","30px");
	 		showDiv.css("background-color","#FFFFFF");
	 		showDiv.css("top","10px");
	 		$("body").append(showDiv);
 		}
 	},

/**************************************************************************************************************/
/*  关联处理函数
***************************************************************************************************************/
	
	checkTxtCanScroll:function(txt){
			var scrollHeight = txt.attr("scrollHeight");
			var scrollTop = txt.attr("scrollTop");
			var h = txt.attr("clientHeight");
			var flag = "";
			if(h+scrollTop>=scrollHeight){
				flag = "B";
			}else if(scrollTop<=0){
				flag = "T";
			}
			return flag;
	},
	
/**
 *  单页面-m-page 切换的函数处理
 *  -->绑定事件
 *  -->事件处理函数
 *  -->事件回调函数
 *  -->事件关联函数【
 */
 	// 页面切换开始
 	page_start		: function(){
		if(car2._pageNum>1){
			car2._page.on('touchstart mousedown',car2.page_touch_start);
			car2._page.on('touchmove mousemove',car2.page_touch_move);
			car2._page.on('touchend mouseup',car2.page_touch_end);
		}
 	},

 	// 页面切换停止
 	page_stop		: function(){
		car2._page.off('touchstart mousedown');
 		car2._page.off('touchmove mousemove');
 		car2._page.off('touchend mouseup');
 	},

 	// page触摸移动start
 	page_touch_start: function(e){
 		car2._handleEvent('touchPage');
 		if(!car2._moveStart||car2._moveing) return;
		if(car2._page.eq(car2._pageNow).attr("canTurnPage")=="false"){
        	return;
       	}
 		if(e.type == "touchstart"){
        	car2._touchStartValY = window.event.touches[0].pageY;
        }else{
        	car2._touchStartValY = e.pageY||e.y;
        	car2._mouseDown = true;
        }

        car2._moveInit = true;

        // start事件
        car2._handleEvent('start');
        
//        if(!car2._hasClickAudioCountorl){
//        	if(car2._audio){
//        		car2._audio.play();
//        	}
//        }
 	},

 	// page触摸移动move
 	page_touch_move : function(e){
 		if($(e.target).closest(".disableDragX_bak").length==0)e.preventDefault();
		if(!car2._moveStart) return;
		if(!car2._moveInit) return;

		// 设置变量值
 		var $self = car2._page.eq(car2._pageNow),
 			h = parseInt($self.height()),
 			moveP,
 			scrollTop,
 			node=null,
 			move=false;

 		// 获取移动的值
 		if(e.type == "touchmove"){
        	moveP = window.event.touches[0].pageY;
        	move = true;
        }else{
        	if(car2._mouseDown){
        		moveP = e.pageY||e.y;
        		move = true;
        	}else return;
        }
 		
 		var startLen = $(e.target).closest(".disableDragX_bak").length>0?0:100;
 		if(Math.abs(car2._touchStartValY-moveP)<startLen){
 			return;
 		}
 		if(car2._touchStartValY-moveP>0){
	 		if($(e.target).closest(".disableDragX_bak").length>0){
	 			var txt = $(e.target).closest(".disableDragX_bak")[0];
	 			if(car2.checkTxtCanScroll($(txt))!="B"){
	 				return;
	 			}else{
	 				e.preventDefault();
	 			}
	 		}
 		}else{
 			if($(e.target).closest(".disableDragX_bak").length>0){
	 			var txt = $(e.target).closest(".disableDragX_bak")[0];
	 			if(car2.checkTxtCanScroll($(txt))!="T"){
	 				return;
	 			}else{
	 				e.preventDefault();
	 			}
	 		}
 		}
 		car2._moveing = true;
		// 获取下次活动的page
        node = car2.page_position(e,moveP,$self);

        if(node!=undefined){
        	if(moveP-car2._touchStartValY<0){//向上滑动屏幕
        		if(node[0].getAttribute("hasloaded")!="true"){//如果下个页面没有加载完成，则提示
        			car2._pageNext = null;
        			car2.loadingLastPageShow();
        			return;
        		}
        	}
        }
		// page页面移动 		
 		car2.page_translate(node);
        // move事件
        car2._handleEvent('move');
 	},

 	// page触摸移动判断方向
 	page_position	: function(e,moveP,$self){ 		
 		var now,next;
	
 		// 设置移动的距离
 		if(moveP!='undefined') car2._touchDeltaY = moveP - car2._touchStartValY;

 		// 设置移动方向
    	car2._movePosition = moveP - car2._touchStartValY >0 ? 'down' : 'up';
    	if(car2._movePosition!=car2._movePosition_c){
    		car2._moveFirst = true;
    		car2._movePosition_c = car2._movePosition;
    	}else{
			car2._moveFirst = false;
    	}

		// 设置下一页面的显示和位置        
        if(car2._touchDeltaY<=0){
        	if($self.next('.m-page').length == 0){
        		if(car2._loopMode){
        			car2._pageNext = 0;
        		}else{
        			//提示已结束
        			car2.loadingLastPageShow("作品已经结束，谢谢观看！");
        			car2._mouseDown = car2._moveInit = false;
        			return;
        		}
        	} else {
        		car2._pageNext = car2._pageNow+1;	
        	}
 			
 			next = car2._page.eq(car2._pageNext)[0];
 		}else{
 			if($self.prev('.m-page').length == 0 ) {
 				if (car2._firstChange) {
 					car2._pageNext = car2._pageNum - 1;
 				} else {
 					return;
 				}
 			} else {
 				car2._pageNext = car2._pageNow-1;	
 			}
 			
 			next = car2._page.eq(car2._pageNext)[0];
 		}

 		now = car2._page.eq(car2._pageNow)[0];
 		node = [next,now];

 		// move阶段根据方向设置页面的初始化位置--执行一次
 		if(car2._moveFirst) car2.init_next(node);
 		return node;
 	},
 	init_next:function(node){
 		var s,l,_translateZ = car2._translateZ();

			car2._page.removeClass('action');
			$(node[1]).addClass('action').removeClass('f-hide');
			car2._page.not('.action').addClass('f-hide');
			
			// 模版高度适配函数处理
 		car2.height_auto(car2._page.eq(car2._pageNext),'false');

			// 显示对应移动的page
		$(node[0]).removeClass('f-hide').addClass('active'); 

 		// 设置下一页面的显示和位置        
        if(car2._movePosition=='up'){
				s = parseInt($(window).scrollTop());
				if(s>0) l = $(window).height()+s;
				else l = $(window).height();
				l = l/car2._imgScale;
				node[0].style[car2._prefixStyle('transform')] = 'translate(0,'+l+'px)'+_translateZ;
				$(node[0]).attr('data-translate',l);

				$(node[1]).attr('data-translate',0);
 		}else{
 				l = Math.max($(window).height(),$(node[0]).height());
 				l = l/car2._imgScale;
 				
				node[0].style[car2._prefixStyle('transform')] = 'translate(0,-'+l+'px)'+_translateZ;
				$(node[0]).attr('data-translate',-l);

				$(node[1]).attr('data-translate',0);
 		}
 	},
 	// page触摸移动设置函数
 	page_translate	: function(node){
 		// 没有传值返回
 		if(!node) return;
		
 		var _translateZ = car2._translateZ(),
 			y_1,y_2,scale,
 			y = car2._touchDeltaY;

 		if("3D"==car2._turnMode){//立体翻页
	 		var r = 0;
	 		var translate0Y = 0;
	 		var translate0Z = 0;
	 		var translate1Y = 0;
	 		var translate1Z = 0;
	 		
	 		var index0 = "1";
	 		var index1 = "0";
	 		
	 		// 切换的页面移动
			r = 90*(-y/car2._windowHeight);
			
			if(y<0){//向后翻页
				r0 = -(90-r);
				r1 = r;
				translate0Y = translate0Z = (car2._windowHeight+y)/2;
				translate1Y = y/2;
				translate1Z = -y/2;
			}else{//向前翻页
				r0 = 90+r;
				r1 = r;
				translate1Y = translate1Z = y/2;
				
				translate0Y = -(car2._windowHeight-y)/2;
				translate0Z = (car2._windowHeight-y)/2;
			}
	 		
			node[0].style[car2._prefixStyle('transform')] = "rotateX("+r0+"deg) translateY("+translate0Y+"px) translateZ("+translate0Z+"px)";
			node[0].style["z-index"] = "1";
			
			// 当前的页面移动
	 		var transformStr = "rotateX("+r1+"deg) translateY("+translate1Y+"px) translateZ("+translate1Z+"px)";
			node[1].style[car2._prefixStyle('transform')] = transformStr;
			node[1].style["z-index"] = "0";
 		}else{
 			if($(node[0]).attr('data-translate')) y_1 = y + parseInt($(node[0]).attr('data-translate'));
 			node[0].style[car2._prefixStyle('transform')] = 'translate(0,'+y_1+'px)'+_translateZ;
 			
 			// 当前的页面移动
 			if($(node[1]).attr('data-translate')) y_2 = y + parseInt($(node[1]).attr('data-translate'));
 			scale = 1 - Math.abs(y*0.2/$(window).height());
 			
 			
 			
 			if("V2"!=car2._turnMode){
 				y_2 = y_2/5;
 			}
 			var node1Style = 'translate(0,'+y_2+'px)'+_translateZ;
 			if(typeof(car2._turnMode)=='undefined'||"V"==car2._turnMode){
 				node1Style+=' scale('+scale+')';
 			}
 			node[1].style[car2._prefixStyle('transform')] = node1Style;
 		}
 	},

 	// page触摸移动end
 	page_touch_end	: function(e){
// 		if($(e.target).closest(".disableDragX_bak").length>0){
// 			if(!car2._canMoveToUp&&!car2._canMoveToDown){
// 				return;
// 			}
// 		}
 		car2._moveInit = false;
 		car2._mouseDown = false;
 		if(!car2._moveStart) {car2._moveing = false;return};
 		if(car2._autoTurning) {car2._moveing = false;return};
 		if(!car2._pageNext&&car2._pageNext!=0) {car2._moveing = false;return};
 		car2._moveStart = false;

 		// 确保移动了
 		if(Math.abs(car2._touchDeltaY)>10){
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transition')] = 'all .6s';
 			car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transition')] = 'all .6s';
 		}
			
		// 页面切换
 		if(Math.abs(car2._touchDeltaY)>=100){		// 切换成功
 			car2.page_success();
 		}else if(Math.abs(car2._touchDeltaY)>10&&Math.abs(car2._touchDeltaY)<100){	// 切换失败		
 			car2.page_fial();
 		}else{									// 没有切换
 			car2.page_fial();
 		}

 		// end事件
        car2._handleEvent('end');

        // 注销控制值
 		car2._movePosition = null;
 		car2._movePosition_c = null;
 		car2._touchStartValY = 0;
 	},

 	// 切换成功
 	page_success	: function(){
 		if(car2._turnMode=="3D"){
 			var r1 = 90;
 			var translate1Y = "";
 			if(car2._touchDeltaY < 0){
 				r1 = 90;
 				translate1Y = -car2._windowHeight/2;
 			}else{
 				r1 = -90;
 				translate1Y = car2._windowHeight/2;
 			}
 			var translate1Z = car2._windowHeight/2;
 			
 			var transformStr = "rotateX("+r1+"deg) translateY("+translate1Y+"px) translateZ("+translate1Z+"px)";
 			
 			// 下一个页面的移动
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = "rotateX(0deg) translateY(0px) translateZ(0px)";
 			
 			//当前页面的移动
 			car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transform')] = transformStr;
 		}else{
 			var _translateZ = car2._translateZ();
	 		// 下一个页面的移动
	 		car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = 'translate(0,0)'+_translateZ;
	
	 		// 当前页面变小的移动
	 		var transY = $(window).height();
	 		if("V2"!=car2._turnMode){
	 			transY = transY/5;
	 		}
	 		var y = car2._touchDeltaY > 0 ? transY : -transY;
	 		var scale = 0.8;
	 		var node1Style = 'translate(0,'+y+'px)'+_translateZ;
	 		if(typeof(car2._turnMode)=='undefined'||"V"==car2._turnMode){
				node1Style+=' scale('+scale+')';
			}
			car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transform')] = node1Style;
 		}
 		
 		// 成功事件
    	car2._handleEvent('success');
 	},
 	//翻页（只能向前向后单页翻）
 	pageTurn:function(isNext){
 		if(car2._moveing)return;
 		
 		//对涂抹页的判断
 		if(car2._maskHasDel!=1&&$('#r-cover').val()!=null&&$('#r-cover').val().length>5){//有蒙版且蒙版没有清除
 			//当前是否是显示蒙版
 			if(car2._pageNow == car2._maskIndex){
 				if(car2._maskType=="2"){
 					slice.startShowEffect($(".sliceCon"));
 					return;
 				}else if(car2._maskType=="0"){
	 				alert("当前是涂抹页！");
	 				return;
 				}else if(car2._maskType=="1"){
	 				alert("当前是点击打开页！");
	 				return;
 				}
 			}
 		}
 		if(isNext){
 			if(car2.isLoop==false&&car2._pageNow>=car2._pageNum-1){
 				car2.loadingLastPageShow("作品已经结束，谢谢观看！");
 				return;
 			}
 			car2._movePosition = "up";
 			if(car2._pageNow>=car2._pageNum-1){
 				car2._pageNext = 0;
 			}else{
 				car2._pageNext = (car2._pageNow+1);
 			}
 		}else{
 			if(car2._pageNow<=0){
 				car2.loadingLastPageShow("当前是第一页！");
 				return;
 			}
 			car2._movePosition = "down";
 			car2._pageNext = (car2._pageNow-1);
 		}
 		car2._moveing = true;
 		car2._autoTurning = true;
 		var now = car2._page.eq(car2._pageNow)[0];
 		var next = car2._page.eq(car2._pageNext)[0];
 		node = [next,now];
 		car2.init_next(node);
 		
 		setTimeout(function(){
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transition')] = 'all '+car2._turnPageDuration+'ms';
 			car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transition')] = 'all '+car2._turnPageDuration+'ms';
 			var _translateZ = car2._translateZ();
 			// 下一个页面的移动
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = 'translate(0,0)'+_translateZ;
 			//当前页面移动
 			var y = 0;
 			if(car2._movePosition == "up"){
 				y = -$(window).height();
 			}else{
 				y = $(window).height();
 			}
 			if("V2"!=car2._turnMode){
 				y=y/5;
 			}
 			scale = 1 - Math.abs(y*0.2/$(window).height());
 			var node1Style = 'translate(0,'+y+'px)'+_translateZ;
 			if(typeof(car2._turnMode)=='undefined'||"V"==car2._turnMode){
 				node1Style+=' scale('+scale+')';
 			}
 			car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transform')] = node1Style;
 				// 成功事件
 				car2._handleEvent('success');
 		},100);
 	},
 	//翻页（可翻到制定页数）
 	pageTurnTo:function(turnPageID){
 		if(car2._moveing)return;
 		
 		//对涂抹页的判断
 		if(car2._maskHasDel!=1&&$('#r-cover').val()!=null&&$('#r-cover').val().length>5){//有蒙版且蒙版没有清除
 			//当前是否是显示蒙版
 			if(car2._pageNow == car2._maskIndex){
 				if(car2._maskType=="2"){
 					slice.startShowEffect($(".sliceCon"));
 					return;
 				}else if(car2._maskType=="0"){
	 				alert("当前是涂抹页！");
	 				return;
 				}else if(car2._maskType=="1"){
	 				alert("当前是点击打开页！");
	 				return;
 				}
 			}
 		}
 		var toIndex = 0;
 		var pageIndex = 0;
 		car2._page.each(function(){
 			if($(this).attr("pageid")==turnPageID){
 				toIndex = pageIndex;
 			}else if($(this).find(".swiper-slide").length>0){//是否是左右轮播页
 				$(this).find(".swiper-slide").each(function(){
 					if($(this).attr("pageid")==turnPageID){
 						toIndex = pageIndex;
 					}
 				});
 			}
 			pageIndex++;
 		});
 		toIndex = toIndex-car2._pageNow;
 		if(toIndex==0){
 			return;
 		}
 		if(toIndex>0){
 			if(car2.isLoop==false&&car2._pageNow>=car2._pageNum-1){
 				car2.loadingLastPageShow("作品已经结束，谢谢观看！");
 				return;
 			}
 			car2._movePosition = "up";
 			if(car2._pageNow>=car2._pageNum-1){
 				car2._pageNext = 0;
 			}else{
 				car2._pageNext = (car2._pageNow+toIndex);
 			}
 		}else{
 			if(car2._pageNow<=0){
 				car2.loadingLastPageShow("当前是第一页！");
 				return;
 			}
 			car2._movePosition = "down";
 			car2._pageNext = (car2._pageNow+toIndex);
 		}
 		car2._moveing = true;
 		car2._autoTurning = true;
 		
 		var now = car2._page.eq(car2._pageNow)[0];
 		var next = car2._page.eq(car2._pageNext)[0];
 		node = [next,now];
 		car2.init_next(node);
 		
 		setTimeout(function(){
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transition')] = 'all '+car2._turnPageDuration+'ms';
 			car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transition')] = 'all '+car2._turnPageDuration+'ms';
 			var _translateZ = car2._translateZ();
 			// 下一个页面的移动
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = 'translate(0,0)'+_translateZ;
 			//当前页面移动
 			var y = 0;
 			if(car2._movePosition == "up"){
 				y = -$(window).height();
 			}else{
 				y = $(window).height();
 			}
 			if("V2"!=car2._turnMode){
 				y=y/5;
 			}
 			scale = 1 - Math.abs(y*0.2/$(window).height());
 			var node1Style = 'translate(0,'+y+'px)'+_translateZ;
 			if(typeof(car2._turnMode)=='undefined'||"V"==car2._turnMode){
 				node1Style+=' scale('+scale+')';
 			}
 			car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transform')] = node1Style;
 				// 成功事件
 				car2._handleEvent('success');
 		},100);
 	},
 	// 切换失败
 	page_fial	: function(){
 		car2._moveing = false;
 		var _translateZ = car2._translateZ();

 		// 判断是否移动了
		if(!car2._pageNext&&car2._pageNext!=0) {
			car2._moveStart = true;
			car2._moveFirst = true;
			return;
		}

 		if(car2._movePosition=='up'){
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = 'translate(0,'+$(window).height()+'px)'+_translateZ;
 		}else{
 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = 'translate(0,-'+$(window).height()+'px)'+_translateZ;
 		}

 		car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transform')] = 'translate(0,0)'+_translateZ+' scale(1)';

 		// fial事件
    	car2._handleEvent('fial');
 	},
/**
 * 开始加载前几页的所有图片
 * startPageIndex:前几页
 * callBack:加载完成回调函数
 */	
 loadStartImg:function(startPageIndex,callBack){
	 var pageArray = new Array();
	 if(startPageIndex>car2._pageNum){
		 startPageIndex = car2._pageNum;
	 }
	 for(var i=0;i<startPageIndex;i++){
		 pageArray.push(car2._page.eq(i));
	 }
	 pageArray.push($(".m-page-pop"));
	 loadPageTools.loadPagesArray(pageArray,true,callBack);
 },
/**
 *  对象函数事件绑定处理
 *  -->start touch开始事件
 *  -->mov   move移动事件
 *  -->end   end结束事件
 */
 	haddle_envent_fn : function(){
		// 切换失败事件
		car2._on('fial',function(){
			setTimeout(function(){
				car2._page.eq(car2._pageNow).attr('data-translate','');
 				car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transform')] = '';
 				car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transition')] = '';
 				car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = '';
	 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transition')] = '';

	 			car2._page.eq(car2._pageNext).removeClass('active').addClass('f-hide');
				car2._moveStart = true;
				car2._moveFirst = true;
				car2._pageNext = null;
				car2._touchDeltaY = 0;
	 		},600)
		})

		// 切换成功事件
		car2._on('success',function(){
			// 判断最后一页让，开启循环切换
			if (car2._loopMode&&car2._pageNext == 0 && car2._pageNow == car2._pageNum -1) {
				car2._firstChange = true;
			}
			setTimeout(function(){
				// 判断是否为最后一页，显示或者隐藏箭头
				if(car2._pageNext == car2._pageNum-1 ){
					$('.u-arrow').addClass('f-hide');
				}else{
					if($('#j-mengban').hasClass('z-show')){
						
					}else{
						$('.u-arrow').removeClass('f-hide');
					}
				}
	 			car2._page.eq(car2._pageNow).addClass('f-hide');

				car2._page.eq(car2._pageNow).attr('data-translate','');
 				car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transform')] = '';
 				car2._page.eq(car2._pageNow)[0].style[car2._prefixStyle('transition')] = '';
 				car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transform')] = '';
	 			car2._page.eq(car2._pageNext)[0].style[car2._prefixStyle('transition')] = '';

	 			// 初始化切换的相关控制值
	 			$('.p-ct').removeClass('fixed');
	 			car2._page.eq(car2._pageNext).removeClass('active');
				car2._page.eq(car2._pageNext).removeClass('fixed');
				car2._pageNow = car2._pageNext;
				car2._moveStart = true;
				car2._moveFirst = true;
				car2._moveing = false;
				car2._autoTurning = false;
				car2._pageNext = null;
				car2._page.eq(car2._pageNow).removeClass('fixed');
				car2._page.eq(car2._pageNow).attr('data-translate','');
				car2._touchDeltaY = 0;

				car2._handleEvent("turnEnd");
				
				// 切换成功后，执行当前页面的动画---延迟200ms
				setTimeout(function(){
					if(car2._page.eq(car2._pageNow).hasClass('z-animate')) return;
					car2._page.eq(car2._pageNow).addClass('z-animate');
				},20)

				// 隐藏图文组件的文本
				$('.j-detail').removeClass('z-show');
				$('.txt-arrow').removeClass('z-toggle');
				
				//判断当前页面是否有蒙版
				if(car2._maskHasDel==0&&$('#r-cover').val()!=null&&$('#r-cover').val().length>3){
			 		//检测是否下一页有蒙版
			 		if(car2._pageNow == car2._maskIndex){
			 			if(car2._maskType=="1"){
			 				car2.page_stop();
			 				car2._scrollStop();
			 			}else{
			 				if(car2._maskType=="0"){
				 				//启动蒙版
				 				$('#j-mengban').removeClass("f-hide");
				 				$('#j-mengban').addClass("z-show");
				 				//用当前页实际图片替换为当前显示图片
				 				car2._page.eq(car2._pageNow).each(function(){
				 					var osrc = $(this).find(".page-con-img").attr("origin-src");
				 					$(this).find(".page-con-img").attr("src",osrc);
				 				});
			 				}
			 			}
			 			// 箭头隐藏
						$('.u-arrow').addClass('f-hide');
						//隐藏音乐开关
						car2._audioNode.addClass('f-hide');
			 		}else{
			 			car2.startEffect();
			 		}
		 		}else{
		 			if(car2._page.eq(car2._pageNow).attr("canTurnPage")=="false"){//如果当前页不能翻页则隐藏翻页箭头
		 				// 箭头隐藏
						$('.u-arrow').addClass('f-hide');
		 	       	}else{
		 	       		$('.u-arrow').removeClass('f-hide');
		 	       	}
		 			car2.startEffect();
		 		}
				// 切换停止视频的播放
				$('video').each(function(){
					if(!this.paused) this.pause();
				})
				h5TextArea.updatePageInfo();
	 		},car2._turnPageDuration)
		})
 	},
 	
 	startEffect:function(pageEle,items,notStopOthers){
 		if(typeof(items)=="undefined"){
	 			var curPageEle;
		 		if(typeof(pageEle)=='undefined'){
		 			//暂停所有非当前页动画
//		 			car2._page.not(car2._pageNow).each(function(){
//		 				car2.stopEffect($(this));
//		 			});
		 			curPageEle = car2._page.eq(car2._pageNow);
		 		}else{
		 			curPageEle = pageEle;
		 		}
		 		if(curPageEle.find(".swiper-slide-active").length>0){//垂直翻页到有组图页的页面
		 			curPageEle = curPageEle.find(".swiper-slide-active");
		 		}
		 		if(curPageEle.hasClass("long-page")){//长图页只播放当前可见元素
		 			
		 		}else{
		 			items = curPageEle.find(".animation");
		 		}
	 	}
 		if(typeof(items)=="undefined"){
 			return;
 		}
 		if(typeof(notStopOthers)!=="undefined"&&notStopOthers){
 			//长图页，不删除当前页的其他不需要播放动画的元素
 			car2.stopEffect(undefined,car2._page.eq(car2._pageNow).find(".animation").not(items));
 		}else{
 			//删除非需要播放的动画
 			car2.stopEffect(undefined,$(".animation").not(items));
 		}
	 		//启动所有当前页动画
	 		$(items).each(function(){
 				//判断是否有控制该元素显示的元素
 				var flag = $.fn.checkIsCanPlayEffect(this);
 				if(flag){
 					$.fn.playEffect(this);
 				}
	 		});
	 		if(car2._audioSysOff==false){//通过音乐开关关闭音乐，则翻页播放音乐事件失效
	 			car2.audio_play();
	 		}
 	},
 	stopEffect:function(pageEle,items){
 		if(typeof(items)=="undefined"){
 			items = pageEle.find(".animation");
 		}
		if(typeof(items)=="undefined"){
			return;
		}
 		$(items).each(function(){
 			$.fn.stopEffect(this);
 		});
 	}
 	,
/**
 *  地图创建函数处理
 *  -->绑定事件
 *  -->事件处理函数
 *  -->创建地图
 *  -->函数传值
 *  -->关闭函数回调处理
 */
 	// 自定义绑定事件
	mapAddEventHandler	 : function(obj,eventType,fn,option){
	    var fnHandler = fn;
	    if(!car2._isOwnEmpty(option)){
	        fnHandler = function(e){
	            fn.call(this, option);  //继承监听函数,并传入参数以初始化;
	        }
	    }
	    obj.each(function(){
	  	  $(this).on(eventType,fnHandler);
	    })
	},

	//点击地图按钮显示地图
	mapShow : function(option){
		// 获取各自地图的资源信息
		var str_data = $(this).attr('data-detail');
		option.detal = str_data;
		option.latitude = $(this).attr('data-latitude');
		option.longitude = $(this).attr('data-longitude');

		// 地图添加
		var detal		= option.detal,
			latitude	= option.latitude,
			longitude	= option.longitude,
		 	fnOpen		= option.fnOpen,
			fnClose		= option.fnClose;

		car2._scrollStop();
		car2._map.addClass('show');
		$(document.body).animate({scrollTop: 0}, 0);
		
		//判断开启地图的位置是否是当前的
		if($(this).attr('data-mapIndex')!=car2._mapIndex){
			car2._map.html($('<div class="bk"><span class="css_sprite01 s-bg-map-logo"></span></div>'));
			car2._mapValue = false;
			car2._mapIndex = $(this).attr('data-mapIndex');
		}else{
			car2._mapValue = true;	
		} 

		setTimeout(function(){
			//将地图显示出来
			if(car2._map.find('div').length>=1){
				car2._map.addClass("mapOpen");
				car2.page_stop();
				car2._scrollStop();
				car2._audioNode.addClass('z-low');
				// 设置层级关系-z-index
				car2._page.eq(car2._pageNow).css('z-index',15);

				setTimeout(function(){
					//如果开启地图的位置不一样则，创建新的地图
					if(!car2._mapValue) car2.addMap(detal,latitude,longitude,fnOpen,fnClose);
				},500)
			}else return;
		},100)
	},	
	
	//地图关闭，将里面的内容清空（优化DON结构）
	mapSave	: function(){
		$(window).on('webkitTransitionEnd transitionend',mapClose);
		car2.page_start();
		car2._scrollStart();
		car2._map.removeClass("mapOpen");
		car2._audioNode.removeClass('z-low');

		if(!car2._mapValue) car2._mapValue = true;

		function mapClose(){
			car2._map.removeClass('show');
			// 设置层级关系-z-index
			car2._page.eq(car2._pageNow).css('z-index',9);
			$(window).off('webkitTransitionEnd transitionend');
		}
	},

	//地图函数传值，创建地图
	addMap	: function (detal,latitude,longitude,fnOpen,fnClose){
		var detal		= detal,
			latitude	= Number(latitude),
			longitude	= Number(longitude);

		var fnOpen		= typeof(fnOpen)==='function'? fnOpen : '',
			fnClose		= typeof(fnClose)==='function'? fnClose : '';

		//默认值设定
		var a = {sign_name:'',contact_tel:'',address:detal};

		
		//检测传值是否为空，设置传值
//		car2._isOwnEmpty(detal)	? detal=a:detal=detal;
		detal = a;
		!latitude? latitude=39.915:latitude=latitude;
		!longitude? longitude=116.404:longitude=longitude;
		//创建地图
		car2._map.ylmap({
			/*参数传递，默认为天安门坐标*/
			//需要执行的函数（回调）
			detal		: detal,		//地址值
			latitude	: latitude,		//纬度
			longitude	: longitude,	//经度
			fnOpen		: fnOpen,		//回调函数，地图开启前
			fnClose		: fnClose		//回调函数，地图关闭后
		});	
	},

	//绑定地图出现函数
	mapCreate	: function(){
		if('.j-map'.length<=0) return;

		var node = $('.j-map');

		//option地图函数的参数
		var option ={
			fnOpen	: car2._scrollStop,
			fnClose	: car2.mapSave
		};
		car2.mapAddEventHandler(node,'click',car2.mapShow,option);
	},

/**
 *  media资源管理
 *  -->绑定声音控制事件
 *  -->函数处理声音的开启和关闭
 *  -->异步加载声音插件（延迟做）
 *  -->声音初始化
 *  -->视频初始化
 *  -->声音和视频切换的控制
 */
 	// 声音初始化
 	audio_init : function(){
 		// media资源的加载
		var options_audio = {
			loop: true,
            preload: "auto",
            src: car2._audioNode.attr('data-src')
		}
		
		if(options_audio.src!=null&&options_audio.src.length>5&&car2._audio==null){
	        car2._audio = new Audio(); 
	        try{
		        //监听音乐播放事件，当播放的时候暂停其他音乐
		        car2._audio.addEventListener("playing",function(){
		        	stopParentMusic(false);
				});
	        }catch(e){};
	        for(var key in options_audio){
	            if(options_audio.hasOwnProperty(key) && (key in car2._audio)){
	                car2._audio[key] = options_audio[key];
	            }
	        }
	        if(car2._audio) car2._audio.load();
		}
 	},

 	// 声音事件绑定
 	audio_addEvent : function(){
 		if(car2._audioNode.length<=0) return;

 		// 声音按钮点击事件
 		var txt = car2._audioNode.find('.txt_audio'),
 			time_txt = null;
 		car2._audioNode.find('.btn_audio').on('click',function(){
 			car2._hasClickAudioCountorl = true;
 			car2.audio_contorl();
 			});

 		// 声音打开事件
 		$(car2._audio).on('play',function(){
 			car2._audio_val = false;

 			audio_txt(txt,true,time_txt);

 			// 开启音符冒泡
 			$.fn.coffee.start();
 			$('.coffee-steam-box').show(500);
 		})

 		// 声音关闭事件
 		$(car2._audio).on('pause',function(){
 			audio_txt(txt,false,time_txt)

 			// 关闭音符冒泡
 			$.fn.coffee.stop();
 			$('.coffee-steam-box').hide(500);
 		})

 		function audio_txt(txt,val,time_txt){
 			if(val) txt.text('打开');
 			else txt.text('关闭');

 			if(time_txt) clearTimeout(time_txt);

 			txt.removeClass('z-move z-hide');
 			time_txt = setTimeout(function(){
 				txt.addClass('z-move').addClass('z-hide');
 			},1000)
 		}
 	},

 	// 声音控制函数
 	audio_contorl : function(){
 		if(!car2._audio_val){
 			car2._audioSysOff = true;
 			car2.audio_stop();
 		}else{
 			car2._audioSysOff = false;
 			car2.audio_play();
 		}
 	},	

 	// 声音播放
 	audio_play : function(){
 		car2._audio_val = false;
 		var curPageEle = car2._page.eq(car2._pageNow);
 		
 		car2._page.not(car2._pageNow).each(function(){
 			//停止当前页的所有音乐和视频
 			$(this).find("audio").each(function(){
 				this.pause();
 			});
 			$(this).find("video").each(function(){
 				this.pause();
 			});
 		});
 		if(curPageEle.find("video").length>0){
 			//启动当前页视频
// 			var i=0;
 			curPageEle.find("video").each(function(){
 				this.addEventListener("playing",function(){
 					$(this).parent().find(".videoBtnFlash").remove();
 					$(this).parent().find(".uniImg").remove();
 				});
// 				if(i==0){
// 					if(car2._iPhoen)this.play();
// 				}
// 				i++;
 			});
 		}else if(curPageEle.children("audio").length>0){
	 		//启动当前页的背景音乐
	 		curPageEle.children("audio").each(function(){
	 			this.play();
	 		});
	 		if(car2._audio) car2._audio.pause();
		}else{
			if(car2._audio){
				//alert("paused:"+car2._audio.paused);
				car2._audio.play();
			}
		}
 	},

 	// 声音停止
 	audio_stop	: function(){
 		car2._audio_val = true;
 		if(car2._audio) car2._audio.pause(); 
 		car2._page.each(function(){
	 		//停止当前页的所有音乐
			$(this).find("audio").each(function(){
	 			this.pause();
	 		});
		});
 		
 	},

 	// 视频初始化
 	video_init : function(){
 		// 视频
        $('.j-video').each(function(){
        	var option_video = {
        		controls: 'controls',
        		preload : 'none',
        		// poster : $(this).attr('data-poster'),
        		width : $(this).attr('data-width'),
        		height : $(this).attr('data-height'),
        		src : $(this).attr('data-src')
        	}

        	var video = $('<video class="f-hide"></video>')[0];

        	for(var key in option_video){
                if(option_video.hasOwnProperty(key) && (key in video)){
                    video[key] = option_video[key];
                }
                this.appendChild(video);
            }

            var img = $(video).prev();

            $(video).on('play',function(){
            	img.hide();
            	$(video).removeClass('f-hide');
            });

            $(video).on('pause',function(){
            	img.show();
            	$(video).addClass('f-hide');
            });
        })

        $('.j-video .img').on('click',function(){
        	var video = $(this).next()[0];

        	if(video.paused){
        		$(video).removeClass('f-hide');
        		video.play();
        		$(this).hide();
        	}
        })
 	},

 	//处理声音和动画的切换
	media_control : function(){
		if(!car2._audio) return;
		if($('video').length<=0) return;

		$(car2._audio).on('play', function(){
			$('video').each(function(){
				if(!this.paused){
					this.pause();
				}
			});	
		});

		$('video').on('play', function(){
			if(!car2._audio_val){
				car2.audio_contorl();			
			}
		});
	},

	// media管理初始化
	media_init : function(){
		if(car2.media_inited)return;
		car2.media_inited = true;
		// 声音初始化
		if(typeof(Audio)!='undefined'){
			car2.audio_init();
		}

        // 视频初始化
        car2.video_init();

		// 绑定音乐加载事件
		car2.audio_addEvent();

		// 音频切换
		car2.media_control();
		
		// 音符飘逸
		$('#coffee_flow').coffee({
			steams				: ["<div class='audio_widget_01'/>","<div class='audio_widget_02'/>"], 
			steamHeight			: 100,
			steamWidth			: 44 
		});
	},
/**************************************************************************************************************/
/*  单个处理函数
***************************************************************************************************************/
/**
 * 单个函数处理-unit
 * -->高度的计算
 * -->文本的展开
 * -->文本的收起
 * -->输入表单的操作
 * -->微信的分享提示
 */
	// 根据设备的高度，来适配每一个模版的高度，并且静止滑动
	// --文档初始化计算
	// --页面切换完成计算
	height_auto	: function(ele,val){
		ele.children('.page-con').css('height','auto');
		var height = $(window).height();
		
		// 需要解除固定高度的page卡片
		var vial = true;
		if(!vial){
			if(ele.height()<=height){
				ele.children('.page-con').height(height+2);
				if((!$('.p-ct').hasClass('fixed'))&&val=='true') $('.p-ct').addClass('fixed');
			}else{
				car2._scrollStart();
				if(val=='true') $('.p-ct').removeClass('fixed');
				ele.children('.page-con').css('height','100%');
				return;
			}
		}else{
			ele.children('.page-con').height(height+2);
			if((!$('.p-ct').hasClass('fixed'))&&val=='true') $('.p-ct').addClass('fixed');
		}
	},
	// 表单显示，输入
	input_form : function(){
		$('body').on('click','.popSubmitInfo',function(){
			var formID = $(this).attr("formID");//表单ID
			var formDivId = ".book-form";
			if(formID!=null&&formID!="null"&&formID.length>0){
				formDivId = ".book-form-"+formID;
			}
			var type_show = $(this).attr("data-submit");
			if (type_show == 'true') {
				return;
			}
			var heigt = $(window).height();

			$(document.body).css('height',heigt);
			car2.page_stop();
			car2._scrollStart();
			// 设置层级关系-z-index
			car2._page.eq(car2._pageNow).css('z-index',15);

			$('.book-bg').removeClass('f-hide');
			$(formDivId).removeClass('f-hide');
			$('.u-arrow').addClass('f-hide');
			$('.u-audio').addClass('f-hide');
			setTimeout(function(){
				$(formDivId).addClass('z-show');
				$('.book-bg').addClass('z-show');
			},50)

			$('.book-bg').off('click');
			$('.book-bg').on('click',function(e){
				e.stopPropagation();

				var node = $(e.target);

				if(node.parents(formDivId).length>=1 && !node.hasClass('j-close-img') && node.parents('.j-close').length<=0) return;

				$(formDivId).removeClass('z-show');
				$('.book-bg').removeClass('z-show');
				setTimeout(function(){
					$(document.body).css('height','100%');
					car2.page_start();
					car2._scrollStop();
					// 设置层级关系-z-index
					car2._page.eq(car2._pageNow).css('z-index',9);
					
					$('.book-bg').addClass('f-hide');
					$(formDivId).addClass('f-hide');
				},500)
			})
		})
	}(),

	sex_select : function(){
		var btn = $('#j-signUp').find('.sex p');
		var strongs = $('#j-signUp').find('.sex strong');
		var input = $('#j-signUp').find('.sex input');

		btn.on('click',function(){
			var strong = $(this).find('strong');
			strongs.removeClass('open');
			strong.addClass('open');

			var value = $(this).attr('data-sex');
			input.val(value);
		})
	}(),

	// 显示轻APP按钮
	lightapp_intro_show : function(){
//		if(car2._linkUrl==""){
//			return;
//		}
		$('.market-notice').removeClass('f-hide');
		setTimeout(function(){
			$('.market-notice').addClass('show');
		},100)
	},

	// 隐藏轻APP按钮
	lightapp_intro_hide : function(val){
		if(val){
			$('.market-notice').addClass('f-hide').removeClass('show');
			return;
		} 

		$('.market-notice').removeClass('show');
		setTimeout(function(){
			$('.market-notice').addClass('f-hide')
		},500)
	},
	
	//显示信息条
 	page_show_info_bar:function(){
 		$('.market-page').removeClass('f-hide');
		setTimeout(function(){
			$('.market-page').addClass('show');
			setTimeout(function(){
				$('.market-img').addClass('show');
			},100)
		},100)

		// 禁止滑动
		car2.page_stop();
		car2._scrollStop();
		
		// 点击窗口让内容隐藏
		$('.market-page').off('click');
		$('.market-page').on('click',function(e){
			car2.page_hide_info_bar(e);
		});
		
 	},
 	//隐藏信息条
 	page_hide_info_bar:function(e){
 		if($(e.target).hasClass('market-page')){
			$('.market-img').removeClass('show');
			setTimeout(function(){
				$('.market-page').removeClass('show');
				setTimeout(function(){
					$('.market-page').addClass('f-hide');
				},200)
			},500)
			car2.lightapp_intro_show();

			// 禁止滑动
			car2.page_start();
			car2._scrollStart();
		}
 	},

	// 轻APP介绍弹窗关联
	lightapp_intro : function(){
		// 点击按钮显示内容
		$('.market-notice').on('click',function(){
			car2.page_show_info_bar();
		});

		// 点击窗口让内容隐藏
		$('.market-page').off('click');
		$('.market-page').on('click',function(e){
			car2.page_hide_info_bar();
		});
	},
 	// loading显示
	loadingPageShow : function(){
		$('.u-pageLoading').show();
	},
	
	// loading隐藏
	loadingPageHide : function (){
		$('.u-pageLoading').hide();	
	},
	
	// 页面未加载完成loading显示
	loadingLastPageShow : function(msg){
		if(typeof(msg) == "undefined"){
			msg = "正在努力加载剩余页面...";
		}
		$('.lastPageLoading div').html(msg);
		$('.lastPageLoading').css("opacity",1);
		$('.lastPageLoading').css("z-index",9999999);
		setTimeout(function(){
			car2.loadingLastPageHide();
		},2000);
	},
	
	// 页面未加载完成loading隐藏
	loadingLastPageHide : function (){
		car2._moveing=false;
		$('.lastPageLoading').css("opacity",0);
		$('.lastPageLoading').css("z-index",0);
	},

	// 对象私有变量刷新
	refresh	: function(){
		$(window).height() = $(window).height();
		car2._windowWidth = $(window).width();
	},

/**************************************************************************************************************/
/*  函数初始化
***************************************************************************************************************/
/**
 *  相关插件的启动
 */
	//插件启动函数
 	plugin : function(){
		// 地图
		car2.mapCreate();

		// 蒙板插件
		car2.initMask();
		
		var posInit = function(obj){
			obj.options.ulBtn.find('li').find('a').css({'width':'16px','height':'16px'});
		};
		//投票
		initVote();
 	},

 	// 蒙板插件初始化函数处理
 	cover_draw : function(node,canvas_url,type,w,h,callback){
		if(node.style.display.indexOf('none')>-1) return;
		
		var lottery = new Lottery(node, canvas_url, type, w, h, callback);
		lottery.init();
	},

	// 蒙板插件回调函数处理
    menban_callback: function(){
	    	if(car2._maskHasDel == 0){//防止重复调用
		    	car2._maskHasDel = 1;
		    	setTimeout(function(){
			    	$('#j-mengban canvas').addClass("hideMengBan");
			 		setTimeout(function(){
			 			$('#j-mengban').removeClass('z-show');
			 			$('#j-mengban').addClass('f-hide');
			 			setTimeout(function(){
			 				if(car2._pageNow<car2._pageNum-1){
			 					$('.u-arrow').removeClass('f-hide');
			 				}
			 				car2.page_start();
			 				if(!car2._hasClickAudioCountorl){
			 					car2._audioNode.removeClass('f-hide');
			 					//if(car2._audio)car2._audio.play();
			 				}
			 			},1000);
			 			car2.startEffect();
			 		},500);
		    	},500);
	    	}
		},
	//启动首页的动画
	startFirstPageEffect:function(){
		if(!car2._firstChange&&car2._pageNow==0){
 				if($('#r-cover').val().length==0||car2._maskIndex>0){
 					if(car2._page.eq(car2._pageNow).attr("canTurnPage")=="false"){//如果当前页不能翻页则隐藏翻页箭头
		 				// 箭头隐藏
						$('.u-arrow').addClass('f-hide');
		 	       	}
		 			//首页没有蒙版效果则 启动首页动画
		 			setTimeout(function(){
		 				car2.startEffect();
		 			},500);
 				}else if(car2._maskType=="1"&&car2._pageNow == car2._maskIndex&&car2._maskHasDel=="0"){//首页是点击打开蒙版效果
 					car2.page_stop();
	 				car2._scrollStop();
	 				$('.u-arrow').addClass('f-hide');
 				}
	 		}
	},
	// 初始化蒙板插件
 	initMask : function(){
 		if($('#r-cover').val()==null||$('#r-cover').val().length<4){//如果没有任何蒙版
 			car2.page_start();
 			car2._audioNode.removeClass('f-hide');
// 			if(car2._audio){
// 				car2._audio.play();
// 			}
 			$('.u-arrow').removeClass('f-hide');
 			return;
 		}else if(car2._maskIndex>0){//如果有蒙版且蒙版不为首页则播放音乐
 			if(car2._audio)	car2._audio.play();
 		}
 		if(car2._maskType!="0"){//如果有蒙版且蒙版为非涂抹蒙版则不加载涂抹蒙版
 			car2._audioNode.removeClass('f-hide');
 			$('.u-arrow').removeClass('f-hide');
 			car2.page_start();
 			return;
 		}
		// 涂抹蒙板插件加载
		var node = $('#j-mengban')[0],
			canvas_url = $('#r-cover').val(),
			type = 'image',
			w = car2._conWidth,
			h = car2._conHeight,
			callback = car2.menban_callback;
		if(car2._maskIndex>0){
			//开启翻页
			car2.page_start();
 			$('.u-arrow').removeClass('f-hide');
			// 播放声音
			if(car2._audio){
				car2._audioNode.removeClass('f-hide');
				if(car2._audio)car2._audio.play();
			}
			//隐藏蒙版
			$('#j-mengban').removeClass("z-show");
			$('#j-mengban').addClass("f-hide");
		}else{
			// 箭头隐藏
			$('.u-arrow').addClass('f-hide');
		}
		car2.cover_draw(node,canvas_url,type,w,h,callback);
 	},

/**
 * app初始化
 */
	// 样式适配
	styleInit : function(){
		// 禁止文版被拖动
		document.body.style.userSelect = 'none';
		document.body.style.mozUserSelect = 'none';
		document.body.style.webkitUserSelect = 'none';

		// 判断设备的类型并加上class
		if(car2._IsPC()) $(document.body).addClass('pc');
		else $(document.body).addClass('mobile');
		if(car2._Android) $(document.body).addClass('android');
		if(car2._iPhoen) $(document.body).addClass('iphone');

		$(".item").each(function(){
			var originW = $(this).attr("originW");
			var originH = $(this).attr("originH");
			$(this).find(".uniImg").css({width:originW+"px",height:originH+"px"});
		});
		
		// 判断是否有3d
		if(!car2._hasPerspective()){
			car2._rotateNode.addClass('transformNode-2d');
			$(document.body).addClass('no-3d');
		}
		else{
			car2._rotateNode.addClass('transformNode-3d');
			$(document.body).addClass('perspective');
			$(document.body).addClass('yes-3d');
		}

		$('.u-arrow').on('touchmove',function(e){e.preventDefault()})

//		$('.p-ct').height($(window).height());
//		$('.m-page').css("height","100%");
//		$('#j-mengban').height($(window).height());
//		$('.translate-back').height($(window).height());
	},
	
	initConPostion:function(){
		var transformStart = car2._vendor("transform");
		var imgWidth = $("#imgWidth").val();
		var imgHeight = $("#imgHeight").val();
		$(".swiper-con").each(function(){
			$(this).css("width",imgWidth+"px");
			$(this).css("height",imgHeight+"px");
		});
		try{
			initSwiper();
		}catch(e){}
		$(".customForm").css("top",(400-car2._paddingTop)+"px");
		$(".arrow-left").css("top",imgHeight/2+"px");
		$(".arrow-right").css("top",imgHeight/2+"px");
		
		$(".u-arrow").css(transformStart+"transform","scale("+car2._imgScale+")").css(transformStart+"transform-origin","center 100%");
		$(".u-audio").css(transformStart+"transform","scale("+car2._imgScale+")");
		
		$("#pcCtl").css(car2._prefixStyle("transform"),"scale("+car2._imgScale+")").css(car2._prefixStyle("transform-origin"),"left bottom");
		$(".market-page").css(transformStart+"transform","scale("+car2._imgScale+")").css(transformStart+"transform-origin","bottom");
		$(".showContentWin .swiper-wrapper").css("margin-left",($(window).width()-640)/2+"px");
	},
	// 对象初始化
	init : function(){
//		if(car2._iPhoen){//如果是iphone则自动开始第一个视频，移除播放提示按钮
//			var curPageEle = car2._page.eq(car2._pageNow);
//			var i=0;
// 			curPageEle.find("video").each(function(){
// 				if(i==0){
// 					$(this).parent().find(".videoBtnFlash").remove();
// 					$(this).parent().find(".uniImg").remove();
// 				}
// 				i++;
// 			});
//		}
		
		// 样式，标签的渲染
		// 对象操作事件处理
		this.styleInit();
		this.haddle_envent_fn();

		car2.lightapp_intro();
		
		// 禁止滑动
		 this._scrollStop();

		$('input[type="hidden"]').appendTo($('body'));
		
		// 图片预先加载
		$('<img />').attr('src',$('#r-cover').val());
		$('<img />').attr('src',$('.m-fengye').find('.page-con').attr('data-src'));

		// loading执行一次
		var loading_time = new Date().getTime();
		
		$(window).on('load',car2.windowLoadHandler);
		
		var state = {
				title: "11",
				url: window.location.pathname
		};
		try{
			window.history.replaceState(state,"",window.location.url);
		}catch(e){}
		
		window.addEventListener('popstate', function(e){
			if(e.state){
			    var state = e.state;
			    if(state!=null){
			    	car2.linkToUrl(state.url,true);
			    }
			  }
		}, false);
		$(window).on("resize",function(){
			car2.initView();
			car2.startEffect();
		});
		$(".adPageConBg .bottomBar").css("display","none");
	},
	initDevice:function(){
		if(/.*?(Android|iphone|ipad).*?/gi.test(ua)){
			car2._viewMode = $(window).width()>$(window).height()?"showAll":"clip";
		}else{
			car2._viewMode = "showAll";
		}
		console.info(car2._viewMode);
	},
	addControlView:function(){//添加PC端控制组件
		var ctlCon = $("#pcCtl");
		if(ctlCon.length==0){
			ctlCon = $("<div id='pcCtl' class='f-hide'><div class='prevPageBtn' title='上一页'></div><div class='nextPageBtn' title='下一页'></div></div>");
			$("body").append(ctlCon);
			ctlCon.find(".prevPageBtn").click(function(){
				car2.pageTurn(false);
			});
			ctlCon.find(".nextPageBtn").click(function(){
				car2.pageTurn(true);
			});
		}
	},
	initView:function(){
		car2.initDevice();
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		
		$('.m-page').css("height","100%");
		$('#j-mengban').height(winHeight);
//		$('.translate-back').height(winHeight);
		
		//获取图片因为设备宽高比不一样而造成的图片的遮挡距离
		var imgWidth = $("#imgWidth").val();
		var imgHeight = $("#imgHeight").val();
		car2._rotateNode.css("height",imgHeight+"px");
		
		car2._conWidth = imgWidth;
		car2._conHeight = imgHeight;
		
		if(car2._viewMode=="showAll"){
			if(winWidth/winHeight<imgWidth/imgHeight){
				car2._paddingTop = (winWidth/imgWidth*imgHeight-winHeight)/2;
				car2._imgScale = winWidth/imgWidth;
			}else{
				car2._paddingLeft = (imgWidth/imgHeight*winHeight-winWidth)/2;
				car2._imgScale = winHeight/imgHeight;
			}
			if(car2._pageNum>1){
				car2.addControlView();
			}
			car2._conWidth=Math.round(car2._conWidth*car2._imgScale);
			car2._conHeight=Math.round(car2._conHeight*car2._imgScale);
		}else{
			if(winWidth/winHeight<imgWidth/imgHeight){
				car2._paddingLeft = (imgWidth/imgHeight*winHeight-winWidth)/2;
				car2._imgScale = winHeight/imgHeight;
			}else{
				car2._paddingTop = (winWidth/imgWidth*imgHeight-winHeight)/2;
				car2._imgScale = winWidth/imgWidth;
			}
			car2._conWidth=winWidth;
			car2._conHeight=winHeight;
		}
		var translateVal = "0,0";
		if(car2._viewMode=="showAll"){
			car2._rotateNode.css(car2._prefixStyle("transform-origin"),"center top");
		}else{
			car2._rotateNode.css(car2._prefixStyle("transform-origin"),"center center");
			var l = -(imgWidth-winWidth)/2;
			var t = -(imgHeight-winHeight)/2;
			translateVal = l+"px,"+t+"px";
		}
		car2._rotateNode.css(car2._prefixStyle("transform"),"translate("+translateVal+") scale("+car2._imgScale+")");
		
		car2.initConPostion();
		
		var ctlCon = $("#pcCtl");
		var ctlConLeft = ($(window).width()-car2._conWidth)/2+car2._conWidth+10;
		ctlCon.css("left",ctlConLeft);
	},
	windowLoadHandler:function(){
		car2.initView();

		car2._maskIndex = $("#r-cover-index").val();
		car2._maskType = $("#maskType").val();
		car2._linkUrl = $("#linkUrl").val();

			//开始加载前几页图片
			var firstLoadPageCount = car2._preLoadPageCount;
			if($("#showOnAllLoad").val()=="true"){
				firstLoadPageCount = car2._pageNum;
			}
//			car2.loadStartImg(car2._pageNum,function(){
			car2.loadStartImg(firstLoadPageCount,function(){
				// 显示封面内容
				setTimeout(function(){
					car2._handleEvent('loadComplete');
					var mskUrl = $('#r-cover').val();
					//显示蒙版
					if(car2._maskIndex==0&&mskUrl.length>1){
						// 显示正面
						$('#j-mengban').addClass('z-show');
						$('#j-mengban').removeClass('f-hide');
					}
					car2._scrollStart();
					//隐藏过场图片
					$(".startImg").css("height","0px");
					$('.u-alert').remove();
					$("#pcCtl").removeClass("f-hide");
					$('.translate-back').removeClass('translate-back-hide');
					$('.m-fengye').removeClass('f-hide');
					car2.height_auto(car2._page.eq(car2._pageNow),'false');
					// media初始化
					car2.media_init();
					
					// 插件加载
					try{
						car2.plugin();
					}catch(e){}
					
					//绑定功能事件
					if(typeof bindEvent !="undefined"){
						try{
							bindEvent();
						}catch (e) {	}
					}
					//开启首页动画
					car2.startFirstPageEffect();
					
					car2._handleEvent("begin");
					
					//开始加载剩余的图片
					var lastPageArray = new Array();
					for(var i=firstLoadPageCount;i<car2._pageNum;i++){
						var curPage = car2._page.eq(i);
						lastPageArray.push(curPage);
					}
					loadPageTools.loadPagesArray(lastPageArray,false,function(){
						
					});
					h5TextArea.show();
				},3000)
			});

			// 报名提交执行
			new uniForm().signUp_submit();
	        if(car2._pageNum<2){
				car2.page_stop();
				$('.u-arrow').addClass('f-hide');
			}
	        
	        //微官网跳转解决
	        $("a").click(function(e){
	        	if(window.location.protocol=="http:"){
		        	var pathName =window.location.pathname;
		        	var curUrlName = pathName.substr(pathName.lastIndexOf("/")+1);
		        	curUrlName = curUrlName.replace(/(_(\d+))*.html/,"");
					var href = $(this).attr('href');
					var re = new RegExp(curUrlName+"_(.*?).html");
					if(re.test(href)){
						e.preventDefault();
						car2.linkToUrl(href,false);
					}
	        	}
			});
	},
	//无刷新跳转链接
	linkToUrl:function(href,isForBack){
		$(".m-page-pop").removeClass("uniShowFromRight");
//		$(".expand").css("width","0%");
//		$('.u-alert').removeClass('f-hide');
		//$('.translate-back').addClass('translate-back-hide');
		//car2.audio_stop();
		$.get(href,function(response){
			var newPageContent = $(document.createElement('div')).html(response.replace(car2.rscript, ""));
			$("style").html(newPageContent.find("style").html());
			$(".m-fengye").html(newPageContent.find(".m-fengye").html());
			
			var h = newPageContent.find(".translate-back").css("height");
			$(".translate-back").css("height",h);
			$(".showContentWin").remove();
			newPageContent.find(".showContentWin").each(function(){
				$("body").append(this);
			});
			car2.windowLoadHandler();
			if(!isForBack){
				var state = {
					title: "11",
					url: href
				};
				window.history.pushState(state,"",href);
			}
		});
	}
};

/*初始化对象函数*/
car2.init();

var loadPageTools={
	 curNeedLoadPageArray:null,//当前需要加载的所有页
	 loadStartImgCallBack:null,//加载完成回调函数
	 isPreLoading:false,//是否初次预加载
	 
	 loadPagesArray:function(pagesArray,isPreLoading,callBack){
		 loadPageTools.curNeedLoadPageArray = pagesArray;
		 loadPageTools.isPreLoading = isPreLoading;
		 loadPageTools.loadStartImgCallBack = callBack;
		 //计算加载图片总数
		 loadPageTools.curLoadedImgCount = 0;
		 loadPageTools.curNeedLoadImgCount = 0;
		 for(var i=0;i<loadPageTools.curNeedLoadPageArray.length;i++){
			 var pageNode = loadPageTools.curNeedLoadPageArray[i];
			 var curImgNodes = pageNode.find('.uniImg');
			 loadPageTools.curNeedLoadImgCount += curImgNodes.length;
		 }
		 //开始加载
		 loadPageTools.startLoadPage();
	 },
	 /**
	  * 循环加载作品每一页
	  * 
	  */
	 startLoadPage:function(){
		 if(loadPageTools.curNeedLoadPageArray.length==0){
			 loadPageTools.loadStartImgCallBack.call();
			 return;
		 };
		 var curLoadPageNode = loadPageTools.curNeedLoadPageArray.shift();
		 loadPageTools.loadPageImg(curLoadPageNode,function(){
			 curLoadPageNode.attr("hasLoaded","true");
			 loadPageTools.startLoadPage();
		 });
	 },
	 
	 
	 curLoadedImgCount	:0,//当前页面已加载图片的个数
	 curNeedLoadImgCount:0,//当前页面需要加载图片的个数
	/**
	 * 开始加载某页的所有图片
	 * pageIndex:该页索引
	 * callBack:加载完成回调函数
	 */
	 loadPageImg:function(pageNode,callBack){
		 var curImgNodes = pageNode.find('.uniImg');
		 var curLoadedImgCount = 0;
		 var curImgLen = curImgNodes.length;
		 if(curImgLen==0){
			 callBack.call();
			 return;
		 }
		 curImgNodes.each(function(){
			 var dataSrc = $(this).attr("data-src");
			 
			 if(dataSrc==$(this).attr("src")){
				 curLoadedImgCount++;
				 loadPageTools.curLoadedImgCount++;
				 if(loadPageTools.isPreLoading){
					 var curW = (loadPageTools.curLoadedImgCount/loadPageTools.curNeedLoadImgCount)*100;
					 if(curW>0){
						 $(".expand").css("width",curW+"%");
						 setProgress(curW);
						 
					 }
				 }
				 if(curLoadedImgCount>=curImgLen){
					 callBack.call();
				 }
			 }else{
				 $(this).attr("src",dataSrc);
				 $(this).on("load",function(){
					 curLoadedImgCount++;
					 loadPageTools.curLoadedImgCount++;
					 if(loadPageTools.isPreLoading){
						 var curW = (loadPageTools.curLoadedImgCount/loadPageTools.curNeedLoadImgCount)*100;
						 if(curW>0){
							 $(".expand").css("width",curW+"%");
							 setProgress(curW);
						 }
					 }
					 if(curLoadedImgCount>=curImgLen){
						 callBack.call();
					 }
				 });
				 $(this).on("error",function(){
					 $(this).hide();
					 curLoadedImgCount++;
					 loadPageTools.curLoadedImgCount++;
					 if(loadPageTools.isPreLoading){
						 var curW = (loadPageTools.curLoadedImgCount/loadPageTools.curNeedLoadImgCount)*100;
						 if(curW>0){
							 $(".expand").css("width",curW+"%");
							 setProgress(curW);
						 }
					 }
					 if(curLoadedImgCount>=curImgLen){
						 callBack.call();
					 }
				 });
			 }
		 });
	 },
		 
};


