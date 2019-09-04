document.oncontextmenu=new Function('event.returnValue=false;');
document.onselectstart=new Function('event.returnValue=false;');
var xcx_close_audio=null;
var car2 = {
	_audioSysOff:false,
	
	_map 			: $('.ylmap'),							// 地图DOM对象
	_mapValue		: null,									// 地图打开时，存储最近打开的一个地图
	_mapIndex		: null,									// 开启地图的坐标位置
	_events			:[],											//绑定事件列表
	
	
	// 处理绑定事件
 	_handleEvent: function (type) {
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
	// 添加事件绑定
	_on: function (type, fn) {
			if ( !this._events[type] ) {
				this._events[type] = [];
			}
			this._events[type].push(fn);
	},
	
	audio_stop:function(){
		bgAudio.pause();
	},
	audio_play:function(){
		bgAudio.play();
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
//			car2.page_start();
//			car2._scrollStart();
			car2._map.removeClass("mapOpen");
//			car2._audioNode.removeClass('z-low');

			if(!car2._mapValue) car2._mapValue = true;

			function mapClose(){
				car2._map.removeClass('show');
				// 设置层级关系-z-index
//				car2._page.eq(car2._pageNow).css('z-index',9);
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
//			car2._isOwnEmpty(detal)	? detal=a:detal=detal;
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
};
(function(){
	
	var isMember = false;
	var limitCount = 0;
	function isMemberFun(){
		var shareID=$("#shareID").val();
		$.post("/uwp/newServlet?serviceName=ShareMag&medthodName=isMemberWithShareID",{shareID:shareID},function(data){
			if(data!=null){
				isMember = data.flag;
				limitCount = data.count;
			}
		},'json');
	}
	isMemberFun();
	//电子书数据信息
	var bookDatas = [];
	
	var isMobile = false;//是否移动端
	
	var isIOS = false;//是否是IOS系统
	
	var pageCount = $("#pageCount").val();//总页数
	var imgPath = $("#imgBasePath").val();
	var bookw = 1280;
	var bookh = 1010;
	
	var toolTipPic = $("#toolTipPic").val()||0;
	
	//作品单页的宽高
	var pageW = $("#pageWidth").val();
	var pageH = $("#pageHeight").val();
	
	var displayMode = 2;//显示模式， 1：单页 2:对页
	
	var window_w  = $(window).width();
	var window_h = $(window).height();
	
	var padding_left = 50;
	var padding_right = 50;
	
	var padding_top = 66;
	var padding_bottom = 18;
	
	var flipBookCon = "#flipbook";
	var bookCon = "#bookCon";
	
	var useGroup = "#Use-group";//使用说明
	var turnPageAudio = null;//背景音乐
	
	var bgAudio = null;//背景音乐
	
	var autoPlayInterval;//自动播放
	
	var mainCon = $("#main");
	
	var imgRandom = $("#imgRandom").val();
	
	var isShowBig = false;//当前是否是双击放大状态
	
	var isTurning = false;//是否正在翻页中
	
	var isPinching = false;//是否正在缩放
	
	var logo = $(".app-loading>.title").css("background-image");
	var dibiao = $("body>.app-loading>p").text();
	var image_W = 0;
	var isSearch = $("#isSearch").val();
	
	var curIsHardCover = false;
	
	var innerW = bookw/displayMode;//内页宽度（用于硬壳书）
	var innerH = bookh;//内页高度（用于硬壳书）
	var innerPaddingV = 0;//硬壳书的内页距离硬皮距离(上边距和下边距)
	var innerPaddingH = 0;//硬壳书的内页距离硬皮距离(左边距和又边距)
	
	var allPageOrigin = [];
	
	var coverHardDefaultColor = "#CACACA";//硬壳书背景色
	var coverHardSpineDefaultColor = "#767676";//硬壳书书脊背景色
	
	var turnPageDirection = true;//true:从右往左翻，false:从左往右翻
	
	//本地使用
	var virgule = "/";
	if(location.href.indexOf("file:///")>-1){
		virgule = "";
	}
	
	if($("#appResPath").val()){//导出本地预览使用，在线该值为空
		virgule = $("#appResPath").val();
	}
	
	var texturePath = virgule+"ebookImg/cover/";
	var textureExt = ".png";
	var pastedownUrl = virgule+"youtuShare/fb/img/pastedown.jpg";
	
	
	var liningPage = $("#textureLining").val();
	if(liningPage != "" && liningPage != "null" && typeof(liningPage) != "undefined"){
		pastedownUrl = texturePath+liningPage+textureExt;
	}
	var pdfPath = $("#pdfPath").val();
	
	var bottomBar_h = "-34px";
	var animateSpeed=300;
	var isAnimate = false;
	
	var contentScale = 1;
	var contentTop = 0;
	var contentLeft = 0;
	
	var hideBottomBar = function(){
		isAnimate = true;
		$("#pageCtl_mobile").removeClass("opacity_show");
		jQuery("#topBar_mobile").stop().animate({top:bottomBar_h},animateSpeed);
		jQuery("#bottomBar").stop().animate({bottom:bottomBar_h},animateSpeed);
		setTimeout(function(){
			isAnimate = false;
			$(mainCon).attr("isShowBottomBar","true");
		},animateSpeed+500);
	}
	var showBottomBar = function(){
		isAnimate = true;
		jQuery("#topBar_mobile").stop().animate({top:"0px"},animateSpeed);
		jQuery("#bottomBar").stop().animate({bottom:"0px"},animateSpeed);
		setTimeout(function(){
			isAnimate = false;
			$(mainCon).attr("isShowBottomBar","false");
		},animateSpeed+500);
	}
	
	var depthLeft = $("<div id='depth_left' class='depth'><div class='depth-img'></div></div>");
	var depthRight = $("<div id='depth_right' class='depth'><div class='depth-img'></div></div>");
	
	var coverInnerShadow = ["<div class=\"hard_cover_shadow\">",
				                   		"<div class=\"hard_left_border\"></div>",
				                   		"<div class=\"hard_top_border\"></div>",
				                   		"<div class=\"hard_bottom_border\"></div>",
				                   		"<div class=\"hard_right_border\"></div>",
				                   	"</div>"];
	
	var coverShadow = ["<div class=\"hard_cover_shadow\">",
	                   "<div class=\"hard_left_border_cover\"></div>",
	                   "<div class=\"hard_top_border\"></div>",
	                   "<div class=\"hard_bottom_border\"></div>",
	                   "<div class=\"hard_right_border_cover\"></div>",
	                   "<div class=\"hard_flod\"></div>",
	                   "</div>"];
	
	
	try{
		var imagePath = logo.replace("url(","").replace(")","").replace("\"","").replace("\"","").replace("'","").replace("'","");
		var image = new Image();
		image.src = imagePath;
		image.onload = function(){
			image_W = image.width*32/image.height;
		}
	}catch (e) {
		// TODO: handle exception
	}

	
	/**
	 * 解决IOS不能js控制播放音乐的问题
	 * @param callBack
	 */
	var getWXPlay = function(callBack) {
		if(typeof WeixinJSBridge === 'undefined'){
			if(RegExp("MicroMessenger","i").test(navigator.userAgent)){
				document.addEventListener("WeixinJSBridgeReady", function(){
					callBack && callBack();
				});
			}else{
				callBack && callBack();
			}
		}else{
			WeixinJSBridge.invoke("getNetworkType", {},function() {
		    	callBack && callBack();
		    });
		}
	}
	//记录播放翻页音效的时间
	var playTurnPageTime = 0;
	/**
	 * 播放翻页音效
	 */
	var playTurnPageAudio = function(){
		if(new Date().getTime()-playTurnPageTime<100){//处理播放音效间隔过短，带来的异常问题
			return;
		}
		playTurnPageTime = new Date().getTime();
		var close = $("#closeTurnMusic").val();
		if(close != "N"){
			if(turnPageAudio==null){
				turnPageAudio = new Audio();
				turnPageAudio.src = virgule+"youtuShare/fb/img/flipsound.MP3";
			}else{
				turnPageAudio.pause();
			}
			getWXPlay(function(){
					turnPageAudio.load();
					turnPageAudio.play();
			});
		}
	}
	
	/**
	 * 计算组件尺寸
	 */
	var mesureSize = function(){
		window_w  = $(window).width();
		window_h = $(window).height();
		displayMode = ((!isMobile&&curIsHardCover)||window_w>window_h)?2:1;
		var needDepth = displayMode == 2;
		if(isMobile){
			padding_bottom = padding_top = 0;
			padding_left = padding_right = needDepth?20:0; 
			window_h = window_h;
			$(mainCon).on("click",".clickContrlArea",function(){
				if(!isAnimate){
					var isShowBottomBar = $(mainCon).attr("isShowBottomBar");
					if(isShowBottomBar=="true"){
						showBottomBar();
					}else{
						hideBottomBar();
					}
				}
			})
			$(mainCon).on("click","#bookCon",function(){
				if(!isAnimate){
					var isShowBottomBar = $(mainCon).attr("isShowBottomBar");
					if(isShowBottomBar=="true"){
						showBottomBar();
					}else{
						hideBottomBar();
					}
				}
			})
		}
		var viewW = window_w-padding_left - padding_right;
		var viewH = window_h - padding_top - padding_bottom;
		
		var con_padding_h = 0;
		var con_padding_v = 0;
		
		if(viewW/viewH>pageW*displayMode/pageH){
			bookh = viewH;
			bookw = bookh*(pageW*displayMode/pageH);
			con_padding_h = (viewW-bookw)/2;
		}else{
			bookw = viewW;
			bookh = bookw/(pageW*displayMode/pageH);
			con_padding_v = (viewH-bookh)/2;
		}
		
		var top = (padding_top+con_padding_v);
		var left = (padding_left+con_padding_h);
		var bottom = (padding_bottom+con_padding_v+(isMobile?((window_w/window_h>1)?0:30):0));
		var right = (padding_left+con_padding_h);
		$(bookCon).css({position:"absolute",top:top,left:left,bottom:bottom,right:right,padding:"0"});
		
		//页数depth
		if(!curIsHardCover){
			$("#depth_left").css({top:top,bottom:bottom,left:left-20});
			$("#depth_right").css({top:top,bottom:bottom,right:right-20});
		}
		//H5页面缩放
		contentScale = bookh/pageH;
		
		//纠正缩放后对页之间出现空隙的问题
		var needW = Math.ceil(pageW*contentScale);
		contentScale = needW/pageW;
		
		car2._handleEvent("mainConResize",contentScale);
//		if(displayMode=="1"){
//			contentScale = bookw/pageW;
//			contentLeft = pageW*(contentScale-1)/2;
//			contentTop = pageH*(contentScale-1)/2;
//		}else{
//			contentScale = bookh/pageH;
//			contentLeft = pageW*(contentScale-1)/2;
//			contentTop = pageH*(contentScale-1)/2;
//		}
		
		if(curIsHardCover){
			innerW = Math.round(bookw/displayMode);
			innerH = Math.round(bookh);
			
			innerPaddingV  = Math.round(innerH*0.02);
			innerPaddingV = Math.max(10,innerPaddingV);
			innerH -= innerPaddingV*2;
			innerW = Math.round(innerW/bookh*innerH);
			innerPaddingH = Math.round(bookw/displayMode-innerW);
		}
	}
	var strFn = function(a,b){
		var c = "";
		if(a != '' && a != "null" && typeof(a) != "undefined"){
			c = b.replace("{urlIndex}",a);
		}
		return c;
	}
	var initData = function(){
		var con = jQuery(flipBookCon);
		var count = bookDatas.length;
		
		var pageclass = "",
		textureCoverVal = $("#textureCover").val(),
		textureInnerPageVal = $("#textureInnerPage").val(),
		textureOpacityVal = $("#textureOpacity").val(),
		texture = "<div class='texture' style='background-image:url("+texturePath+"{urlIndex}"+textureExt+");{opacity}'></div>",
		textureCover = "",
		textureInnerPage="";
		if(typeof(textureInnerPageVal)!="undefined" && textureInnerPageVal.indexOf("&")>-1){
			textureInnerPageVal = $("#textureInnerPage").val().split("&")[0];
			textureOpacityVal = parseInt($("#textureInnerPage").val().split("&")[1])/100.00;
		}
		if(textureOpacityVal != '' && typeof(textureOpacityVal) != "undefined"){
			texture = texture.replace("{opacity}","opacity:"+textureOpacityVal+";")
		}else{
			texture = texture.replace("{opacity}","");
		}
		textureCover = strFn(textureCoverVal,texture);
		textureInnerPage = strFn(textureInnerPageVal,texture);
		
		for(var i=0;i<count;i++){
			var pageObj = bookDatas[i];
			var pageWidget = "";
			var otherAttrs = "";
			if(curIsHardCover){//show hard cover
				if(i==0){//封面
					pageclass = "hard front";
					pageWidget = coverShadow.join("")+"<div class='side'></div>"+textureCover;
					otherAttrs = " depth='5'";
				}else if(i==1){//封2
					pageclass = "front-inner hard textureLining";
					if(displayMode=="2"){
						pageWidget = coverInnerShadow.join("");
					}
					otherAttrs = " depth='5'";
				}else if(i==count-2){//封3
					pageclass = "back-inner fixed hard textureLining";
					if(displayMode=="2"){
						pageWidget = coverInnerShadow.join("");
					}
					otherAttrs = " depth='5'";
				}else if(i==count-1){//封底
					pageclass = "hard back";
					pageWidget = coverShadow.join("")+" <div class='side'></div>"+textureCover;
					otherAttrs = " depth='5'";
				}else{//内页
					pageclass = "own-size";
					if(i==2||i==count-3){
						pageclass += " textureLining";
					}else{
						pageWidget += textureInnerPage;
					}
				}
			}
			var page = pageObj.pageData;
//			var page = $("<div "+otherAttrs+" class='"+pageclass+"'>"+pageWidget+"<div class='pageBg' data-img='"+pageObj.bgImg+"'><div class='loading'></div></div></div>");
//			if(i==0){//封面
//				if((isMobile||displayMode==1)&&toolTipPic!="0"&&toolTipPic!="-1"){
//					page.append("<div class='turn-page-tip'></div>");
//				}
//				page.find(".hard_cover_shadow").css("z-index",1)
//			}else	if(i<count-1){//内页
//				if(curIsHardCover&&(i==1||i==2||i==count-3||i==count-2)){
//					page.find(".pageBg").css("background-image","url("+pastedownUrl+")");
//				}
//				if(curIsHardCover&&(page.hasClass("front-inner")||page.hasClass("back-inner"))){//硬壳装封2封3
//					page.find(".hard_right_border").css("background-color",bookConfig.hardCover.spineColor||coverHardSpineDefaultColor);
//					page.css("background-color",bookConfig.hardCover.innerColor||coverHardDefaultColor);
//					if(page.hasClass("front-inner")){//封2
//						page.find(".pageBg").css({right:0});
//						page.append(depthLeft);
//					}else{//封3
//						page.append(depthRight);
//						page.find(".hard_cover_shadow").addClass("flip_x");//左右翻转
//						depthRight.css({right:0});
//					}
//				}else{
//					page.append("<div class='"+(i%2==0?"odd-shadow":"even-shadow")+"'></div>");
//				}
//			}else if(i==count-1){//封底
//				page.find(".hard_cover_shadow").css("z-index",1).addClass("flip_x");
//			}
			con.append(page);
			allPageOrigin.push(page);
		}
		resizeHardCoverInnerPageSize();
		$(".imgBox").attr("paginationScale",1/contentScale*0.6);
		car2._handleEvent("loadComplete");//初始化幻灯片
		$(".fluxslider").css("pointer-events","all");
		var allPage = con.children("div");
		for(var i=0,len=allPage.length;i<len;i++){
			if(i!=0&&i!=len-1){
				$(allPage[i]).append("<div class='"+(i%2==0?"odd-shadow":"even-shadow")+"'></div>");
			}
		}
		//每个元素图片都固定死宽高，解决渐入动画的问题
		$(".item>.uniImg").each(function(){
			var parent = $(this).parent();
			var itemW = parent.attr("originw");
			var itemH = parent.attr("originh");
			$(this).css({width:itemW+"px",height:itemH+"px"});
		});
		
		initBook();
	}
	//更新
	var updateDepth = function(curPage){
			var leftW = 20;
			var rightW = 20;
			
			//计算最大宽度
			var maxW = Math.min(Math.floor(pageCount/2),6); 
			
			leftW = rightW = maxW;
			if(curPage==1){//封面
				leftW = rightW = 0;
			}else	if(curPage<=3){
				leftW  = 0;
			}else if(curPage<maxW){
				leftW = curPage-2;
			}
			if(curPage==pageCount){//封底
				leftW = rightW = 0;
			}else	if(curPage>pageCount-2){
				rightW = 0;
			}else if(curPage>pageCount-maxW){
				rightW = pageCount-curPage-2;
			}
			$("#depth_left .depth-img").css({width:leftW});
			$("#depth_right .depth-img").css({width:rightW});
	}
	var initBook = function(){
		updateDepth(1);
		jQuery(flipBookCon).turn({
			width:bookw,
			height:bookh,
			elevation: 50,
			duration: 1000,
			display:(displayMode==1?"single":"double"),
			gradients: true,
			autoCenter: true,
			acceleration:true,
			when:{
				turning:function(e,page,view){
					$(".turn-page-tip").remove();
					isTurning = true;
					playTurnPageAudio();
					updateDepth(page);
					var book = jQuery(this),
					currentPage = book.turn('page'),
					pages = book.turn('pages');
					stopAnimation(page);
					if(turnPageDirection){
						stopAnimation(page+1);
						stopAnimation(page+2);
					}else{
						stopAnimation(page-1);
						stopAnimation(page-2);
					}
					if (page>=2){
						jQuery(flipBookCon+' .front-inner').addClass('fixed');
					}else{
						jQuery(flipBookCon+' .front-inner').removeClass('fixed');
					}
					if (page<book.turn('pages'))
						jQuery(flipBookCon+' .back-inner').addClass('fixed');
					else
						jQuery(flipBookCon+' .back-inner').removeClass('fixed');
					
					///////解决硬壳书的从中间页面直接翻页到封面封底的显示问题 start////////////
					if(curIsHardCover){
						if (currentPage>3 && currentPage<pages&&page==1) {//从非2，3页翻页到封面
							book.turn('page', 2).turn('stop').turn('page', page);
							e.preventDefault();
							return;
						}else if(currentPage>1&&currentPage<pages-2&&page==pages){//从非倒数2，3页翻页到封底
							book.turn('page', pages-1).turn('stop').turn('page', page);
							e.preventDefault();
							return;
						}else if(currentPage==1 && page>3&&page<pages){//从封面翻页到内页
							book.turn('page', 2).turn('stop').turn('page', page);
							e.preventDefault();
							return;
						}else if(currentPage==pages && page>0 && page< pages-2){//从封底翻页到内页
							book.turn('page', pages-1).turn('stop').turn('page', page);
							e.preventDefault();
							return;
						}
					}
					///////解决硬壳书的从中间页面直接翻页到封面封底的显示问题 end////////////
				},
				turned:function(e,page,view){
//					loadImg();
					isTurning = false;
					startAnimation(page);
					if(displayMode==2){
						if(page>1){
							jQuery("#depth_right").fadeIn();
						}
						if(turnPageDirection){
							startAnimation(page+1);
//							startAnimation(page+2);
						}else{
							startAnimation(page-1);
//							startAnimation(page-2);
						}
						if(page<pageCount){
							jQuery("#depth_left").fadeIn();
						}
					}
					//为当前显示的页面添加动作监听
					bindShowPageEvent();
				},
				start:function(event, pageObject, corner){
					if(corner!=null){
						turnPageDirection = (corner=="tr" || corner=="br" || corner == "r");
					}
					if(displayMode==2){
						var curPage = pageObject.page;
						var nextPage = pageObject.next;
						if(curPage==1){
							$("#depth_right").hide();
						}
						if(curPage==pageCount){
							$("#depth_left").hide();
						}
					}
				},
			}
		});
		updateSingleDoubleView();
		var i =1;
	 	var interval = setInterval(function(){
	 		$(".app-loading>.loading>span").css("width",i+"%");
	 		i += 1;
	 		if(i>100){
	 			clearInterval(interval);
	 			mainCon.show();
	 			jQuery('#bookCon').fadeIn();
				$(".app-loading").remove();
				$("body").css("background",$("body").attr("data-img"));
				$(".inputPSWWin").removeClass("f-hide");
				$(".inputPSWWin").addClass("z-show");
				swiper();
				var contactUs = $(".contactUs");
				if(!isMobile && contactUs.length>0){
					var contactUs_w = contactUs.width();
					$(".search-group").css("right",(contactUs_w+26)+"px")
				}
				setTimeout(function(){
					hideBottomBar();
				},3000);
	 		}
	 	},30);
		initTextClickShow();
		addZoomHandler();
	}
	/**
	 * 绑定当前页面事件
	 * 绑定触发，当前页绑定，其他页取消（因为turn.js动态加载页面的特性，防止多次绑定）
	 */
	var bindShowPageEvent = function(){
		/////////////////////////触发////////////////
		//取消所有的绑定
		$(".uniAction").off("click");
		$(".videoBtnFlash").off("click");
		
		var curPageEleArray = [];
		//当前显示页面
		$.each(jQuery(flipBookCon).turn("view"),function(){
			//当前页
			var curPageIndex = this;
			//添加当前页的绑定
			var curPageEle =  jQuery(flipBookCon).find(".page-wrapper[page="+curPageIndex+"]");
			bindPageEvent(curPageEle);
			curPageEleArray.push(curPageEle);
		});
		car2._handleEvent("turnEnd",curPageEleArray);//为了幻灯片重新加载
	}
	
	var bindPageEvent = function(curPageEle){
		/////////////////////////触发////////////////
		curPageEle.find(".uniAction").each(function(){
			$(this).addTriggerEventListener();
		});
		/////////////////////////播放本地视频////////////
		curPageEle.find(".videoBtnFlash").on("click",function(e){
			$(this).parent().find("video").each(function(e){
				this.play();
			});
		});
		curPageEle.find("video").each(function(){
			this.addEventListener("playing",function(){
				$(this).parent().find(".videoBtnFlash").remove();
				$(this).parent().find(".uniImg").remove();
			});
		});
	}
	
	//加载图片
	var loadImg = function(){
		var curPage = jQuery(flipBookCon).turn("page");
		loadPageImg(curPage-3);
		loadPageImg(curPage-2);
		loadPageImg(curPage-1);
		loadPageImg(curPage);
		loadPageImg(curPage+1);
		loadPageImg(curPage+2);
		loadPageImg(curPage+3);
	}
	var pageBgAttr = $("#pageBgAttr").val();
	var bg_size = "";
	var bgPosition_x_l = "";//左页水平偏移量
	var bgPosition_x_r = "";//右页水平偏移量
	var bgPosition_y = "";
	try{
		bg_size = pageBgAttr.split("&")[0];
		bgPosition_x_l = pageBgAttr.split("&")[1];
		bgPosition_x_r = pageBgAttr.split("&")[2];
		bgPosition_y = pageBgAttr.split("&")[3];
	}catch (e) {
		// TODO: handle exception
	}
	var loadPageImg = function(pageIndex){
		var curPageBg =  jQuery(flipBookCon).find(".page-wrapper[page="+pageIndex+"]").find(".pageBg");
		if(curPageBg.find(".loading").length>0&&!curPageBg.data("imgloading")){
			var img = document.createElement("img");
			if(!curPageBg.data("img")){
				curPageBg.find(".loading").remove();
				curPageBg.css("background-color","#FFFFFF");
				return;
			}
			img.src = curPageBg.data("img");
			curPageBg.data("imgloading",true);
			img.addEventListener("load",function(){
				var imgWidth = img.width;
				var imgHeight = img.height;
				curPageBg.append($(img));
				curPageBg.find(".loading").remove();
				if(isIOS&&imgWidth>0&&imgHeight>0){//解决IOS系统放大图片变虚的问题
					var imgScale = Math.max(1,imgHeight/bookh);
					imgScale = Math.min(imgScale,3);
					curPageBg.css({width:imgScale*100+"%",height:imgScale*100+"%","transform-origin":"0 0","transform":"scale3d("+1/imgScale+","+1/imgScale+",1)"});
				}
				if(pageBgAttr !="" && typeof(pageBgAttr) != "undefined"){
					curPageBg.css({"position":"absolute","overflow":"hidden"});
					$(img).css({"width":bg_size,"height":bg_size,"position":"absolute","top":bgPosition_y});
					if(pageIndex%2==0){//左页
						$(img).css("left",bgPosition_x_l)
					}else{
						$(img).css("left",bgPosition_x_r)
					}
				}
			});
			img.addEventListener("error",function(){
				curPageBg.data("imgloading",false);
			});
		}
	}
	//还原
	var resetZoomBookCon = function(){
		var transformCon = jQuery(flipBookCon)[0];
		jQuery(flipBookCon).addClass("animated");//添加回动画的缓动
		transformCon.originX = transformCon.originY = 0;
		transformCon.scaleX = transformCon.scaleY = 1;
		transformCon.translateX = transformCon.translateY = 0;
		
		
		jQuery(flipBookCon).turn("disable",false);
		removeMoveHandler();
		setTimeout(function(){
			if(displayMode==2){
				$("#depth_right,#depth_left").show();
			}
			isShowBig = false;
			jQuery(flipBookCon).css({"transform-origin":"","-webkit-transform-origin":""});
		},300);
	}
	
	var hammer = null;
	//添加缩放监听
	var addZoomHandler = function(){
		var transformCon = jQuery(flipBookCon)[0];
		hammer = new Hammer.Manager(transformCon);
		if(typeof transformCon.scaleX === "undefined"){
			Transform(transformCon);
			transformCon.perspective = 0;
		}
		hammer.add(new Hammer.Tap({event: 'doubletap', taps: 2 }));//双击
		hammer.add(new Hammer.Pan({threshold:0,pointers:0}));//拖动
//		hammer.add(new Hammer.Tap({event: 'singletap'}));//单击
		hammer.add(new Hammer.Swipe({velocity:0.1})).recognizeWith([hammer.get('pan')]);//滑动
		//缩放
//		hammer.add(new Hammer.Pinch({ threshold: 0})).recognizeWith([hammer.get('pan'),hammer.get('singletap')]);
		hammer.add(new Hammer.Pinch({ threshold: 0})).recognizeWith([hammer.get('pan')]);

//	    hammer.get('doubletap').recognizeWith('singletap');
//	    hammer.get('singletap').requireFailure(['doubletap','pinch']);
		
	    hammer.on("swipeleft",function(ev){
	    	if(!isShowBig){
		    	jQuery(flipBookCon).turn("next");
	    	}
	    });
	    hammer.on("swiperight",function(ev){
	    	if(!isShowBig){
	    		jQuery(flipBookCon).turn("previous");
	    	}
	    });
	    
	  //鼠标滚动事件
	    var increment = 0.03;
		jQuery(mainCon).bind("mousewheel",function(e){
			var isUp = e.originalEvent.wheelDelta<0;
			if(isUp){//向下滚动
				//下一页
				if(!isShowBig){
					turnPageDirection = true;
			    	jQuery(flipBookCon).turn("next");
		    	}else{
		    		//页面缩小
		    		if(transformCon.scaleX<=1+increment){
		    			resetZoomBookCon();
		    		}else{
		    			transformCon.scaleX -= increment;
		    			transformCon.scaleY -= increment;
		    		}
		    	}
			}else {//向上滚动
				turnPageDirection = false;
				//上一页
				if(!isShowBig){
		    		jQuery(flipBookCon).turn("previous");
		    	}else{
		    		//页面放大
		    		transformCon.scaleX += increment;
		    		transformCon.scaleY += increment;
		    	}
			}
		});
		
	    hammer.on("pinchstart pinchmove", function(ev){
	    	isPinching = true;
	    	if(ev.type == 'pinchstart') {
				//禁止翻页
				jQuery(flipBookCon).turn("disable",true);
				//隐藏书的厚度
				$("#depth_right,#depth_left").hide();
				
				jQuery(flipBookCon).data("baseScale",transformCon.scaleX);
				
				//旧的transformOrigin
				var oldTransformOrigin = transformCon.style.transformOrigin||transformCon.style.webkitTransformOrigin;
				
				
				//计算缩放中心点
				var centerX = ev.center.x;
				var centerY = ev.center.y;
				
				
				centerX =centerX - jQuery(flipBookCon).offset().left;
				centerY =centerY - jQuery(flipBookCon).offset().top;
				
				centerX/=transformCon.scaleX;
				centerY/=transformCon.scaleY;
				var percentCenter = centerX+"px "+centerY+"px";
				
				jQuery(flipBookCon).css({"transform-origin":percentCenter,"-webkit-transform-origin":percentCenter});
				
				jQuery(flipBookCon).removeClass("animated");//添加回动画的缓动
				
				if(oldTransformOrigin){
					var oldCenterStr = oldTransformOrigin.replace(/px/ig,"") .split(" ");
					var oldCenterX = oldCenterStr[0];
					var oldCenterY = oldCenterStr[1];
					
					try{
						transformCon.translateX = (transformCon.translateX||0)- (centerX-oldCenterX)*(1-transformCon.scaleX||1);
						transformCon.translateY = (transformCon.translateY||0) - (centerY-oldCenterY)*(1-transformCon.scaleY||1);
					}catch(e){
						alert("缩放错误"+e.msg);
					}
				}
			}else{
				transformCon.scaleX = transformCon.scaleY = jQuery(flipBookCon).data("baseScale")*ev.scale;
				if(transformCon.scaleX!=1){
					addMoveHandler();
					isShowBig = true;
				}
			}
	    });
	    hammer.on("pinchend", function(event){
	    	isPinching = false;
	    	jQuery(flipBookCon).addClass("animated");//添加回动画的缓动
	    	if(transformCon.scaleX<1){
	    		resetZoomBookCon();
	    	}else if(transformCon.scaleX>5){
	    		transformCon.scaleX = transformCon.scaleY = 5;
	    	}
	    });
	    
		hammer.on("doubletap",function(event){
			if(isTurning)return;
			if(transformCon.scaleX==1){
				//点击位置置入屏幕中心
				var clickX = event.clientX||(event.pointers&&event.pointers[0]&&event.pointers[0].clientX)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientX);
				var clickY = event.clientY||(event.pointers&&event.pointers[0]&&event.pointers[0].clientY)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientY);
//				
				clickX -=jQuery(flipBookCon).offset().left;
				clickY -=jQuery(flipBookCon).offset().top;
				
				clickX/=transformCon.scaleX;
				clickY/=transformCon.scaleY;
				
				var percentCenter = clickX+"px "+clickY+"px";
				jQuery(flipBookCon).css({"transform-origin":percentCenter,"-webkit-transform-origin":percentCenter});
				
				//放大
				transformCon.scaleX = transformCon.scaleY = 3;
				//禁止翻页
				jQuery(flipBookCon).turn("disable",true);
				//隐藏书的厚度
				$("#depth_right,#depth_left").hide();
				
				addMoveHandler();
				isShowBig = true;
			}else{
				resetZoomBookCon();
			}
		});
		hammer.on("singletap",function(event){
			if(isTurning)return;
			if(isShowBig){
				resetZoomBookCon();
				return;
			}
			var scale = bookh/pageH;
			
			var currentTarget = $(event.target).closest(".page-wrapper");
			var textAreas = bookDatas[$(currentTarget).attr("page")-1]&&bookDatas[$(currentTarget).attr("page")-1].items;
			if(typeof textAreas === 'undefined')return;
			var clickX = event.clientX||(event.pointers&&event.pointers[0]&&event.pointers[0].clientX)||(event.changedPointers&&event.changedPointers[0]&&event.changedPointers[0].clientX)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientX);
			var clickY = event.clientY||(event.pointers&&event.pointers[0]&&event.pointers[0].clientY)||(event.changedPointers&&event.changedPointers[0]&&event.changedPointers[0].clientY)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientY);
			clickX -= currentTarget.offset().left;
			clickY -= currentTarget.offset().top;
			
			clickX = clickX/scale;
			clickY = clickY/scale;
			
			//是否点击了文字
			for(var i=textAreas.length-1;i>=0;i--){
				var textArea = textAreas[i];
				var textAreaX = parseFloat(textArea.x);
				var textAreaY = parseFloat(textArea.y);
				var textAreaW = parseFloat(textArea.width);
				var textAreaH = parseFloat(textArea.height);
				var textAreaR = parseFloat(textArea.r);
				if(pointInInRect(clickX,clickY,textAreaX,textAreaY,textAreaW,textAreaH,textAreaR)){
					if(textArea.specialEffectType=="clickTurnPage"){
						var turnPageID = parseInt(textArea.linkValue);
						var pageIndex = getPageIndexByID(turnPageID);
						jQuery(flipBookCon).turn("page",pageIndex);
					}else if(textArea.specialEffectType=="web"){
						//跳转外链
						window.open(textArea.linkValue);
					}else{
						event.stopPropagation&&event.stopPropagation();
						var showtext = $("#showText").val();
						if (showtext =="Y") {
							showTextDialog(textArea.textContent);
						}
					}
					break;
				}
			}
		});
	}
	if(typeof car2 !=='undefined'){
		//翻到指定页面ID
		car2.pageTurnTo = function(turnPageID){
			var pageIndex = getPageIndexByID(turnPageID);
			jQuery(flipBookCon).turn("page",pageIndex);
		}
	}
	
	//添加移动监听
	var addMoveHandler = function(){
		var ele = jQuery(flipBookCon)[0];
		removeMoveHandler();
		hammer.on("panstart",function(ev){
			jQuery(flipBookCon).removeClass("animated");//移出动画的缓动
			ele.START_X = ele.translateX;
			ele.START_Y = ele.translateY;
		});
		hammer.on("panmove", function(ev){//拖动
			if(ev.pointers&&ev.pointers.length==1){
				ele.translateX=ele.START_X+ev.deltaX;
				ele.translateY=ele.START_Y+ev.deltaY;
			}
		});
	}
	//移出移动监听
	var removeMoveHandler = function(){
		hammer.off("panstart panmove panend");
	}
	var initTextClickShow = function(){
		var textDialog = $("#showTextDialog");
		if(textDialog.length==0){
			textDialog = $("<div id='showTextDialog'></div>").appendTo($("body")).click(function(){
				jQuery(flipBookCon).turn("disable",false);
				disableScroll();
				$(this).removeClass("dialog-show");
			});
		}
	}
	var pointInInRect = function(x,y,textAreaX,textAreaY,textAreaW,textAreaH,textAreaR){
		var clickPoint = getRotationPoint(x,y,textAreaX+textAreaW/2,textAreaY+textAreaH/2,textAreaR);
		return clickPoint.x>textAreaX&&clickPoint.x<textAreaX+textAreaW&&clickPoint.y>textAreaY&&clickPoint.y<textAreaY+textAreaH;
	}
	/**获取一个点围绕另一个点旋转度数后的坐标*/
	var getRotationPoint = function(x,y,ox,oy,r){
		var point = {};
		point.x = (x - ox)*Math.cos(r/180*Math.PI) + (y - oy)*Math.sin(r/180*Math.PI) + ox;
		point.y =- (x - ox)*Math.sin(r/180*Math.PI) + (y - oy)*Math.cos(r/180*Math.PI) + oy;
		return point;
	}
	
	var showTextDialog = function(txt){
		var textDialog = $("#showTextDialog");
		textDialog.html(txt);
		textDialog.addClass("dialog-show");
		enableScroll();
		jQuery(flipBookCon).turn("disable",true);
	}
	
	//绑定事件
	var bindEvent = function(){
		$(window).bind("resize",function(){
			mesureSize();
			//如果是硬壳书，需要手动重置内页大小
			resizeHardCoverInnerPageSize();
			
//			setTimeout(function(){
				jQuery(flipBookCon).turn("size",bookw,bookh);//重置书的大小
//			},100);
			jQuery(flipBookCon).turn("display",(displayMode==1?"single":"double"));
			updateSingleDoubleView();
			resetZoomBookCon();
		});
		
		/*if (isIOS) {
			mainCon.append($("<div id=\"Demo\"><div class='an_de'>请按<img class='iosSC' src='/youtuShare/pub/img/iosSC.png'></i>然后点选添加到主屏幕</div><i class='icon_dow'></i></div>"));
			$(mainCon).click(function(){
			    $("#Demo").hide();
			});
		
		}*/
		//alert(navigator.userAgent)
		var nua = navigator.userAgent; 
	    if(nua.indexOf("Safari")>-1&&/.*?(iphone|ipad).*?/gi.test(nua)) {   
	    	mainCon.append($("<div id=\"Demo\"><div class='an_de'>请按<img class='iosSC' src='"+virgule+"youtuShare/pub/img/iosSC.png'></i>然后点选添加到主屏幕</div><i class='icon_dow'></i></div>"));
			$(mainCon).click(function(){
			    $("#Demo").hide();
			});
			setTimeout(function(){
			$('#Demo').hide();
			},6000);

	    }    
		     
		disableScroll();
	}
	
	//设置硬壳书的内页的大小
	var resizeHardCoverInnerPageSize = function(){
		if(curIsHardCover){
			$.each(allPageOrigin,function(){
				if(this.hasClass("own-size")){//内页
					this.css({width:innerW,height:innerH});
				}
				if(this.hasClass("front-inner")||this.hasClass("back-inner")){//封2，封3
					this.find(".pageBg").css({positon:"absolute",width:innerW,height:innerH,top:innerPaddingV+"px"});
					this.find(".depth").css({width:innerPaddingH+"px",top:innerPaddingV+"px",bottom:innerPaddingV+"px"});
//					if(this.hasClass("front-inner")){
//					}else{
//					}
				}else if(this.hasClass("back")){//封底
					if(displayMode==2){
						this.find(".hard_cover_shadow .hard_flod").show();
					}else{
						this.find(".hard_flod").hide();
					}
					//封面厚度
					this.find(".side").css({height:bookh+"px",left:"0px"});
				}else if(this.hasClass("front")){//封面
					//封面厚度
					this.find(".side").css({height:bookh+"px",left:bookw*0.5-5+"px"});
				}
			});
		}
		$.each(allPageOrigin,function(){
			var page = $(this).find(".m-page");
			page.css({"transform":"scale("+contentScale+")"});
//			page.find("font").each(function(){
//				var fontSize = parseFloat($(this).css("font-size").replace("px",""))*contentScale;
//				$(this).css("font-size",fontSize+"px");
//			})
		});
	}
	
	var disableScroll = function(){
		$(window).on('touchmove.scroll',_scrollControl);
		$(window).on('scroll.scroll',_scrollControl);
	}
	var enableScroll = function(){
		$(window).off('touchmove.scroll');
		$(window).off('scroll.scroll');
	}
	
	var _scrollControl = function(e){
		e.preventDefault();
	}
	var updateSingleDoubleView = function(){
		if(displayMode==1){
			jQuery(flipBookCon).removeClass("double").addClass("single");
			$(".depth").hide();
			$("#depth_left,#depth_right").hide();
		}else{
			jQuery(flipBookCon).addClass("double").removeClass("single");
			$(".depth").show();
			$("#depth_left,#depth_right").show();
//			var curPage = jQuery(flipBookCon)
//			updateDepth(curPage);
		}
	}
	//滑动使用说明
	
	var swiper = function(){
		new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',//指示器，在这里指定指示器的名称及上面对应的html的class为swiper-pagination
	       
	        paginationType:'progress',//分页器样式
	        direction: 'horizontal', 
	    });
	}
	
	//检查设备
	var checkDevice = function(){
		var ua = navigator.userAgent;
//		isMobile = /.*?(Android|iphone|ipad).*?/gi.test(ua);
		var isPhone = false;
		try{
			isPhone = location.href.indexOf("isPhone=true")>-1;
		}catch (e) {
			// TODO: handle exception
		}
		
		isMobile = /.*?(Android|iphone).*?/gi.test(ua) || isPhone;
		isIOS = /.*?(iphone|ipad).*?/gi.test(ua);
		curIsHardCover = !isMobile&&(typeof bookConfig != 'undefined')&&bookConfig.hardCover&&bookConfig.hardCover.enable;
	}
	var initBookCon =  function(){
		mainCon.append($("<div id=\"bookCon\"><div id=\"flipbook\" class='animated'></div></div>"));
		if(!curIsHardCover){//硬壳书 厚度放到了封2，封3 内
			mainCon.append(depthLeft);
			mainCon.append(depthRight);
		}
		$('#bookCon').hide();
	}
	//初始化控制组件
	var initControl = function(){
		if(isMobile){//移动版
			initMobileControl();
		}else{//pc版
			initPcControl();
		}
	}
	var turnLoop = function(){
		var curPage = jQuery(flipBookCon).turn("page");
		if(curPage==pageCount){
			jQuery(flipBookCon).turn("page",1);
		}else{
			jQuery(flipBookCon).turn("next");
		}
	}
	var play = function(){
		var timer =3;
		var timerV = parseInt($("#autoTurnPageTimer").val());
		if(timerV >0){
			timer = timerV;
		}
		autoPlayInterval = setInterval(turnLoop,timer*1000);
	}
	var pause = function(){
		if(autoPlayInterval!=null){
			clearInterval(autoPlayInterval);	
		}
	}
	
	var initPageCtrolView = function(){
		var pageCtlCon = $("<div id='pageCtl'><div class='page-btn first-page-btn'></div>"+
		"<div class='page-btn pre-page-btn'></div>"+
		"<div class='input-page-btn'><input id='inputPageNum'/><div class='goPage'/></div>"+
		"<div class='page-btn next-page-btn'></div>"+
		"<div class='page-btn last-page-btn'></div></div>");
		
		var updatePageNumShow = function(event, page, view){
			 pageCtlCon.find("#inputPageNum").val("");
			  var curPage = "1";
			  if(page==1||page==pageCount){
			  	curPage = page;
			  }else{
				curPage = view.toString();
				if(/[0-9]+,[0-9]+/.test(curPage)){
					curPage = curPage.split(",").join("-");
				}
			  }
//			  $("#bottomBar").find(".page-ctrl-btn").text(curPage+"/"+pageCount);
			  pageCtlCon.find("#inputPageNum").attr("placeholder",curPage+"/"+pageCount);
			  try{
				  window.parent.changePageNo();
			  }catch (e) {
				// TODO: handle exception
			}
		}
		
		//绑定翻页事件
		jQuery(flipBookCon).bind("turning", updatePageNumShow);
		updatePageNumShow(null,1,null);
		
		pageCtlCon.find(".page-btn").click(function(e){
			if($(this).hasClass("first-page-btn")){
				turnPageDirection = false;
				jQuery(flipBookCon).turn("page",1);
			}else if($(this).hasClass("pre-page-btn")){
				turnPageDirection = false;
				jQuery(flipBookCon).turn("previous");
			}else if($(this).hasClass("next-page-btn")){
				turnPageDirection = true;
				jQuery(flipBookCon).turn("next");
			}else if($(this).hasClass("last-page-btn")){
				turnPageDirection = true;
				jQuery(flipBookCon).turn("page",pageCount);
			}
			e.stopPropagation();
		});
		pageCtlCon.find(".goPage").click(function(e){
			var inputPageNum = pageCtlCon.find("#inputPageNum").val();
			if(/[0-9]+/.test(inputPageNum)){
				inputPageNum = Math.max(inputPageNum,1);
				inputPageNum = Math.min(inputPageNum,pageCount);
				jQuery(flipBookCon).turn("page",inputPageNum);
			}
			e.stopPropagation();
		});
		return pageCtlCon;
	}
	
	var searchText = function(text){
		var searchResultData = [];
		var curPageObj;
		var allTextArea;
		var textArea;
		for(var i=0;i<bookDatas.length;i++){
			curPageObj = bookDatas[i];
			allTextArea = curPageObj.items;
			if(typeof(allTextArea)!="undefined"&&typeof(allTextArea[0])!="undefined"&&$.trim(text).length>0){
				for(var j=0;j<allTextArea.length;j++){
					var textArea = allTextArea[j].textContent.replace(/<br>/g,"").replace(/<br\/>/g,"");
					if(textArea&&textArea.indexOf(text)>-1){
						var json = {"page":curPageObj.pageID,"text":textArea};
						searchResultData.push(json);
						break;
					}
				}
				
			}
		}
		return searchResultData;
	}
	var initMobileControl = function(){
		//topBar
//		var topBar = $("<div id='topBar' class='ctl_bar ctrl_hide_up'></div>");
		var topBar = $("<div id='topBar_mobile' class='ctl_bar'><div class='logo' style='background-image:"+((typeof(logo)=="undefined"||logo=="")?"none":logo)+";'></div><div class='ctl_btn use_view_btn'></div></div>");
		mainCon.append(topBar);
		var searchHtml = "";
		//搜索
		if(isSearch == "Y"){
			searchHtml = "<div class='ctl_btn search'></div>";
		}
		//bottomBar
		var bottomBar = $("<div id='bottomBar' class='ctl_bar' style='height:30px;'>"+
		"<div class='ctl_btn theme_view_btn'/>"+
//		"<div class='ctl_btn use_view_btn' style='top:4px;width:34px;height:34px;'/>"+searchHtml+
		searchHtml+
		"<div class='ctl_btn page-ctrl-btn'></div>"+
		"<div class='ctl_btn play-ctrl-btn play-ctrl-btn-play'></div>"+
		"</div>");
		mainCon.append(bottomBar);
		mainCon.append("<div class='clickContrlArea'></div>");
		//缩略图
		var themeView = $("<div id='themeView'><div class='themeViewCon'></div></div>");
		mainCon.append(themeView);
		//搜索
		var searchDiv= $("<div id='searchView'>" +
							"<p style='position: absolute;color: #fff;top: -10px;width: 100%;text-align: center;font-size: 14px;'></p>" +
							"<div class='search-group'>" +
								"<input name='search'/>" +
								"<div class='search'></div>" +
							"</div>" +
							"<div id='searchResult'></div>" +
						"</div>");
		mainCon.append(searchDiv);
		//使用说明
		var UseDiv= $("<div id='UseView'>" +
				"<div class='close-swi'></div>" +
				"<div class='swiper-container' >" +
					"<div class='swiper-wrapper'>"+
						"<div id='page-1' class='swiper-slide' style='background-size:cover;background-image: url("+virgule+"youtuShare/pub/img/1.jpg);'></div>"+
						"<div id='page-2' class='swiper-slide' style='background-size:cover;background-image: url("+virgule+"youtuShare/pub/img/2.jpg);'></div>"+
						"<div id='page-3' class='swiper-slide' style='background-size:cover;background-image: url("+virgule+"youtuShare/pub/img/3.jpg);'></div>"+
						"<div id='page-4' class='swiper-slide' style='background-size:cover;background-image: url("+virgule+"youtuShare/pub/img/4.jpg);'></div>"+
						"<div id='page-5' class='swiper-slide' style='background-size:cover;background-image: url("+virgule+"youtuShare/pub/img/5.jpg);'></div>"+
					"</div>"+
				"</div>" +
				"<div class='swiper-pagination'></div>" +
		"</div>");
		mainCon.append(UseDiv);
		//翻页控件
		var pageControlCon = $("<div id='pageCtl_mobile'></div>");
		pageControlCon.append(initPageCtrolView());
		mainCon.append(pageControlCon);
		
		//显示/隐藏工具栏
//		$(bookCon).click(function(){
//			topBar.toggleClass("ctrl_hide_up");
//			bottomBar.toggleClass("ctrl_hide_down");
//			pageControlCon.removeClass("opacity_show");
//			pageControlCon.css("pointer-events","none");
//		});
		////////////////////缩略图///////////////////////////////
		//显示缩略图界面
		var initThemeList = function(){
			var itemW = 110;
			//计算列数
			var colNum = Math.floor($(window).width()/itemW);
			var themeViewPadding = ($(window).width()-colNum*itemW)/2;
			themeView.css({"padding-left":themeViewPadding});
			
			var con = themeView.find(".themeViewCon");
			if(con.children().length==0){
				var itemH = 90/(pageW/pageH);
				var hasPageInfo = false;
				var curImgUrl = "";
				var pageObj;
				for(var i=-1;i<bookDatas.length;i++){
					pageObj = bookDatas[i];
					var themeItem = "";
					if($("#isPaid").val()=="true"){
						themeItem = "<div><div class='tjLogo' style='background:"+logo+";margin-left:10px;width:"+image_W+"px;float:left;'></div><div style='color:#000;float:left;margin-left: 5px;margin-top: 5px;display:none;    font-size: 14px;'>"+dibiao+"</div><div style='clear: both;'></div></div>";
					}
					if(i>-1){
						var pageInfo = pageObj.pageInfo;
						if(pageInfo&&pageInfo!=""){
							hasPageInfo = true;
						}else{
							pageInfo="&nbsp;";
						}
						curImgUrl = pageObj.preview;
						themeItem = $("<div class='themeItem' data-page-id='"+(i+1)+"'  title='"+pageInfo+"'><p class='pageInfo'>"+pageInfo+"</p><div class='theme_img' style='height:"+itemH+"px; background-image: url("+curImgUrl+");'></div><p>"+(i+1)+"</p></div>");
					}
					con.append(themeItem);
					if(i==bookDatas.length-1){
						con.append("<div style='clear:both;'></div>");
					}
				}
				if(!hasPageInfo){
					con.find(".pageInfo").remove();
				}
			}
		}
		
		$(window).bind("resize",function(){
			if(themeView.hasClass("opacity_show")){
				//初始化列表
				initThemeList();
			}
		});
		
		themeView.on("click",".themeItem",function(e){
			jQuery(flipBookCon).turn("disable",false);
			var page_id = $(this).attr("data-page-id");
			jQuery(flipBookCon).turn("page",page_id);
			themeView.toggleClass("opacity_show");
			e.stopPropagation();
		});
		bottomBar.find(".theme_view_btn").click(function(e){
			if(pageControlCon.hasClass("opacity_show")==false){
				themeView.toggleClass("opacity_show");
				if(themeView.hasClass("opacity_show")){
					//初始化列表
					initThemeList();
					jQuery(flipBookCon).turn("disable",true);
					enableScroll();
				}else{
					jQuery(flipBookCon).turn("disable",false);
					disableScroll();
				}
			}
			e.stopPropagation();
		});
		var hideHelp = function() {
			
			if(UseDiv.css("visibility")=="hidden"){
				UseDiv.css("visibility","visible");
				themeView.css("display","none");
			}else{
				UseDiv.css("visibility","hidden");
				themeView.css("display","block");
			}
		}
		
		
		topBar.on("click",".use_view_btn",function(e){
			hideHelp();
			e.stopPropagation();
		});
		$("#UseView").on("click",".close-swi",function(e){
			hideHelp();
			e.stopPropagation();
		})
		bottomBar.on("click",".search",function(e){
			if(searchDiv.css("display")=="none"){
				searchDiv.css("display","block");
				themeView.css("display","none");
			}else{
				searchDiv.css("display","none");
				themeView.css("display","block");
			}
			e.stopPropagation();
		});
		//检索
		searchDiv.find(".search").click(function(e){
			var text = $(this).parent().find("input").val();
			var returnData = searchText(text);
			var html="";
			for(var i=0;i<returnData.length;i++){
				var pageID = returnData[i].page;
				var page = getPageIndexByID(pageID);
				var text = returnData[i].text;
				html +="<p style='width:"+(window_w-40)+"px;' page-id='"+page+"'>P"+page+":"+text+"</p>";
			}
			searchDiv.find("#searchResult").html(html);
			searchDiv.find("#searchResult").css("left","calc((100% - "+(window_w-40)+"px)/2)");
			e.stopPropagation();
		});
		//跳转页面
		searchDiv.find("#searchResult").on("click","p",function(e){
			var inputPageNum = $(this).attr("page-id");
			if(/[0-9]+/.test(inputPageNum)){
				inputPageNum = Math.max(inputPageNum,1);
				inputPageNum = Math.min(inputPageNum,pageCount);
				jQuery(flipBookCon).turn("page",inputPageNum);
			}
			if(searchDiv.css("display")!="none"){
				searchDiv.css("display","none");
				themeView.css("display","block");
			}
			e.stopPropagation();
		});
		searchDiv.find("#searchResult").click(function(e){
			if(searchDiv.css("display")!="none"){
				searchDiv.css("display","none");
				themeView.css("display","block");
			}
			e.stopPropagation();
		});
		////////////////////翻页///////////////////////////////
		bottomBar.find(".page-ctrl-btn").click(function(e){
			if(themeView.hasClass("opacity_show")==false){
				pageControlCon.toggleClass("opacity_show");
				if(pageControlCon.hasClass("opacity_show")){
					pageControlCon.css("pointer-events","all");
				}else{
					pageControlCon.css("pointer-events","none");
				}
			}
			e.stopPropagation();
		});
		
		///////////////////自动播放////////////
		bottomBar.find(".play-ctrl-btn").click(function(e){
			var isPlaying = false;
			if($(this).hasClass("play-ctrl-btn-pause")){
				isPlaying = true;
			}
			if(isPlaying){
				pause();
				$(this).addClass("play-ctrl-btn-play");
				$(this).removeClass("play-ctrl-btn-pause");
			}else{
				play();
				$(this).addClass("play-ctrl-btn-pause");
				$(this).removeClass("play-ctrl-btn-play");
			}
			e.stopPropagation();
		});
	}
	var getPdfViewPath = function(){
		if(/.*?(iphone).*?/gi.test(navigator.userAgent)){//苹果直接打开PDF
  			pdfPath = String.fromCharCode.apply(String,BASE64.decoder(pdfPath));
  			return pdfPath;
  		}else{
  			return "/pdfViewer/web/index.html?id="+pdfPath;
  		}
	}
	var initPcControl = function(){
//		mainCon.append($("<div id=\"prevBtn\"></div>")).append($("<div id=\"nextBtn\"></div>"));
//		$("#nextBtn").click(function(){
//			jQuery(flipBookCon).turn("next");
//		});
//		$("#prevBtn").click(function(){
//			jQuery(flipBookCon).turn("previous");
//		});
		
		//topBar
		var topBar = $("<div id='topBar_pc' class='ctl_bar'><a target='_blank' href='/'><div class='logo'></div></a></div>");
		
		//去除logo
		if($("#isPaid").val()=="true"){
			topBar.find(".logo").remove();
		}
		
		mainCon.prepend(topBar);
		var sharePlatHtml = "";
		if($(".share-plat-win").length>0){
			sharePlatHtml = "<div title='朋友分享' class='ctl_btn share_btn'/>";
		}
		//bottomBar
		var bottomBar = $("<div id='bottomBar_pc' class='ctl_bar'>"+
		"<div class='ctl_btn help_icon_btn'><div class='img'></div></div>"+sharePlatHtml+
		"<div class='ctl_btn theme_view_btn'/>"+
		"<div class='page-ctrl-con'></div>"+
		"<div class='ctl_btn play-ctrl-btn play-ctrl-btn-play'></div>"+
		"<div class='ctl_btn full_or_exit full-screen-btn'/>"+
		"</div>");
		if(typeof(contents_json)!="undefined"){
			var contentsArea = $("<div class='ctl_btn contents_icon_btn'></div>");
			var listStr = "";
			var ct = contents_json.coverType;
			for(var i in contents_json){
				if(i!="coverType"){
					var j = i;
					if(ct=="hard"&&!curIsHardCover&&i!="1"){
						if((parseInt(i)-4)==pageCount){
							j = parseInt(i)-4;
						}else{
							j = parseInt(i)-2;
						}
					}else if(ct!="hard"&&curIsHardCover&&i!="1"){
						if((parseInt(i)+4)==pageCount){
							j = parseInt(i)+4;
						}else{
							j = parseInt(i)+2;
						}
					}
					listStr += "<p data-key='"+j+"'>P"+j+"："+contents_json[i]+"</p>";
				}
		    }
			var contentsList = $("<div class='contents_body'><div class='contents_list'>"+listStr+"</div></div>");
			bottomBar.append(contentsArea.append(contentsList));
			bottomBar.on("click",".contents_icon_btn",function(){
				contentsList.toggle();
			})
			bottomBar.find(".contents_list p").click(function(){
				var inputPageNum = $(this).attr("data-key");
				if(/[0-9]+/.test(inputPageNum)){
					inputPageNum = Math.max(inputPageNum,1);
					inputPageNum = Math.min(inputPageNum,pageCount);
					jQuery(flipBookCon).turn("page",inputPageNum);
				}
			});
		}else{
			bottomBar.find(".help_icon_btn").css("left","calc(50% - 332px)");
		}
		mainCon.append(bottomBar);
		//朋友分享
		bottomBar.on("click",".share_btn",function(){
			var shareModal = $(".share-plat-win");
			if(shareModal.length>0){
				var text = "<iframe frameborder='0'  width='240' height='210'  title='"+$("title").html()+"' src='"+location.href+"' type='text/html' allowfullscreen='true' scrolling='no' marginwidth='0' marginheight='0'></iframe>";
				$(".share-plat-win").find("textarea").val(text);
				$(".share-plat-url>input").val(location.href);
				shareModal.show();
			}else{
				alert("请重新发布作品后，分享按钮生效！");
			}
		});
		bottomBar.on("click",".help_icon_btn",function(){
			$(this).find(".img").toggle();
		});
		$(".share-plat-cancel").click(function(){
			$(".share-plat-win").hide();
		})
		//复制
		$(".share-plat-copy").click(function(){
			var copyUrl = $(this).parent().find(".text");
			copyUrl.select();
			if(document.execCommand("Copy")){
				alert("复制成功！");
			}else{
				alert("复制失败，请手动复制！")
			}
		})
		//翻页控件
		bottomBar.find(".page-ctrl-con").append(initPageCtrolView());
		
		bottomBar.on("click",".full_or_exit",function(){
			if($(this).hasClass("full-screen-btn")){//全屏按钮
				callFullScreen();
				$(this).removeClass("full-screen-btn").addClass("exit-full-screen-btn");
			}else{//退出全屏
				callExitFullScreen();
				$(this).removeClass("exit-full-screen-btn").addClass("full-screen-btn");
			}
		});
		
		//查看PDF
		if(pdfPath&&pdfPath.length>6){
			var r = "";
			var bgAudioUrlPath =  $("#musicUrl").val();
			if(bgAudioUrlPath == ""){
				r = "style='right:calc(50% - 240px);'";
			}
			
			var viewPdfBtn = $("<div "+r+" id='viewPdfBtn'><a target='_blank' href='"+getPdfViewPath()+"'></a></div>");
			bottomBar.append(viewPdfBtn);
		}
		
		jQuery(flipBookCon).on("mousemove",function(event){
			if(isShowBig){
				jQuery(flipBookCon).css("cursor","default");
				return;
			}
			var currentTarget = $(event.target).closest(".page-wrapper");
			if(typeof bookDatas[$(currentTarget).attr("page")-1] === 'undefined')return;
			var textAreas = bookDatas[$(currentTarget).attr("page")-1].items;
			if(typeof textAreas === 'undefined')return;
			var clickX = event.clientX||(event.pointers&&event.pointers[0]&&event.pointers[0].clientX)||(event.changedPointers&&event.changedPointers[0]&&event.changedPointers[0].clientX)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientX);
			var clickY = event.clientY||(event.pointers&&event.pointers[0]&&event.pointers[0].clientY)||(event.changedPointers&&event.changedPointers[0]&&event.changedPointers[0].clientY)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientY);
			clickX -= currentTarget.offset().left;
			clickY -= currentTarget.offset().top;
			
			var scale = bookh/pageH;
			clickX = clickX/scale;
			clickY = clickY/scale;
			
			//是否有元素
			for(var i=textAreas.length-1;i>=0;i--){
				var textArea = textAreas[i];
				var textAreaX = parseFloat(textArea.x);
				var textAreaY = parseFloat(textArea.y);
				var textAreaW = parseFloat(textArea.width);
				var textAreaH = parseFloat(textArea.height);
				var textAreaR = parseFloat(textArea.r);
				if(pointInInRect(clickX,clickY,textAreaX,textAreaY,textAreaW,textAreaH,textAreaR)){
					jQuery(flipBookCon).css("cursor","pointer");
					return;
				}
			}
			jQuery(flipBookCon).css("cursor","default");
		});
		
		////////////////////缩略图///////////////////////////////
		//缩略图
		var themeView = $("<div id='themeView_pc' style='height:auto;margin-bottom:0;'></div>");
		mainCon.append(themeView);
		//显示缩略图界面
		var initThemeList = function(){
			var itemH = 180;
			//计算宽度
			var itemW = pageW/pageH*itemH;
			
//			var closeBtn = $("<div class='close-btn'></div>")
//			closeBtn.click(function(){
//				themeView.toggleClass("opacity_show");
//			});
//			themeView.append(closeBtn);
			
			var con = $("<div class='theme-con' style='margin-bottom:0;'></div>");
			themeView.append(con);
			var itemCon = $("<div class='themeItemCon'></div>");
//			itemCon.css("width",(itemW+20)*pageCount+"px");
			var hasPageInfo = false;
			var curImgUrl = "";
			var pageObj;
			for(var i=0;i<bookDatas.length;i++){
				pageObj = bookDatas[i];
				var pageInfo = pageObj.pageInfo;
				if(pageInfo&&pageInfo!=""){
					hasPageInfo = true;
				}else{
					pageInfo="&nbsp;";
				}
				curImgUrl = pageObj.preview;
				var themeItem = $("<div class='themeItem' data-page-id='"+(i+1)+"'  title='"+pageInfo+"'><p class='pageInfo' >"+pageInfo+"</p><div class='theme_img' style='background-image: url("+curImgUrl+");'></div><p>"+(i+1)+"</p></div>");
				itemCon.append(themeItem);
			}
			if(!hasPageInfo){
				itemCon.find(".pageInfo").remove();
			}
			itemCon.append($("<div style='clear:both;'></div>"));
			con.append(itemCon);
			con.find(".themeItem,.theme_img").css({width:itemW+"px"});
			con.find(".themeItem").css("height",itemH+"px");
			con.find(".theme_img").css("height",itemH+"px");
			
			con[0].onmousewheel = function(eve){//下拉会触发turn.js翻页，禁用向上派发
				eve.stopPropagation();
			}
			
			
		}
		themeView.on("click",function(){
			themeView.removeClass("opacity_show");
		})
		themeView.on("click",".theme-con",function(event){
			event.stopPropagation();
			$(this).addClass("opacity_show");
		})
		themeView.on("click",".themeItem",function(){
			jQuery(flipBookCon).turn("disable",false);
			var page_id = $(this).attr("data-page-id");
			jQuery(flipBookCon).turn("page",page_id);
			themeView.removeClass("opacity_show");
		});
		bottomBar.find(".theme_view_btn").click(function(){
			themeView.toggleClass("opacity_show");
			if(themeView.hasClass("opacity_show")&&themeView.children().length==0){
				//初始化列表
				initThemeList();
			}
		});
		
		
		///////////////////自动播放////////////
		bottomBar.find(".play-ctrl-btn").click(function(){
			var isPlaying = false;
			if($(this).hasClass("play-ctrl-btn-pause")){
				isPlaying = true;
			}
			if(isPlaying){
				pause();
				$(this).addClass("play-ctrl-btn-play");
				$(this).removeClass("play-ctrl-btn-pause");
			}else{
				play();
				$(this).addClass("play-ctrl-btn-pause");
				$(this).removeClass("play-ctrl-btn-play");
			}
		});
		//检索-PC
		var searchView = $("<div id='searchView_pc'></div>");
		mainCon.append(searchView);
		$("#bottomBar_pc").on("click",".search-group .search",function(){
			var itemH = 180;
			//计算宽度
			var itemW = pageW/pageH*itemH;
			searchView.addClass("opacity_show");
			var text = $(this).parent().find("input").val();
			var returnData = searchText(text);
			var html="<div class=\"result\">";
			for(var i=0;i<returnData.length;i++){
				var pageID = returnData[i].page;
				var page = getPageIndexByID(pageID);
				var text = returnData[i].text;
				var previewImg = bookDatas[page-1].preview;
				html +="<div page-id='"+page+"' style='width:"+itemW+"px;height:"+itemH+"px;'><div class='searchView_pc_bg' style=\"background-image:url("+previewImg+")\"></div><p>P"+page+"</p></div>";
			}
			html += "</div>";
//			if(returnData.length==0){
//				html="未搜索到数据";
//			}
			searchView.html(html);
		});
		searchView.on("click",function(event){
			$(this).removeClass("opacity_show");
		})
		searchView.on("click",".result",function(event){
			event.stopPropagation();
			$(this).addClass("opacity_show");
		})
		searchView.on("click",".result>div",function(){
			var inputPageNum = $(this).attr("page-id");
			if(/[0-9]+/.test(inputPageNum)){
				inputPageNum = Math.max(inputPageNum,1);
				inputPageNum = Math.min(inputPageNum,pageCount);
				jQuery(flipBookCon).turn("page",inputPageNum);
				searchView.removeClass("opacity_show");
			}
		});
	}
	
	var  initAudio = function(){
		var audioIcoInterval = 0;
		var bgX = 0;
		var playIco = function(){
//			audioIcoInterval = setInterval(function(){
//				bgX -= 40;
//				if(bgX<-80){
//					bgX = 0;
//				}
//				$(".u-audio").find(".css_sprite01").css("background-position",bgX+"px -15px");
//			},100);
		}
		var pauseIco = function(){
			bgX = 0;
//			$(".u-audio").find(".audio_open").css("background-position",bgX+"px  -15px");
			clearInterval(audioIcoInterval);
		}
		
		var bgAudioUrl =  $("#musicUrl").val();
		if(isMobile){
			aaaaa(bgAudioUrl,isMobile,getWXPlay,playIco,pauseIco);
			var isPaid = $("#isPaid").val();
			if(isPaid&&isPaid=="true"){
			}else{
				//logo
//				var powerby = $("<div class='ctl_btn powerLogo'></div>");
//				$("#bottomBar").append(powerby);
//				powerby.click(function(){
//					location.href="http://www.360youtu.com/uwp/weixin/Shop/index2.jsp?state=92735";
//				});
			}
			
			//查看PDF
			if(pdfPath&&pdfPath.length>6){
				var viewPdfBtn = $("<div id='viewPdfBtn'><a target='_blank' href='"+getPdfViewPath()+"'>PDF</a></div>");
				$("#bottomBar").append(viewPdfBtn);
			}
			
			//阅读原文
//			var articlePath = $("#articlePath").val();
//			if(articlePath != '' && typeof(articlePath) != "undefined" && articlePath != 'null'){
//				var articleName = "";
//				if(articlePath.indexOf("|")>0){
//					articleName = articlePath.split("|")[0];
//					articlePath = articlePath.split("|")[1];
//				}
//				if(articleName == '' || typeof(articleName) == "undefined"){
//					articleName = "联系我们";
//				}
//				if(articlePath == '' || typeof(articlePath) == "undefined"){
//					articlePath = "/";
//				}
//				var readArticleCon = $("<div class='readArticle'>"+articleName+"</div>");
//				$("#bottomBar").append(readArticleCon);
//				readArticleCon.click(function(e){
//					window.location.href=articlePath;
//					e.stopPropagation();
//				});
//			}
			var div = $("#bottomBar>div");
			var divCount = div.length;
			var j = 100/(divCount-1);
			if(divCount==3){
				$(".page-ctrl-btn").css("left", "46%");
				$(".play-ctrl-btn").css("left", "92%");
//			} else if(divCount==4){
//				$(".use_view_btn").css("left", "30%");
//				$(".page-ctrl-btn").css("left", "60%");
//				$(".play-ctrl-btn").css("left", "92%");
			}else{
				for(var i = 0;i<divCount;i++){
					if(i!=0){
						if(i==divCount-1){
							$(div[i]).css("right","0px");
						}else{
							$(div[i]).css("left",(i*j)+"%");
							$(div[i]).css("margin-left","-"+($(div[i]).width()/2)+"px");
						}
					}
				}
			}
//			if ($(".readArticle").length > 0) {
//				$(".use_view_btn").css("left", "calc(13% + 4px)");
//				$(".page-ctrl-btn").css("left", "calc(40% + 10px)");
//				$(".play-ctrl-btn").css("left", "calc(57% + 10px)");
//				$(".u-audio").css("left", "calc(72% + 10px)");
//				$(".search").css("left", "calc(27% + 4px)");
//				
//			} else if ($(".readArticle").length <= 0) {
//				$(".use_view_btn").css("left", "calc(16% + 4px)");
//				$(".page-ctrl-btn").css("left", "calc(47% + 10px)");
//				$(".play-ctrl-btn").css("left", "calc(70% + 10px)");
//				$(".u-audio").css("left", "calc(88% + 10px)");
//				$(".search").css("left", "calc(33% + 4px)");
//				
//			} 
		}else{
			if((typeof bgAudioUrl != 'undefined')&&bgAudioUrl.length>5){
				aaaaa(bgAudioUrl,isMobile,getWXPlay,playIco,pauseIco);
			}
			//搜索
			if(isSearch == "Y"){
				var searchCon = $("<div class='search-group'><input name='search'/><div class='search'></div></div>");
				$("#bottomBar_pc").append(searchCon);
			}
			var articlePath = $("#articlePath").val();
			if(articlePath != '' && typeof(articlePath) != "undefined" && articlePath != 'null'){
				var articleName = "";
				if(articlePath.indexOf("|")>0){
					articleName = articlePath.split("|")[0];
					articlePath = articlePath.split("|")[1];
				}
				if(articleName == '' || typeof(articleName) == "undefined"){
					articleName = "联系我们";
				}
				if(typeof(articlePath) == "undefined"|| articlePath == ''){
					articlePath = "/";
				}
				var readArticleCon = $("<a class='contactUs' href='"+articlePath+"' target='_blank'>"+articleName+"</div>");
				$("#bottomBar_pc").append(readArticleCon);
			}
			if($("#isPaid").val() == "true"){
				$("#bottomBar_pc").append("<div><div class='tjLoGo' style='background-image:"+logo+"'></div></div>");
			}
			
		}
		$("body").attr("onbeforeunload","return closePage()");
	}
	var checkUpdateCache = function(){//判断是否更新缓存
		$.post("/uwp/newServlet?serviceName=ShareMag&medthodName=updateCache",{shareID:$("#shareID").val()},function(){});
	}
	var startAnimation = function(index){
		var initFirst = $(".p"+index).find(".m-page");
		initFirst.find(".animation").each(function(){
 			$.fn.stopEffect(this);
			//判断是否有控制该元素显示的元素
			var flag = $.fn.checkIsCanPlayEffect(this);
			if(flag){
				$.fn.playEffect(this);
			}
		})
	}
	var stopAnimation = function(index){
		var initFirst = $(".p"+index).find(".m-page");
		initFirst.find(".animation").each(function(){
 			$.fn.stopEffect(this);
		})
	}
	$(window).on("load",function(){
//		$(".p-ct").css("width","1280px")
		mainCon.hide();
		initBookCon();
		checkDevice();
		mesureSize();
		makePagesData();//组织数据
		initControl();
		bindEvent();
		initData();
		initAudio();
		checkUpdateCache();
		bindLogoClick();
		startAnimation(1);
	});
	
	var bindLogoClick = function(){
		var logoPath = $("#logoPath").val();
		if(logoPath=="null"||logoPath=="" || typeof(logoPath) == "undefined"){
			logoPath = "/";
		}
//		var isBuyLogo = $("#isBuyLogo").val();
//		if(isBuyLogo != "Y"){
//			logoPath = "/";
//		}
		mainCon.on("click",".tjLoGo",function(e){
			if(logoPath!="" && typeof(logoPath) != "undefined"){
				window.open(logoPath);
			}
		})
		mainCon.on("click",".tjLogo",function(e){
			if(logoPath!="" && typeof(logoPath) != "undefined"){
				window.open(logoPath);
			}
		})
		mainCon.on("click","#topBar_mobile>.logo",function(e){
			if(logoPath!="" && typeof(logoPath) != "undefined"){
				window.open(logoPath);
			}
		})
	}
	/**
	 * 组织pagesData对象
	 */
	var makePagesData = function(){
	 	var pages = $(".translate-back")[0].children;
		var pageObj;
		for(var i=0;i<pages.length;i++){
			var page = $(pages[i]).removeClass("f-hide");
			page.css({"transform":"scale("+contentScale+")",width:pageW+"px",height:pageH+"px"});
			page.find(".uniImg").each(function(){
		 		$(this).attr("src",$(this).data("src"))
		 	});
//			page.find("font").each(function(){
//				var fontSize = parseFloat($(this).css("font-size").replace("px",""))*contentScale;
//				$(this).css("font-size",fontSize+"px");
//			})
			
			var previewImgUrl = page.find(".page-con-img").data("src");
			previewImgUrl = previewImgUrl.replace(".jpg","_m.jpg");
			pageObj = {
				pageID:page.attr("pageid"),
				bgImg:"",
				pageData:$("<div>"+page.prop("outerHTML")+"</div>"),
				preview:previewImgUrl,
				pageInfo:"",
				items:[]
		   };
			bookDatas.push(pageObj)
			if(typeof textAreaData!== "undefined"){
				pageObj.pageInfo = textAreaData.pages[i].pageInfo;
				pageObj.items = textAreaData.pages[i].textArea;
			}
		}
		textAreaData = null;//清理掉这个遍历
		amendPageCount();
	}
	
	/**
	 * 修正页数，一下情况需要修正
	 * 	1.用户页数为奇数
	 *  2.用户选择硬壳书，需要封2，封3，各加两页环衬页
	 */
	var amendPageCount = function(){
		var pageNum = parseInt(pageCount);
		if(pageNum%2==1){//奇数页
			//封3位置加入空白页
			var emptyPage = {pageID:-1,bgImg:"",preview:"",pageInfo:"",items:[]};
			bookDatas.splice(bookDatas.length-1,0,emptyPage);
		}
		if(curIsHardCover){
			//硬壳版 加上4个环衬页
			var pastedownPage = {pageID:-1,bgImg:pastedownUrl,preview:pastedownUrl,pageInfo:"环衬",items:[]};
			bookDatas.splice(1,0,pastedownPage);
			bookDatas.splice(1,0,pastedownPage);
			bookDatas.splice(bookDatas.length-1,0,pastedownPage);
			bookDatas.splice(bookDatas.length-1,0,pastedownPage);
		}
		pageCount = bookDatas.length;
	}
	/**
	 * 根据PageID获取该页的索引
	 */
	var getPageIndexByID = function(pageID){
		for(var i=0;i<bookDatas.length;i++){
			if(bookDatas[i].pageID == pageID){
				return i+1;
			}
		}
		return -1;
	}
})();

