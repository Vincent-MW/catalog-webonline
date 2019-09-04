var car2 = {
/****************************************************************************************************/
/*  对象私有变量/函数返回值/通用处理函数
*****************************************************************************************************/	
/*************************
 *  = 对象变量，判断函数
 *************************/
	_events 		: {},									// 自定义事件---this._execEvent('scrollStart');
	_windowHeight	: $(window).height(),					// 设备屏幕高度
	_windowWidth 	: $(window).width(),

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
	// 微信初始化函数
	_WXinit			: function(callback){
						if(typeof window.WeixinJSBridge == 'undefined' || typeof window.WeixinJSBridge.invoke == 'undefined'){
							setTimeout(function(){
								this.WXinit(callback);
							},200);
						}else{
							callback();
						}
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
						$(window).on('touchmove.scroll',this._scrollControl);
						$(window).on('scroll.scroll',this._scrollControl);
					},
	//启动滚动条
	_scrollStart 	: function(){		
						//开启屏幕禁止
						$(window).off('touchmove.scroll');
						$(window).off('scroll.scroll');
					},
	//滚动条控制事件
	_scrollControl	: function(e){e.preventDefault();},

/**************************************************************************************************************/
/*  关联处理函数
***************************************************************************************************************/
	page_start:function(){
		
	},
	page_stop:function(){
		
	},
	//翻页
 	pageTurn:function(isNext){
 		if(isNext){
 			jQuery(".flipbook").turn("next");
 		}else{
 			jQuery(".flipbook").turn("previous");
 		}
	},
	pageTurnTo:function(turnPageID){
		var curIndex = jQuery(".flipbook").turn("page");
		
		var targetIndex = -1;
		for(var i=0;i<car2._page.length;i++){
			if(jQuery(car2._page[i]).attr("pageid")==turnPageID){
				targetIndex = i+1;
			}
		}
		for(var j=0;j<Math.abs(targetIndex-curIndex);j++){
			if(targetIndex>curIndex){//向后翻页
				jQuery(".flipbook").turn("next");
			}else{//向前翻页
				jQuery(".flipbook").turn("previous");
			}
		}
	},
	loadApp:function() {
		var height = $(window).height();
		var width = $(window).width();
		jQuery('.flipbook').turn({
				width:640,
				height:height,
				elevation: 50,
				display:'single',
				gradients: true,
				autoCenter: true
		}).bind("turned", function(event,page,view) {
      		car2.startEffect();
      		car2._pageNow = jQuery(".flipbook").turn("page")-1;
      		car2._handleEvent("success");
      		car2._handleEvent("turnEnd");
		});
		
		
		//隐藏过场图片
		$(".startImg").css("height","0px");
		// 模版提示隐藏
		$('.u-alert').remove();
		
		$('.translate-back').removeClass('translate-back-hide');
		$('.m-fengye').removeClass('f-hide');
		car2.height_auto(car2._page.eq(car2._pageNow),'false');
		//开启首页动画
		car2.startFirstPageEffect();
		//开始加载剩余的图片
		var lastPageArray = new Array();
		for(var i=car2._preLoadPageCount;i<car2._pageNum;i++){
			var curPage = car2._page.eq(i);
			lastPageArray.push(curPage);
		}
		car2._handleEvent("loadComplete");
		loadPageTools.loadPagesArray(lastPageArray,false,function(){
			
		});
		
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
	 loadPageTools.loadPagesArray(pageArray,true,callBack);
 },
 
 
	startEffect:function(){
 		var curr = jQuery(".p"+jQuery(".flipbook").turn("page"));
		//暂停所有非当前页动画
 		jQuery(".m-page").not(curr).each(function(){
 			car2.stopEffect(jQuery(this));
 		});
		//启动所有当前页动画
		curr.find(".animation").each(function(){
			//判断是否有控制该元素显示的元素
				var flag = $.fn.checkIsCanPlayEffect(this);
				if(flag){
					$.fn.playEffect(this);
				}
//			var curAnimationName = jQuery(this).attr("animationType");
//			jQuery(this).show();
//			var animationNamesArray = curAnimationName.split(" ");
//			var curEffectName = animationNamesArray.shift();
//			jQuery(this).addClass(curEffectName);
//			if($.fn.isInitNeedHide(curEffectName)){
// 				jQuery(this).css("opacity","0");
//			}else{
//				jQuery(this).css("opacity","1");
//			}
//			var curAnimationObj = jQuery(this);
//			jQuery(this).on('webkitAnimationEnd animationEnd',playNextEffect);
//			function playNextEffect(){
//				if(animationNamesArray.length>0){
//					curAnimationObj.removeClass(curEffectName);
//					curEffectName = animationNamesArray.shift();
//					curAnimationObj.addClass(curEffectName);
//					if($.fn.isInitNeedHide(curEffectName)){
//						curAnimationObj.css("opacity","0");
//					}else{
//						curAnimationObj.css("opacity","1");
//					}
//				}
//			}
		});
		if(car2._audioSysOff==false){//通过音乐开关关闭音乐，则翻页播放音乐事件失效
			car2.audio_play();
		}
 	},
	stopEffect:function(pageEle){
		pageEle.find(".animation").each(function(){
			$.fn.stopEffect(this);
//			var curAnimationName = jQuery(this).attr("animationType");
//			var animationNamesArray = curAnimationName.split(" ");
//			jQuery(this).off('webkitAnimationEnd animationEnd');
//			for(var i=0;i<animationNamesArray.length;i++){
//				jQuery(this).removeClass(animationNamesArray[i]);
//			}
//			if(animationNamesArray.length>0){
//	 			if($.fn.isInitNeedHide(animationNamesArray[0])){
//	 				jQuery(this).hide();
//	 			}
//			}
		});
	},
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
//		option.detail = str_data != '' ? eval('('+str_data+')') : '';
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
		
		if(options_audio.src!=null&&options_audio.src.length>5){
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
 		
 		var curPageEle = null;
 		try{
 			curPageEle = jQuery(".p"+jQuery(".flipbook").turn("page"));
 		}catch(e){
 			curPageEle = jQuery(".p1");
 		}
		//暂停所有非当前页动画
 		jQuery(".m-page").not(curPageEle).each(function(){
 			//停止当前页的所有音乐
 			jQuery(this).find("audio").each(function(){
 				this.pause();
 			});
 		});
 		if(curPageEle.children("audio").length>0){
	 		//启动当前页的背景音乐
	 		curPageEle.children("audio").each(function(){
	 			this.play();
	 		});
	 		if(car2._audio) car2._audio.pause();
		}else{
			if(car2._audio) car2._audio.play();
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
		if(typeof(Audio)!='undefined'){
			// 声音初始化
			car2.audio_init();
		}

        // 视频初始化
        car2.video_init();

		// 绑定音乐加载事件
		car2.audio_addEvent();

		// 音频切换
		car2.media_control();
		
		try{
			// 音符飘逸
			$('#coffee_flow').coffee({
				steams				: ["<div class='audio_widget_01'/>","<div class='audio_widget_02'/>"], 
				steamHeight			: 100,
				steamWidth			: 44 
			});
		}catch(e){
			console.info("加载音符错误");
		}
	},
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
			car2._audioNode.addClass('f-hide');
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
 	// 微信的分享提示
 	wxShare : function(){
 		$('body').on('click','.bigTxt-btn-wx',function(){
 			var img_wx = $(this).parent().find('.bigTxt-weixin');
 			
 			img_wx.addClass('z-show');
 			car2.page_stop();

 			img_wx.on('click',function(){
 				$(this).removeClass('z-show');
 				car2.page_start();

 				$(this).off('click');
 			})
 		})
 	}(),

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
		$('.lastPageLoading').css("opacity",0);
		$('.lastPageLoading').css("z-index",-100);
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
		if(initVote)initVote();
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
			 					if(car2._audio)car2._audio.play();
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
 			//car2.startFirstPageEffect();
 			return;
 		}else if(car2._maskIndex>0){//如果有蒙版且蒙版不为首页则播放音乐
 			if(car2._audio)	car2._audio.play();
 		}
 		if(car2._maskType!="0"){//如果有蒙版且蒙版为非涂抹蒙版则不加载涂抹蒙版
 			car2._audioNode.removeClass('f-hide');
 			$('.u-arrow').removeClass('f-hide');
 			car2.page_start();
 			//car2.startFirstPageEffect();
 			return;
 		}
		
		// 涂抹蒙板插件加载
		var node = $('#j-mengban')[0],
			canvas_url = $('#r-cover').val(),
			type = 'image',
			w = 640,
			h = $(window).height(),
			callback = car2.menban_callback;
		if(car2._maskIndex>0){
			//开启翻页
			car2.page_start();
			//car2.startFirstPageEffect();
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

		$('.p-ct').height($(window).height());
		$('.m-page').height($(window).height());
		$('#j-mengban').height($(window).height());
		$('.translate-back').height($(window).height());
		
		var ua = navigator.userAgent;
		var dw = 460;
		if (/Android (\d+\.\d+)/.test(ua)){
			dw = window.screen.width/window.devicePixelRatio;
		}else if(/iphone (\d+\.\d+)/.test(ua)){
			dw = window.screen.width;
		}else{
			dw = 460;
		}
		var scale = 460/dw;
		$(".opusInfo").css("-webkit-transform","scale("+scale+")");
	},
	initSpritePostion:function(){
		$(".item").each(function(){
			var curAnimationName = $(this).attr("animationType");
			if($.fn.isInitNeedHide(curAnimationName)){
				$(this).hide();
			}
			var endX = ($(this).attr("endX")*car2._imgScale-car2._paddingLeft);
			var endY = ($(this).attr("endY")-car2._paddingTop)*car2._imgScale;
			endX = Math.round(endX);
			endY = Math.round(endY);
			
			var originW = $(this).attr("originW");
			var originH = $(this).attr("originH");
			
			$(this).css("left",endX+"px");
			$(this).css("top",endY+"px");
			
			if(curAnimationName.indexOf("graduallyIn")==-1){
				$(this).css("width",Math.round(originW*car2._imgScale) +"px");
				$(this).css("height",Math.round(originH*car2._imgScale)+"px");
				
				$(this).find("img").each(function(){
					$(this).css("width",Math.round(originW*car2._imgScale) +"px");
					$(this).css("height",Math.round(originH*car2._imgScale)+"px");
				});
			}else{
				var oldTransform = $(this).css("transform")||$(this).css("-webkit-transform");
				if(typeof oldTransform !== 'undefined'&&oldTransform!=null&&oldTransform.length>0){
					oldTransform = oldTransform.replace(/scale\(*?\)/,"");
				}else{
					oldTransform = "";
				}
				oldTransform+=" scale("+car2._imgScale+")";
				$(this).css("transform",oldTransform);
				$(this).css("-webkit-transform",oldTransform);
				$(this).find("img").each(function(){
					$(this).css("width",Math.round(originW) +"px");
					$(this).css("height",Math.round(originH)+"px");
				});
				$(this).find(".vectorText").each(function(){
					$(this).css("width",Math.round(originW) +"px");
					$(this).css("height",Math.round(originH)+"px");
				});
			}
		});
	},
	initConPostion:function(){
		
		var imgWidth = $("#imgWidth").val();
		var imgHeight = $("#imgHeight").val();
		
		$(".page-con-img").each(function(){
			$(this).css("left",-car2._paddingLeft+"px");
			$(this).css("top",-car2._paddingTop+"px");
			$(this).css("width",Math.round(imgWidth*car2._imgScale) +"px");
			$(this).css("height",Math.round(imgHeight*car2._imgScale)+"px");
		});
		$(".swiper-con").each(function(){
			$(this).css("width","640px");
			$(this).css("height",car2._windowHeight+"px");
		});
		try{
			initSwiper();
		}catch(e){}
		$(".customForm").css("top",(400-car2._paddingTop)+"px");
		$(".arrow-left").css("top",car2._windowHeight/2+"px");
		$(".arrow-right").css("top",car2._windowHeight/2+"px");
	},
	// 对象初始化
	init : function(){
		// 样式，标签的渲染
		// 对象操作事件处理
		this.styleInit();
		car2.lightapp_intro();
		
		// 禁止滑动
		 this._scrollStop();

		$('input[type="hidden"]').appendTo($('body'));
		
		// 图片预先加载
		$('<img />').attr('src',$('#r-cover').val());
		$('<img />').attr('src',$('.m-fengye').find('.page-con').attr('data-src'));

		// loading执行一次
		var loading_time = new Date().getTime();
		
		$(window).on('load',function(){
			bindEvent();
			//获取图片因为设备宽高比不一样而造成的图片的遮挡距离
			var height = $(window).height();
			var imgWidth = $("#imgWidth").val();
			var imgHeight = $("#imgHeight").val();
			if(640/height<imgWidth/imgHeight){
				car2._paddingLeft = (imgWidth/imgHeight*height-640)/2;
				car2._imgScale = height/imgHeight;
			}else{
				car2._paddingTop = (640/imgWidth*imgHeight-height)/2;
				car2._imgScale = 640/imgWidth;
			}
			car2.initSpritePostion();
			car2.initConPostion();
			
			var now = new Date().getTime();
			var loading_end = false;
			var time;
			var time_del = now - loading_time;

			if ( time_del >= 500 ) {
				loading_end = true;
			}

			if ( loading_end ) {
				time = 0;
			} else {
				time = 500 - time_del;
			}

			car2._maskIndex = $("#r-cover-index").val();
			car2._maskType = $("#maskType").val();
			car2._linkUrl = $("#linkUrl").val();
			
			// loading完成后请求
			setTimeout(function(){
				//开始加载前几页图片
				car2.loadStartImg(car2._preLoadPageCount,function(){
					// 显示封面内容
					setTimeout(function(){
						var mskUrl = $('#r-cover').val();
						//显示蒙版
						if(car2._maskIndex==0&&mskUrl.length>1){
							// 显示正面
							$('#j-mengban').addClass('z-show');
							$('#j-mengban').removeClass('f-hide');
						}
						// media初始化
						car2.media_init();
						// 插件加载
						try{
							car2.plugin();
						}catch(e){}
						
						yepnope({
							test : Modernizr.csstransforms,
							yep: ['/youtuShare/pub/js/turn.js'],
							nope: ['/youtuShare/pub/js/turn.html4.min.js'],
							complete: car2.loadApp});
					},1000)
				});

				// 报名提交执行
				new uniForm().signUp_submit();
		        if(car2._pageNum<2){
					car2.page_stop();
					$('.u-arrow').addClass('f-hide');
					
				}
				var channel_id = location.search.substr(location.search.indexOf("channel=") + 8);
				channel_id= channel_id.match(/^\d+/) ; 
				if (!channel_id || isNaN(channel_id) || channel_id<0) {
				channel_id = 1;
				}
		 	 	var activity_id = $('#activity_id').val();
		 	 	var url = "/auto/analyse/"+activity_id + "?channel="+channel_id;
				 //报名统计请求
			 	//$.get(url,{},function(){});

			 	$('.p-ct').height($(window).height());
				$('.m-page').height($(window).height());
				$('#j-mengban').height($(window).height());
				$('.translate-back').height($(window).height());
			},time)
		})
	}
};
/*初始化对象函数*/
car2.init();