function submitPsw(){
	var $input = $(".inputPSWWin #visitPsw");
	var inputPSW = $input.val();
	var shareID = $("#shareID").val();
	var reg_phone = /^1[3|4|5|7|8][0-9]{9}$/;
	var reg_email = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
	var reg_qq =/^[1-9]\d{4,10}$/;
	var visitorType = $(".inputPSWWin-con").data("visitortype");
	var visitorTypeName = $(".inputPSWWin-con").data("visitortypename");
	if(visitorType=="0" && !reg_phone.test(inputPSW)){
		myAlert($input,"请输入正确的"+visitorTypeName+"！")
		return;
	}else if(visitorType=="1" && !reg_email.test(inputPSW)){
		myAlert($input,"请输入正确的"+visitorTypeName+"！")
		return;
	}else if(visitorType=="2" && !reg_qq.test(inputPSW)){
		myAlert($input,"请输入正确的"+visitorTypeName+"！")
		return;
	}else if(visitorType != "0" && visitorType != "1" && visitorType != "2" && inputPSW.length != 6){
		myAlert($input,"请输入6位数"+visitorTypeName+"！")
		return;
	}
	var url = "/uwp/newServlet?serviceName=ShareMag&medthodName=checkPassword";
	$.post(url,{shareID:shareID,psw:inputPSW},function(data){
		if(data=="true"){
			$(".inputPSWWin").removeClass("z-show");
			$(".inputPSWWin").addClass("f-hide");
		}else{
			myAlert($input,visitorTypeName+"错误！")
		}
	});
}
function myAlert($input,msg){
	alert(msg);
	$input.focus();
}
function aaaaa(bgAudioUrl,isMobile,getWXPlay,playIco,pauseIco){
	//显示音乐图标
	var audioCon = $("<div class='u-audio'><div class='audio_open'></div></div>");
	if(isMobile){
		$("#bottomBar").append(audioCon);
//		audioCon.css("right","90px");
//		audioCon.css("left","calc(26% + 10px)");
		if(bgAudioUrl == ""){
//			$(".u-audio").find(".audio_open").removeClass("css_sprite01").addClass("css_sprite02");
			$(".u-audio").remove();
			return;
		}else{
			$(".u-audio").find(".audio_open").addClass("css_sprite01");
		}
	}else{
		$("#bottomBar_pc").append(audioCon);
		audioCon.css("right","90px");
	}
	var options_audio = {
			autoplay:true,
				loop: true,
	            preload: "auto",
	            src: bgAudioUrl
		}
		bgAudio = new Audio(); 
     for(var key in options_audio){
         if(options_audio.hasOwnProperty(key) && (key in bgAudio)){
         	bgAudio[key] = options_audio[key];
         }
     }
     xcx_close_audio = bgAudio;
	 getWXPlay(function(){
		 bgAudio.load();
		 bgAudio.play();
	 });
   $(".u-audio").find('.audio_open').on('click',function(e){
 	  if(bgAudio.paused){
 		 bgAudio.play();
 	  }else{
 		  bgAudio.pause();
 	  }
			e.preventDefault();
	});
	// 声音打开事件
	$(bgAudio).on('play',function(){
		$(".u-audio").find(".audio_open").removeClass("css_sprite02").addClass("css_sprite01");
		playIco();
	})
	// 声音关闭事件
	$(bgAudio).on('pause',function(){
		$(".u-audio").find(".audio_open").removeClass("css_sprite01").addClass("css_sprite02");
		pauseIco();
	})
}
function closePage(){
	xcx_close_audio.pause();
}