var xcx_close_audio=null;
var hasAudio = function(){//内页音频是否存在
	var flag = false;
	try{
		var dataLength = audioDatas_json.datas.length>0;
		if($("#openAudio").val()=="Y"&&dataLength){
			flag = true;
		}
	}catch (e) {
		// TODO: handle exception
	}
	return flag;
};
(function(){
	document.oncontextmenu=new Function('event.returnValue=false;');
	document.onselectstart=new Function('event.returnValue=false;');
	
	var isMember = false;
	var limitCount = 0;
	function isMemberFun(){
		var shareID=$("#shareID").val();
		$.post("/uwp/newServlet?serviceName=ShareMag&medthodName=isMemberWithShareID",{shareID:shareID},function(data){
			isMember = data.flag;
			limitCount = data.count;
		},'json');
	}
//	isMemberFun();
	//电子书数据信息
	var bookDatas = [];
	
	var isMobile = false;//是否移动端
	
	var isIOS = false;//是否是IOS系统
	
	var pageCount = $("#pageCount").val();//总页数
	var imgPath = $("#imgPath").val();
	var bookw = 500;
	var bookh = 500;
	
	var toolTipPic = $("#toolTipPic").val()||0;
	var pageW = $("#pageWidth").val();
	var pageH = $("#pageHeight").val();
	
	
	var displayModeToggle = "auto";//单页对页切换模式切换：auto：自动 double：固定对页 single：固定单页
	
	var displayMode = 2;//显示模式， 1：单页 2:对页
	
	var window_w  = $(window).width();
	var window_h = $(window).height();
	
	var padding_left = 50;
	var padding_right = 50;
	
//	var padding_top = 40;
//	var padding_bottom = 70;
	var padding_top = 66;
	var padding_bottom = 18;
	
	var flipBookCon = "#flipbook";
	var bookCon = "#bookCon";
	
	var useGroup = "#Use-group";//使用说明
	
	var turnPageAudio = null;//背景音乐
	var audioWithPage = null;//电子书音频
	var allAudioData = [];
	var curAudio = null;
	
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
//	var coverHardDefaultColor = "#FF6600";//硬壳书背景色
	var coverHardSpineDefaultColor = "#767676";//硬壳书书脊背景色
	
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
	
	var showMessage = function(msg){
		var ele = $("#message");
		if(ele.length==0){
			ele = $("<div id='message'></div>").appendTo("body");
		}
		ele.html(msg);
		if(ele.queue().length==0){
			ele.fadeIn().fadeOut(1000);
		}
	}
	
	
	var isShowContents_m=function(flag){
		if(flag){
			$(".contents_m_body").stop().animate({left:"0%"},animateSpeed);
		}else{
			$(".contents_m_body").stop().animate({left:"-82%"},animateSpeed);
		}
	}
	var hideBottomBar = function(){
		isAnimate = true;
		$("#pageCtl_mobile").removeClass("opacity_show");
		$("#topBar_mobile").stop().animate({top:bottomBar_h},animateSpeed);
		$("#bottomBar").stop().animate({bottom:bottomBar_h},animateSpeed);
		setTimeout(function(){
			isAnimate = false;
			$(mainCon).attr("isShowBottomBar","true");
		},animateSpeed+500);
		isShowContents_m(false);
	}
	var showBottomBar = function(){
		isAnimate = true;
		$("#topBar_mobile").stop().animate({top:"0px"},animateSpeed);
		$("#bottomBar").stop().animate({bottom:"0px"},animateSpeed);
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
	/**$("").length
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
	
	var mesureBottonBarBtn = function(baseX){
		var gap = 50;
		
		var btnList = [".double-single-ctrl-btn",".theme_view_btn",".share_btn",".contents_icon_btn",".help_icon_btn"];
		
		for(var i=0;i<btnList.length;i++){
			if($("#bottomBar_pc "+btnList[i]).length>0){
				baseX += gap;
				$("#bottomBar_pc "+btnList[i]).css("left","calc(50% - "+baseX+"px)");
			}	
		}
	}
	
	/**
	 * 计算组件尺寸
	 */
	var mesureSize = function(){
		window_w  = $(window).width();
		window_h = $(window).height();
		var doubleSingleToggleEnable = !curIsHardCover&&(window_w>window_h)&&(parseFloat(pageW)>parseFloat(pageH));
		
		if(doubleSingleToggleEnable){//横屏模式	显示单双页切换按钮
			if(isMobile){
				if($("#bottomBar .double-single-ctrl-btn").length==0){
					$("#bottomBar .play-ctrl-btn").after("<div class='ctl_btn double-single-ctrl-btn "+(displayModeToggle=="single"?"single":"double")+"'/>");
				}
			}else{
				if($("#bottomBar_pc .double-single-ctrl-btn").length==0){
					$("#bottomBar_pc .theme_view_btn").after("<div class='ctl_btn double-single-ctrl-btn "+(displayModeToggle=="single"?"single":"double")+"'/>");
				}
				mesureBottonBarBtn(188);
			}
		}else{
			$("#bottomBar .double-single-ctrl-btn").remove();
			$("#bottomBar_pc .double-single-ctrl-btn").remove();
			
			mesureBottonBarBtn(188);
		}
		mesureBottomBtnPositoinMobile();
		//硬壳书在非移动设备下总是对页显示
		if(!doubleSingleToggleEnable||displayModeToggle=="auto"){
//			displayMode = ((curIsHardCover)||window_w>window_h)?2:1;
			displayMode = window_w>window_h?2:1;
		}else{
			displayMode = displayModeToggle=="double"?2:1;
		}
		
		var needDepth = displayMode == 2;
		if(isMobile){
			var isAddPadding = $("#isAddPadding").val();
			var addPadding = 0;
			if(isAddPadding == "Y"){
				addPadding = 10;
			}
			padding_bottom = padding_top = addPadding;
			padding_left = padding_right = needDepth?20:addPadding; 
//			window_h = window_h-30;
			window_h = window_h;
//			if(window_w>window_h){
//				hideBottomBar();
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
//			}else{
//				showBottomBar();
//			}
		}
//		else{
//			padding_top = 20;
//		}
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
		//防止因为小数问题出现的误差，都为整数，且宽度为偶数
		bookw = Math.round(bookw);
		if(bookw%2==1)bookw++;
		bookh = Math.round(bookh);
		
//		var padding = con_padding_v+"px "+con_padding_h+"px "+(con_padding_h+30)+"px "+con_padding_h+"px";
		
		var top = (padding_top+con_padding_v);
		var left = (padding_left+con_padding_h);
		var bottom = (padding_bottom+con_padding_v+(isMobile?((window_w/window_h>1)?0:30):0));
		var right = (padding_left+con_padding_h);
		$(bookCon).css({position:"absolute",top:top,left:left,bottom:bottom,right:right,padding:"0"});
		
		//页数depth
		if(!curIsHardCover){
			$("#depth_left").css({top:top,bottom:bottom,left:left-20});
			$("#depth_right").css({top:top,bottom:bottom,right:right-20});
			
//			var currentPage = $(flipBookCon).turn('page');
//			if(currentPage>1&&currentPage<pageCount){
//				$("#depth_right").css({top:0,bottom:0,right:-20});
//			}else{
//				$("#depth_right").css({top:0,bottom:0,right:bookw/4-20});
//			}
//			$("#depth_left").css({top:0,bottom:0,left:-20});
//			$("#depth_left").attr("data-l",bookw/4-20);
//			$("#depth_right").attr("data-r",bookw/4-20);
		}
		
		if(curIsHardCover){
			innerW = Math.round(bookw/displayMode);
			innerH = Math.round(bookh);
			
			innerPaddingV  = Math.round(innerH*0.02);
			innerPaddingV = Math.max(5,innerPaddingV);
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
		var con = $(flipBookCon);
		var count = bookDatas.length;
		
//		var isShowTip = false;
//		if(!isMember&&limitCount!=0){
//			count = limitCount+1;
//			isShowTip = true;
//		}
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
		var coverType = $("#coverType").val();
		for(var i=0;i<count;i++){
			var pageObj = bookDatas[i];
			var pageWidget = "";
			var otherAttrs = "";
			var line = "";
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
			}else if (!isMobile) {
//				if(coverType == "hard"){
//					if(i!=0 && i!=count-1){
//						if(i%2==0){
//							line = "<div class='sheet'>" +
//							"<img class='sheet_c1' src='"+virgule+"youtuShare/fb/img/line2.png'>" +
//							"<img class='sheet_c2' src='"+virgule+"youtuShare/fb/img/line2.png'>" +
//							"<img class='sheet_c3' src='"+virgule+"youtuShare/fb/img/line2.png'>" +
//							"<img class='sheet_c4' src='"+virgule+"youtuShare/fb/img/line2.png'></div>";
//						}else{
//							line = "<div class='sheet'>" +
//							"<img class='sheet_c1' src='"+virgule+"youtuShare/fb/img/line2.png' style='right: -0.5%;left: auto;'>" +
//							"<img class='sheet_c2' src='"+virgule+"youtuShare/fb/img/line2.png' style='right: -0.5%;left: auto;'>" +
//							"<img class='sheet_c3' src='"+virgule+"youtuShare/fb/img/line2.png' style='right: -0.5%;left: auto;'>" +
//							"<img class='sheet_c4' src='"+virgule+"youtuShare/fb/img/line2.png' style='right: -0.5%;left: auto;'></div>";
//						}
//					}
//				}
				if(coverType == "line"){
					if(i==0){
						line = "<div class='vertical'><div class='vertical_sh'></div><div class='vertical_h1'></div><div class='vertical_h2'></div><div class='vertical_h3'></div><div class='vertical_h4'></div></div>";
					}
					if(i==count-1){
						line = "<div class='vertical'><div class='vertical_sh' style='right:10.5%;left:auto;'></div>" +
						"<div class='vertical_h1'  style='right:0px;left:auto;transform: rotate(180deg);'></div>" +
						"<div class='vertical_h2'  style='right:0px;left:auto;transform: rotate(180deg);'></div>" +
						"<div class='vertical_h3'  style='right:0px;left:auto;transform: rotate(180deg);'></div>" +
						"<div class='vertical_h4'  style='right:0px;left:auto;transform: rotate(180deg);'></div></div>";
					}
				}
				if(coverType == "Staple"){
					if(i==0){
						line = "<div class='Staple'><img class='Staple_h1'  src='"+virgule+"youtuShare/fb/img/999.png'><img class='Staple_h2' src='"+virgule+"youtuShare/fb/img/999.png'></div>";
					}
					if(i==count-1){
						line = "<div class='Staple'><img class='Staple_h1' src='"+virgule+"youtuShare/fb/img/999.png' style='right:-1%;left:auto;'><img style='right:-1%;left:auto;' class='Staple_h2' src='"+virgule+"youtuShare/fb/img/999.png'></div>";
					}
					if(i==count/2){
						line = "<div class='Staple_c'><img class='Staple_c1' src='"+virgule+"youtuShare/fb/img/1.svg'><img class='Staple_c2' src='"+virgule+"youtuShare/fb/img/1.svg'></div>";
					}
					if(i==count/2-1){
						line = "<div class='Staple_c'><img style='right:-6.6%;left:auto;' class='Staple_c1' src='"+virgule+"youtuShare/fb/img/1.svg'><img style='right:-6.6%;left:auto;' class='Staple_c2' src='"+virgule+"youtuShare/fb/img/1.svg'></div>";
					}
				}
				if(coverType == "TRing"){
					if(i==0){
						line = "<div class='TRing'>" +
								"<img class='TRing_h1' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h2' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h3' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h4' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h5' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h6' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h7' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h8' src='"+virgule+"youtuShare/fb/img/102.png'>" +
								"<img class='TRing_h9' src='"+virgule+"youtuShare/fb/img/102.png'></div>";
					}
					if(i!=0 && i!=count-1){
						if(i%2==0){
							line = "<div class='TRing'>" +
							"<img class='TRing_c1' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c2' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c3' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c4' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c5' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c6' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c7' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c8' src='"+virgule+"youtuShare/fb/img/101.png'>" +
							"<img class='TRing_c9' src='"+virgule+"youtuShare/fb/img/101.png'></div>";
						}else{
							line = "<div class='TRing'>" +
							"<img class='TRing_c1' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c2' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c3' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c4' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c5' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c6' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c7' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c8' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'>" +
							"<img class='TRing_c9' src='"+virgule+"youtuShare/fb/img/101.png' style='right: -3%;left: auto;'></div>";
						}
					}
					if(i==count-1){
						line = "<div class='TRing'>" +
								"<img class='TRing_h1' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h2' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h3' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h4' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h5' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h6' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h7' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h8' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'>" +
								"<img class='TRing_h9' src='"+virgule+"youtuShare/fb/img/102.png' style='right: 0%; left: auto;transform: rotate(180deg);'></div>";
					}
				}
				if(coverType == "butterfly"){
					pageclass = "hard";
				}
				if(i==0 || i==count-1){
					pageWidget = textureCover;
				}else{
					pageWidget += textureInnerPage;
				}
			}else if(isMobile){
				if(coverType == "butterfly"){
					pageclass = "hard";
				}
				if(i==0 || i==count-1){
					pageWidget = textureCover;
				}else{
					pageWidget += textureInnerPage;
				}
			}
			var nohard = "";
			if(!curIsHardCover && i>0 && i<count-1 && displayMode==2){
				nohard = "noHard";
			}
			var page = $("<div "+otherAttrs+" class='"+nohard+" "+pageclass+"'>"+pageWidget+"<div class='pageBg "+nohard+"' data-img='"+pageObj.bgImg+"'>"+line+"<div class='loading'></div></div></div>");
			if(i==0){//封面
				if((isMobile||displayMode==1)&&toolTipPic!="0"&&toolTipPic!="-1"){
					page.append("<div class='turn-page-tip'></div>");
				}
				page.find(".hard_cover_shadow").css("z-index",1)
			}else	if(i<count-1){//内页
				if(curIsHardCover&&(i==1||i==2||i==count-3||i==count-2)){
					page.find(".pageBg").css("background-image","url("+pastedownUrl+")");
				}
				if(curIsHardCover&&(page.hasClass("front-inner")||page.hasClass("back-inner"))){//硬壳装封2封3
					page.find(".hard_right_border").css("background-color",bookConfig.hardCover.spineColor||coverHardSpineDefaultColor);
					page.css("background-color",bookConfig.hardCover.innerColor||coverHardDefaultColor);
					if(page.hasClass("front-inner")){//封2
						page.find(".pageBg").css({right:0});
						page.append(depthLeft);
						page.append("<div class='"+(i%2==0?"odd-shadow":"even-shadow")+"'></div>");
					}else{//封3
						page.append(depthRight);
						page.find(".hard_cover_shadow").addClass("flip_x");//左右翻转
						depthRight.css({right:0});
						page.append("<div class='"+(i%2==0?"odd-shadow":"even-shadow")+"'></div>");
					}
				}else{
					page.append("<div class='"+(i%2==0?"odd-shadow":"even-shadow")+"'></div>");
				}
			}else if(i==count-1){//封底
				page.find(".hard_cover_shadow").css("z-index",1).addClass("flip_x");
			}
			
			if($("#watermark_use").val()=="true"){
				var watermark = $("<div class='watermark'/>");
				for(var k=0;k<4;k++){
					watermark.append("<div class='watermark-item' style='background-image: url("+$("#watermark_imgpath").val()+");opacity:"+(parseInt($("#watermark_opacity").val())/100)+"' />");
				}
				page.append(watermark);
			}
			
			//打赏浮窗
			if(i==count-1&&is_wechat_client()&&$("#isReward").val()=="Y"){
				var rewardArea = $("<div class='rewardArea'>微信打赏</div>");
				page.append(rewardArea);
			}
			
			con.append(page);
			allPageOrigin.push(page);
		}
		resizeHardCoverInnerPageSize();
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
//				leftW = 0;
//				rightW = 7;
			}else	if(curPage<=3){
				leftW  = 0;
			}else if(curPage<maxW){
				leftW = curPage-2;
			}
			if(curPage==pageCount){//封底
				leftW = rightW = 0;
//				leftW = 7;
//				rightW = 0;
			}else	if(curPage>pageCount-2){
				rightW = 0;
			}else if(curPage>pageCount-maxW){
				rightW = pageCount-curPage-2;
			}
			$("#depth_left .depth-img").css({width:leftW});
			$("#depth_right .depth-img").css({width:rightW});
	}
	//加载所有音频
	var loadAudio = function(){
		try{
			var datas = audioDatas_json.datas;
			for(var i in datas){
				var item = datas[i];
				var path = item.audio_path.replace("/html/","");
				var au = new Audio();
				au.src = virgule+path;
				getWXPlay(function(){
					au.load();
				});
				item.audio=au;
				allAudioData.push(item);
			}
		}catch (e) {
			// TODO: handle exception
		}
//		console.log(allAudioData)
	}
	var pauseAudio = function(audio){
		audio.currentTime=0;
		audio.pause();
	}
	var playAudio_new = function(curPage){
		if(curAudio!=null){
			pauseAudio(curAudio);
		}
		for(var i in allAudioData){
			var item = allAudioData[i];
			if(curPage>=item.start && curPage<=item.end){
				curAudio = item.audio;
				getWXPlay(function(){
					curAudio.play();
				});
				break;
			}
		}
	}
	//通过当前页获取音频地址
	var getAudioPath = function(curPage){
		var path = "";
		try{
			var datas = audioDatas_json.datas;
			for(var i in datas){
				var item = datas[i];
				if(curPage>=item.start && curPage<=item.end){
					path = item.audio_path.replace("/html/","");
					break;
				}
			}
		}catch (e) {
			// TODO: handle exception
		}
		return path;
	}
	var playAudio = function(audioPath){
		if(audioWithPage==null){//创建音频
			audioWithPage = new Audio();
			audioWithPage.src = virgule+audioPath;
			getWXPlay(function(){
				audioWithPage.load();
				playCon()
			});
		}else if(audioWithPage.src != audioPath){//更换音频地址
			pauseAudio(audioWithPage);
			if(audioPath!=""){
				audioWithPage.src = virgule+audioPath;
				getWXPlay(function(){
					audioWithPage.load();
					playCon();
				});
			}
		}
	}
	//通过网页音频开关控制播放
	var playCon = function(){
		if($(".audio_btn_open").hasClass("audio_btn_0")){
			audioWithPage.play();
		}
	}
	
	var initBook = function(){
		updateDepth(1);
		$(flipBookCon).turn({
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
//					if(displayMode==2 && !curIsHardCover){
//						if(page==1||page==2){
//							$("#depth_right").hide();
//						}
//						if(page==pageCount||page==pageCount-1){
//							$("#depth_left").hide();
//						}
//					}
					$(".turn-page-tip").remove();
					isTurning = true;
					playTurnPageAudio();
					updateDepth(page);
					var book = $(this),
					currentPage = book.turn('page'),
					pages = book.turn('pages');
					if (page>=2)
						$(flipBookCon+' .front-inner').addClass('fixed');
					else
						$(flipBookCon+' .front-inner').removeClass('fixed');
					if (page<book.turn('pages'))
						$(flipBookCon+' .back-inner').addClass('fixed');
					else
						$(flipBookCon+' .back-inner').removeClass('fixed');
					
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
					loadImg();
					isTurning = false;
					if(displayMode==2){
						if(page>1){
							$("#depth_right").fadeIn();
						}
						if(page<pageCount){
							$("#depth_left").fadeIn();
						}
//						if(page==1){
//							$("#depth_right").css({right:$("#depth_right").attr("data-r")})
//							$("#depth_right").show();
//						}else if(page==pageCount){
//							$("#depth_left").css({left:$("#depth_left").attr("data-l")})
//							$("#depth_left").show();
//						}else{
//							$("#depth_right").css({right:-20})
//							$("#depth_left").css({left:-20})
//							$("#depth_left").show();
//							$("#depth_right").show();
//						}
					}
					if(hasAudio()){
						try{
							var audioPath = getAudioPath(page);
							if(audioWithPage.src.indexOf(audioPath)==-1||audioPath==""){
//						if(curAudio.src.indexOf(audioPath)==-1||audioPath==""){
								playAudio(audioPath);
								playAudio_new(page);
							}
						}catch (e) {
							// TODO: handle exception
						}
					}
//					if(!isMember&&limitCount!=0){
//						var limit_tip = $(".limit_tip");
//						if(limit_tip.length==0){
//							var limit_tip_html = $("<div class='limit_tip' style='position: absolute;width: 100%;height: 100%;top: 0;background-color: rgba(0,0,0,0.5);z-index: 9999;display:none;'>" +
//									"<div style='width: 70%;position: absolute;top:44%;background: #fff;padding: 25px 20px;border-radius: 5px;left: calc(15% - 20px);'>褰撳墠鍙兘瑙傜湅"+limitCount+"椤碉紝鍗囩骇鎴愪細鍛樻柟鍙樉绀哄叏閮ㄩ〉</div></div>");
//							$(flipBookCon).append(limit_tip_html);
//						}
//						if(page<=limitCount){
//							limit_tip.hide();
//						}else{
//							limit_tip.show();
//						}
//					}
					//硬壳且单页 更新正在翻页元素的尺寸
//					if(curIsHardCover&&displayMode==1){
//						var curPageIndex =$(flipBookCon).turn("page")-1;
//						var curPageW = allPageOrigin[curPageIndex].width()+"px";
//						var  curPageH = allPageOrigin[curPageIndex].height()+"px";
//						$(".p-temporal").css({width:curPageW,height:curPageH});
//					}
				},
				start:function(event, pageObject, corner){
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
				cannotTurnNext:function(event,pageObject){
					showMessage("这是最后一页！");
				},
				cannotTurnPrev:function(event,pageObject){
					showMessage("这是第一页！");
				}
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
				$('#bookCon').fadeIn();
				$(".app-loading").remove();
				var bgImg = $("body").attr("data-img");
				if(bgImg.indexOf("url(")>-1){
					var bgPosition = $("#bgPosition").val();
					$("body").css("background","none");
					if(bgPosition == '2'){
						$("body").css({"background-image":bgImg,"background-repeat":"repeat"});
					}else{
						$("body").css({"background-image":bgImg,"background-size":(bgPosition=='0')?'contain':'cover',"background-position":"center","background-repeat":"no-repeat"});
					}
				}else{
					$("body").css("background",bgImg);
				}
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
					$('#Demo').hide();
				},3000);
				if(hasAudio()){
//					playAudio_new(1);
					playAudio(getAudioPath(1));
				}
	 		}
	 	},30);
//		setTimeout(function(){
//			mainCon.hide();
//			$('#bookCon').fadeIn();
//			$(".app-loading").remove();
//			$(mainCon).parent().css("background","");
//		},3000);
		
		initTextClickShow();
		addZoomHandler();
	}
	//加载图片
	var loadImg = function(){
		
		var curPage = $(flipBookCon).turn("page");
		loadPageImg(curPage-3);
		loadPageImg(curPage-2);
		loadPageImg(curPage-1);
		loadPageImg(curPage);
		loadPageImg(curPage+1);
		loadPageImg(curPage+2);
		loadPageImg(curPage+3);
		
		preLoadPageImg(curPage);
	}
//	var pageBgAttr = location.href.split("?")[1];
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
	
	//加载图片到内存中
	var preLoadPageImg=function(curPage){
		
		for(var i=curPage;i<curPage+20;i++){
			if(i>=bookDatas.length){
				break;
			}
			if(i<0){
				continue;
			}
			var img = new Image();
			img.src = bookDatas[i].bgImg;
			img.onload=function(){
				
			}
		}
	}
	
	var loadPageImg = function(pageIndex){
		var curPageBg =  $(flipBookCon).find(".page-wrapper[page="+pageIndex+"]").find(".pageBg");
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
					var flag = true;
					if(curIsHardCover){//硬壳书时候环衬页不需要进行缩放，会出现显示问题
						flag = !curPageBg.parent().hasClass("textureLining");
					}
					if(flag){
						var imgScale = Math.max(1,imgHeight/bookh);
						imgScale = Math.min(imgScale,3);
						curPageBg.css({width:imgScale*100+"%",height:imgScale*100+"%","transform-origin":"0 0","transform":"scale3d("+1/imgScale+","+1/imgScale+",1)"});
					}
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
		var transformCon = $(flipBookCon)[0];
		$(flipBookCon).addClass("animated");//添加回动画的缓动
		transformCon.originX = transformCon.originY = 0;
		transformCon.scaleX = transformCon.scaleY = 1;
		transformCon.translateX = transformCon.translateY = 0;
		
		
		$(flipBookCon).turn("disable",false);
		removeMoveHandler();
		setTimeout(function(){
			if(displayMode==2){
				$("#depth_right,#depth_left").show();
			}
			isShowBig = false;
			$(flipBookCon).css({"transform-origin":"","-webkit-transform-origin":""});
		},300);
	}
	//验证是否可以翻页，如果不可以提示消息
	var validateCanTurnPage = function(){
		var curPages = $(flipBookCon).turn("pages");
		var curPage = $(flipBookCon).turn("page");
		
		
		console.info(curPages+"==="+curPage);
		return true;
	}
	
	
	var hammer = null;
	//添加缩放监听
	var addZoomHandler = function(){
		var transformCon = $(flipBookCon)[0];
		hammer = new Hammer.Manager(transformCon);
		if(typeof transformCon.scaleX === "undefined"){
			Transform(transformCon);
			transformCon.perspective = 0;
		}
		hammer.add(new Hammer.Tap({event: 'doubletap', taps: 2 }));//双击
		hammer.add(new Hammer.Pan({threshold:0,pointers:0}));//拖动
		hammer.add(new Hammer.Tap({event: 'singletap'}));//单击
		hammer.add(new Hammer.Swipe({velocity:0.1})).recognizeWith([hammer.get('pan')]);//滑动
		//缩放
		hammer.add(new Hammer.Pinch({ threshold: 0})).recognizeWith([hammer.get('pan'),hammer.get('singletap')]);

	    hammer.get('doubletap').recognizeWith('singletap');
	    hammer.get('singletap').requireFailure(['doubletap','pinch']);
		
	    hammer.on("swipeleft",function(ev){
	    	if(!isShowBig){
		    	console.info($(flipBookCon).turn("next"));
	    	}
	    });
	    hammer.on("swiperight",function(ev){
	    	if(!isShowBig){
	    		console.info($(flipBookCon).turn("previous"));
	    	}
	    });
	    
	  //鼠标滚动事件
	    var increment = 0.08;
		$(mainCon).bind("mousewheel",function(e){
			var isUp = e.originalEvent.wheelDelta<0;
			if(isUp){//向下滚动
				//下一页
				if(!isShowBig){
			    	$(flipBookCon).turn("next");
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
				//上一页
				if(!isShowBig){
		    		$(flipBookCon).turn("previous");
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
				$(flipBookCon).turn("disable",true);
				//隐藏书的厚度
				$("#depth_right,#depth_left").hide();
				
				$(flipBookCon).data("baseScale",transformCon.scaleX);
				
				//旧的transformOrigin
				var oldTransformOrigin = transformCon.style.transformOrigin||transformCon.style.webkitTransformOrigin;
				
				
				//计算缩放中心点
				var centerX = ev.center.x;
				var centerY = ev.center.y;
				
				
				centerX =centerX - $(flipBookCon).offset().left;
				centerY =centerY - $(flipBookCon).offset().top;
				
				centerX/=transformCon.scaleX;
				centerY/=transformCon.scaleY;
				var percentCenter = centerX+"px "+centerY+"px";
				
				$(flipBookCon).css({"transform-origin":percentCenter,"-webkit-transform-origin":percentCenter});
				
				$(flipBookCon).removeClass("animated");//添加回动画的缓动
				
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
				transformCon.scaleX = transformCon.scaleY = $(flipBookCon).data("baseScale")*ev.scale;
				if(transformCon.scaleX!=1){
					addMoveHandler();
					isShowBig = true;
				}
			}
	    });
	    hammer.on("pinchend", function(event){
	    	isPinching = false;
	    	$(flipBookCon).addClass("animated");//添加回动画的缓动
	    	if(transformCon.scaleX<1){
	    		resetZoomBookCon();
	    	}else if(transformCon.scaleX>5){
	    		transformCon.scaleX = transformCon.scaleY = 5;
	    	}
	    });
	    
		hammer.on("doubletap",function(event){
			if(isTurning)return;
			if(transformCon.scaleX==1){
				console.info(event);
				//点击位置置入屏幕中心
				var clickX = event.clientX||event.center.x||(event.pointers&&event.pointers[0]&&event.pointers[0].clientX)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientX);
				var clickY = event.clientY||event.center.y||(event.pointers&&event.pointers[0]&&event.pointers[0].clientY)||(event.changedTouches&&event.changedTouches[0]&&event.changedTouches[0].clientY);
				
				clickX -=$(flipBookCon).offset().left;
				clickY -=$(flipBookCon).offset().top;
				
				clickX/=transformCon.scaleX;
				clickY/=transformCon.scaleY;
				
				var percentCenter = clickX+"px "+clickY+"px";
				$(flipBookCon).css({"transform-origin":percentCenter,"-webkit-transform-origin":percentCenter});
				
				//放大
				transformCon.scaleX = transformCon.scaleY = 2;
				//禁止翻页
				$(flipBookCon).turn("disable",true);
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
						$(flipBookCon).turn("page",pageIndex);
					}else if(textArea.specialEffectType=="web"){
						//跳转外链
//						openLink(textArea.linkValue,"inner");
						openLink(textArea.linkValue);
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
	//在打开链接地址
	var openLink = function(url,target){
		if(target == "inner"){
			openLinkInner(url);
		}else{
			window.open(url);
		}
	}
	//在页面内打开链接，内嵌
	var openLinkInner = function(url){
		var innerLinkFrame = $("#innerLinkFrame");
		var laterShow = false;
		if(innerLinkFrame.length==0){
			innerLinkFrame = $("<div id='innerLinkFrame'><iframe frameborder=\"0\" width='100%' height='100%'></iframe><div class='close-btn'></div></div>").appendTo($("body"));
			laterShow = true;
			innerLinkFrame.find(".close-btn").click(function(){
				innerLinkFrame.removeClass("frame-show");
				innerLinkFrame.find("iframe").attr("src","");
			});
		}
		innerLinkFrame.find("iframe").attr("src",url);
		if(laterShow){
			setTimeout(function(){
				innerLinkFrame.addClass("frame-show");
			},100);
		}else{
			innerLinkFrame.addClass("frame-show");
		}
	}
	
	//添加移动监听
	var addMoveHandler = function(){
		var ele = $(flipBookCon)[0];
		removeMoveHandler();
		hammer.on("panstart",function(ev){
			$(flipBookCon).removeClass("animated");//移出动画的缓动
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
				$(flipBookCon).turn("disable",false);
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
		$(flipBookCon).turn("disable",true);
	}
	
	//绑定事件
	var bindEvent = function(){
		$(window).bind("resize",function(){
			mesureSize();
			//如果是硬壳书，需要手动重置内页大小
			resizeHardCoverInnerPageSize();
			
			setTimeout(function(){
				$(flipBookCon).turn("size",bookw,bookh);//重置书的大小
			},100);
			$(flipBookCon).turn("display",(displayMode==1?"single":"double"));
			updateSingleDoubleView();
			resetZoomBookCon();
		});
		

		//单双页切换开关
		$("#main").on("click",".double-single-ctrl-btn",function(){
			var currentIsDouble = $(this).hasClass("double");
			console.info("currentIsDouble:"+currentIsDouble);
			displayModeToggle = currentIsDouble?"single":"double";
			if(currentIsDouble){
				$(this).addClass("single");
				$(this).removeClass("double");
			}else{
				$(this).removeClass("single");
				$(this).addClass("double");
			}
			$(window).trigger("resize");
		});
		
		/*if (isIOS) {
			mainCon.append($("<div id=\"Demo\"><div class='an_de'>请按<img class='iosSC' src='/youtuShare/pub/img/iosSC.png'></i>然后点选添加到主屏幕</div><i class='icon_dow'></i></div>"));
			$(mainCon).click(function(){
			    $("#Demo").hide();
			});
		
		}*/
		//alert(navigator.userAgent)
		var nua = navigator.userAgent; 
	    if(isMobile) {   
	    	mainCon.append($("<div id=\"Demo\"><div class='an_de'>手机横屏可对页显示，效果更佳！</div><i class='icon_dow'></i></div>"));
//			$(mainCon).click(function(){
//			    $("#Demo").hide();
//			});
//			setTimeout(function(){
//			$('#Demo').hide();
//			},6000);

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
					if(displayMode==2){
						this.find(".pageBg").css({positon:"absolute",width:innerW,height:innerH,top:innerPaddingV+"px"});
						this.find(".depth").css({width:innerPaddingH+"px",top:innerPaddingV+"px",bottom:innerPaddingV+"px"});
					}else{//单页时，去掉边距
						this.find(".pageBg").css({positon:"absolute",width:"100%",height:"100%",top:"0px"});
					}
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
		}else{
			$.each(allPageOrigin,function(e){
				if(e>0 && e<allPageOrigin.length-1){
					if(displayMode==1){
						this.removeClass("noHard").find(".pageBg").removeClass("noHard")
					}else if(displayMode==2){
						this.addClass("noHard").find(".pageBg").addClass("noHard")
					}
				}
			})
		}
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
			$(flipBookCon).removeClass("double").addClass("single");
			$(".depth").hide();
			$("#depth_left,#depth_right").hide();
		}else{
			$(flipBookCon).addClass("double").removeClass("single");
			$(".depth").show();
			$("#depth_left,#depth_right").show();
//			var curPage = $(flipBookCon)
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
		
		if(isMobile){
			mainCon.removeClass("theme_back_white");
		}
		if(isIOS){
			mainCon.addClass("theme_radius");
		}
		
		curIsHardCover = (typeof bookConfig != 'undefined')&&bookConfig.hardCover&&bookConfig.hardCover.enable;
	}
	/**
	 * 判断当前页面是否在微信客户端打开
	 */
	function is_wechat_client(){  
		var ua = navigator.userAgent.toLowerCase();  
		if(ua.match(/MicroMessenger/i)=="micromessenger"){  
			return true;  
		}else{  
			return false;  
		}  
	}  
	var initBookCon =  function(){
		mainCon.append($("<div id=\"bookCon\"><div id=\"flipbook\" class='animated'></div></div>"));
		if(!curIsHardCover){//硬壳书 厚度放到了封2，封3 内
			mainCon.append(depthLeft);
			mainCon.append(depthRight);
//			var bookCon_id = $("<div id=\"bookCon\"></div>");
//			var flipbook_id = "<div id=\"flipbook\" class='animated'></div>";
//			mainCon.append(bookCon_id.append(depthLeft).append(flipbook_id).append(depthRight));
//		}else{
//			mainCon.append($("<div id=\"bookCon\"><div id=\"flipbook\" class='animated'></div></div>"));
		}
		$('#bookCon').hide();
	}
	//初始化控制组件
	var initControl = function(){
		if(isMobile){//移动版
			initMobileControl();
		}else{//pc版
			initPcControl();
			mainCon.append($("<div class='pn'><div class='prevn'><div class='prevn-l-img'></div></div><div class='nextp'><div class='nextp-r-img'></div></div></div>"));
			mainCon.find(".prevn").click(function(e){
				$(flipBookCon).turn("previous");
			});
			mainCon.find(".nextp").click(function(e){
				$(flipBookCon).turn("next");
			});
		}
	}
	var turnLoop = function(){
		var curPage = $(flipBookCon).turn("page");
		if(curPage==pageCount){
			$(flipBookCon).turn("page",1);
		}else{
			$(flipBookCon).turn("next");
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
		$(flipBookCon).bind("turning", updatePageNumShow);
		updatePageNumShow(null,1,null);
		
		pageCtlCon.find(".page-btn").click(function(e){
			if($(this).hasClass("first-page-btn")){
				$(flipBookCon).turn("page",1);
			}else if($(this).hasClass("pre-page-btn")){
				$(flipBookCon).turn("previous");
			}else if($(this).hasClass("next-page-btn")){
				$(flipBookCon).turn("next");
			}else if($(this).hasClass("last-page-btn")){
				$(flipBookCon).turn("page",pageCount);
			}
			e.stopPropagation();
		});
		pageCtlCon.find(".goPage").click(function(e){
			var inputPageNum = pageCtlCon.find("#inputPageNum").val();
			if(/[0-9]+/.test(inputPageNum)){
				inputPageNum = Math.max(inputPageNum,1);
				inputPageNum = Math.min(inputPageNum,pageCount);
				$(flipBookCon).turn("page",inputPageNum);
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
//		var topBar = $("<div id='topBar_mobile' class='ctl_bar'><div class='logo' style='background-image:"+((typeof(logo)=="undefined"||logo=="")?"none":logo)+";'></div><div class='ctl_btn use_center_btn'></div><div class='ctl_btn use_view_btn'></div></div>");
		
		var topBar = $("<div id='topBar_mobile' class='ctl_bar'></div>");
		topBar.append("<div class='logo' style='background-image:"+((typeof(logo)=="undefined"||logo=="")?"none":logo)+";'></div>");
		if($("#card_isUse").val()=="true"){
			topBar.append("<div class='ctl_btn use_center_btn'></div>");
		}
		topBar.append("<div class='ctl_btn use_view_btn'></div>");
		
		mainCon.append(topBar);
		if(typeof(contents_json)!="undefined"){
			var contents_m_icon_btn = $("<div class='contents_m_icon_btn'></div>");
			topBar.append(contents_m_icon_btn);
			var contents_m_area = $("<div class='contents_m_body'><div class='contents_m_list'>"+getMulu(false)+"</div></div>");
			mainCon.append(contents_m_area)
			contents_m_icon_btn.click(function(){
				var isShow = $(this).attr("isShow");
				if(isShow=="y"){
					isShowContents_m(true);
					$(this).attr("isShow","n");
					enableScroll();
				}else{
					isShowContents_m(false);
					$(this).attr("isShow","y");
					disableScroll();
				}
			})
			contents_m_area.on("click",".contents_m_list p",function(){
				var inputPageNum = $(this).attr("data-key");
				if(/[0-9]+/.test(inputPageNum)){
					inputPageNum = Math.max(inputPageNum,1);
					inputPageNum = Math.min(inputPageNum,pageCount);
					$(flipBookCon).turn("page",inputPageNum);
					isShowContents_m(false);
				}
			});
		}
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
		//音频播放图标
		if(hasAudio()){
			var audio_btn = $("<div class='audio_btn'><div class='audio_btn_open audio_btn_0'></div></div>");
			bottomBar.append(audio_btn);
			bottomBar.on("click",".audio_btn_0",function(){
				pauseAudio(audioWithPage);
				audio_btn.find(".audio_btn_open").removeClass("audio_btn_0").addClass("audio_btn_1");
			});
			bottomBar.on("click",".audio_btn_1",function(){
				audio_btn.find(".audio_btn_open").removeClass("audio_btn_1").addClass("audio_btn_0");
				getWXPlay(function(){
					playCon();
				});
			});
		}
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
		//个人中心
		if($("#card_isUse").val()=="true"){
			var UserCenter = $("<div id='UserCen'><div class='close-user'></div>" +
					"<div class='Cen_EWtop'>" +
					"<div class='EWtop_img'><img src='"+$("#card_qrcode").val()+"' alt='' class='' /></div></div>" +
					"<div class='Cen_MEbottom'>" +
					"<div class='MEbottom_title'><a href=''>"+$("#card_name").val()+"</a></div>" +
					"<div class='MEbottom_mess'>" +
					"<div class='mess_iage' style='position:relative'><a class='a_img a_img_1' href='javascript:viod(0);'></a><span>手机</span>:<a href='tel:"+$("#card_mobile").val()+"' class='spa_val'>"+$("#card_mobile").val()+"</a></div>" +
					"<div class='mess_iage'><a class='a_img a_img_2' href='javascript:viod(0);'></a><span>电话</span>:<a href='tel:"+$("#card_tel").val()+"' class='spa_val'>"+$("#card_tel").val()+"</a></div>" +
					"<div class='mess_iage'><a class='a_img a_img_3' href='javascript:viod(0);'></a><span>QQ</span>:<span class='spa_val'>"+$("#card_qqNo").val()+"</span></div>" +
					"<div class='mess_iage'><a class='a_img a_img_4' href='javascript:viod(0);'></a><span>微信</span>:<span class='spa_val'>"+$("#card_wxNo").val()+"</span></div>" +
					"<div class='mess_iage'><a class='a_img a_img_5' href='javascript:viod(0);'></a><span>邮箱</span>:<span class='spa_val'>"+$("#card_email").val()+"</span></div>" +
					"<div class='mess_iage'><a class='a_img a_img_6' href='javascript:viod(0);'></a><span>网址</span>:<a href='"+$("#card_url").val()+"' class='spa_val'>"+$("#card_url").val()+"</a></div>" +
					"<div class='mess_iage'><a class='a_img a_img_7' href='javascript:viod(0);'></a><span>地址</span>:<span class='spa_val Addr_spa'>"+$("#card_addr").val()+"</span></div>" +
							"<div style='clear: both;'></div>" +
					"</div></div>" +
			"</div>");
			mainCon.append(UserCenter);
		}
//		if ($("#card_qqNo").val()) {
//			$(this).pr
//		}
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
			$(flipBookCon).turn("disable",false);
			var page_id = $(this).attr("data-page-id");
			$(flipBookCon).turn("page",page_id);
			themeView.toggleClass("opacity_show");
			e.stopPropagation();
		});
		bottomBar.find(".theme_view_btn").click(function(e){
			if(pageControlCon.hasClass("opacity_show")==false){
				themeView.toggleClass("opacity_show");
				if(themeView.hasClass("opacity_show")){
					//初始化列表
					initThemeList();
					$(flipBookCon).turn("disable",true);
					enableScroll();
				}else{
					$(flipBookCon).turn("disable",false);
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
		var hideUser = function() {
			if(UserCenter.css("visibility")=="hidden"){
				UserCenter.css("visibility","visible");
				themeView.css("display","none");
			}else{
				UserCenter.css("visibility","hidden");
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

		topBar.on("click",".use_center_btn",function(e){
			var Bo_back_img = $("body").css("background-image");
			console.log($(".spa_val"));
			
			$(".spa_val").each(function() {
				if($(this).text() == "") {
					$(this).parent().css("display","none");
				}
			})
			
			$("#UserCen").css("background-image",Bo_back_img)
			hideUser();
			e.stopPropagation();
		});
		$("#UserCen").on("click",".close-user",function(e){
			hideUser();
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
				$(flipBookCon).turn("page",inputPageNum);
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
//			$(flipBookCon).turn("next");
//		});
//		$("#prevBtn").click(function(){
//			$(flipBookCon).turn("previous");
//		});
		
		//topBar
		var topBar = $("<div id='topBar_pc' class='ctl_bar'><a target='_blank' href='/'><div class='logo'></div></a></div>");
		
		//去除logo
		if($("#isPaid").val()=="true"){
			topBar.find(".logo").remove();
		}
		
		mainCon.prepend(topBar);
		var sharePlatHtml = "";
		var help_tbn_style = "";
		if($(".share-plat-win").length>0){
			sharePlatHtml = "<div title='朋友分享' class='ctl_btn share_btn'/>";
			help_tbn_style = "left:calc(50% - 288px);";
		}
		//bottomBar
		var bottomBar = $("<div id='bottomBar_pc' class='ctl_bar'>"+
		"<div class='ctl_btn help_icon_btn' style='"+help_tbn_style+"'><div class='img'></div></div>"+sharePlatHtml+
		"<div class='ctl_btn theme_view_btn'/>"+
		"<div class='page-ctrl-con'></div>"+
		"<div class='ctl_btn play-ctrl-btn play-ctrl-btn-play'></div>"+
		"<div class='ctl_btn full-screen-btn'/>"+
		"</div>");
		if(typeof(contents_json)!="undefined"){
			var contentsArea = $("<div class='ctl_btn contents_icon_btn'></div>");
			var contentsList = $("<div class='contents_body'><div class='contents_list'>"+getMulu(curIsHardCover)+"</div></div>");
			bottomBar.append(contentsArea.append(contentsList));
			bottomBar.on("click",".contents_icon_btn",function(){
				contentsList.toggle();
			})
			bottomBar.find(".contents_list p").click(function(){
				var inputPageNum = $(this).attr("data-key");
				if(/[0-9]+/.test(inputPageNum)){
					inputPageNum = Math.max(inputPageNum,1);
					inputPageNum = Math.min(inputPageNum,pageCount);
					$(flipBookCon).turn("page",inputPageNum);
				}
			});
		}else{
			bottomBar.find(".help_icon_btn").css("left","calc(50% - 362px)");
		}
		mainCon.append(bottomBar);
		if(hasAudio()){
			var audio_btn = $("<div class='audio_btn' style='transform: scale(1);-webkit-transform: scale(1);'><div class='audio_btn_open audio_btn_0'></div></div>");
			bottomBar.append(audio_btn);
			bottomBar.on("click",".audio_btn_0",function(){
				pauseAudio(audioWithPage);
				audio_btn.find(".audio_btn_open").removeClass("audio_btn_0").addClass("audio_btn_1");
			});
			bottomBar.on("click",".audio_btn_1",function(){
				audio_btn.find(".audio_btn_open").removeClass("audio_btn_1").addClass("audio_btn_0");
				getWXPlay(function(){
					playCon();
				});
			});
		}
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
		
		//全屏按钮
		bottomBar.on("click",".full-screen-btn",function(){
			callFullScreen();
			$(this).removeClass("full-screen-btn").addClass("exit-full-screen-btn");
		});
		//退出全屏
		bottomBar.on("click",".exit-full-screen-btn",function(){
			callExitFullScreen();
			$(this).removeClass("exit-full-screen-btn").addClass("full-screen-btn");
		});
		
		//查看PDF
		if(pdfPath&&pdfPath.length>6){
			var r = "";
			var bgAudioUrlPath =  $("#musicUrl").val();
			if(bgAudioUrlPath == "" && !hasAudio()){
				r = "style='right:calc(50% - 240px);'";
			}
			
			var viewPdfBtn = $("<div "+r+" id='viewPdfBtn'><a target='_blank' href='"+getPdfViewPath()+"'></a></div>");
			bottomBar.append(viewPdfBtn);
		}
		
		$(flipBookCon).on("mousemove",function(event){
			if(isShowBig){
				$(flipBookCon).css("cursor","default");
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
					$(flipBookCon).css("cursor","pointer");
					return;
				}
			}
			$(flipBookCon).css("cursor","default");
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
			var itemCon = $("<div class='themeItemCon' id='themeItemCon'></div>");
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
				var themeItem = $("<div class='themeItem' data-page-id='"+(i+1)+"' data-index='"+pageObj.index+"' title='"+pageInfo+"'><p class='pageInfo' >"+pageInfo+"</p><div class='theme_img' style='background-image: url("+curImgUrl+");'></div><p>"+(i+1)+"</p></div>");
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
		}
		themeView.on("click",function(){
			if($(this).find(".themeItem_ctr").length>0){
			}else{
				themeView.removeClass("opacity_show");
			}
		})
		themeView.on("click",".theme-con",function(event){
			event.stopPropagation();
			$(this).addClass("opacity_show");
		})
		themeView.on("click",".themeItem .changePageBtn",function(e){
			parent.updatePageModalShow($(this).parents(".themeItem"));
			e.stopPropagation();
		})
		themeView.on("click",".themeItem",function(e){
			if($(this).hasClass("themeItem_ctr")){
//				parent.updatePageModalShow($(this));
				e.stopPropagation();
				return;
			}
			$(flipBookCon).turn("disable",false);
			var page_id = $(this).attr("data-page-id");
			$(flipBookCon).turn("page",page_id);
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
				$(flipBookCon).turn("page",inputPageNum);
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
//				var viewPdfBtn = $("<div id='viewPdfBtn'><a target='_blank' href='"+getPdfViewPath()+"'>PDF</a></div>");
				var viewPdfBtn = $("<div id='viewPdfBtn'><a target='_blank' href='"+getPdfViewPath()+"'></a></div>");
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
			mesureBottomBtnPositoinMobile();
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
				var pc_logo = "";
				if(logo.indexOf("zj03-white.svg")>-1){
					if($("#isExportHtml").val()=="true"){//本地导出
						pc_logo = "url(img/youtuShare/style3/img/logo.svg);";
					}else{
						pc_logo = "url(/youtuShare/style3/img/logo.svg);";
					}
				}else {
					pc_logo = logo;
				}
				$("#bottomBar_pc").append("<div><div class='tjLoGo' style='background-image:"+pc_logo+" !important'></div></div>");
			}
			
		}
		$("body").attr("onbeforeunload","return closePage()");
	}
	//测量底部按钮位置
	var mesureBottomBtnPositoinMobile = function(){
		var div = $("#bottomBar>div");
		var divCount = div.length;
		var j = 100/(divCount-1);
		if(divCount==3){
			$(".page-ctrl-btn").css("left", "46%");
			$(".play-ctrl-btn").css("left", "92%");
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
	}
	
	
	var checkUpdateCache = function(){//判断是否更新缓存
		$.post("/uwp/newServlet?serviceName=ShareMag&medthodName=updateCache",{shareID:$("#shareID").val()},function(){});
	}
	$(window).on("load",function(){
		$("html").css("position","fixed");//页面固定，手机不让下拉IOS有作用，Android无用
		
		mainCon.hide();
		initBookCon();
		checkDevice();
		makePagesData();//组织数据
		initControl();
		bindEvent();
		mesureSize();
		initData();
//		loadAudio();
		initAudio();
		checkUpdateCache();
		bindLogoClick();
		
		
		document.onkeyup = function(event) {
			console.log(event);
//			alert(event.keyCode);
			if (event.code=="Space" || event.code=="ArrowRight"|| event.code=="ArrowDown") {
				$(flipBookCon).turn("next");
			}else if (event.code=="ArrowUp" || event.code=="ArrowLeft") {
				$(flipBookCon).turn("previous");
			}
		}
		
	});
	
	var bindLogoClick = function(){
		var logoPath = $("#logoPath").val();
		
		if($("#isExportHtml").val()=="true"){//本地导出
			
		}else{
			if(logoPath=="null"||logoPath=="" || typeof(logoPath) == "undefined"){
				logoPath = "/";
			}
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
		var pageNum = parseInt(pageCount);
		
		var getImgUrlByIndex = function(index){
			var temp = "00000"+index;
			return imgPath+temp.substr(temp.length-3);
		}
		var pageObj;
		var pagesOrder_back = [];
		try{
			pagesOrder_back = pagesOrder;//兼容原来的代码
		}catch(e){}
		if(pagesOrder_back.length>0){
			console.log(pagesOrder_back.length)
			for(var i in pagesOrder_back){
				pageObj = {pageID:pagesOrder_back[i].oldpage+1,
						bgImg:getImgUrlByIndex(pagesOrder_back[i].oldpage)+".jpg?r="+imgRandom,
						preview:getImgUrlByIndex(pagesOrder_back[i].oldpage)+"_m.jpg?r="+imgRandom,
						pageInfo:"",
						items:[],
						index:pagesOrder_back[i].oldpage
				};
				bookDatas.push(pageObj);
				if(typeof textAreaData!== "undefined"){
					try{
						pageObj.pageInfo = textAreaData.pages[i].pageInfo;
						pageObj.items = textAreaData.pages[i].textArea;
					}catch (e) {
						// TODO: handle exception
					}
				}
			}
		}else{
			for(var i=0;i<pageNum;i++){
				pageObj = {pageID:i+1,
						bgImg:getImgUrlByIndex(i)+".jpg?r="+imgRandom,
						preview:getImgUrlByIndex(i)+"_m.jpg?r="+imgRandom,
						pageInfo:"",
						items:[],
						index:i
				};
				bookDatas.push(pageObj);
				if(typeof textAreaData!== "undefined"){
					try {
						pageObj.pageInfo = textAreaData.pages[i].pageInfo;
						pageObj.items = textAreaData.pages[i].textArea;
					} catch (e) {
						// TODO: handle exception
					}
				}
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
	$("<div class='form_mask_phone' style='display:none;'></div>").appendTo($("body"));
	var audioCon = $("<div class='u-audio1'><div class='audio_open1 css_sprite11'></div></div>");
	var audio = $("<div class='u-audio'><div class='audio_open'></div></div>");
	var audio2 = $("<div class='u-audio'><div class='audio_open'></div></div>");
	var yinxiao = $("<div class='y-audio'><div class='y_open'></div></div>");
	var yinxiao2 = $("<div class='y-audio'><div class='y_open'></div></div>");
	$("<div class='setting_form phone'><p class='form_title'><span>设置</span><span class='close'>X</span></p>" +
			"<div class='scrollBox'><div class='item'>" +
			"<div class='title'>&nbsp;&nbsp;&nbsp;翻页音效开关" +
			"<div class='fy'></div>" +
			"</div></div></div>" +
			"</div>").appendTo($("body"));
	
	$("<div class='setting_model mac'><p class='form_title'><span class='closemac'>X</span></p>" +
			"<div class='scrollmod'><div class='item'>" +
			"<div class='title'>&nbsp;&nbsp;&nbsp;翻页音效开关" +
			"<div class='fy-mac'></div>" +
			"</div></div></div>" +
	"</div>").appendTo($("body"));
	
	var scrollBoxmac = $("<div class='scrollmod2'><div class='item2'>" +
			"<div class='title2'>&nbsp;&nbsp;&nbsp;背景音乐开关" +
			"<div class='bj-mac'></div>" +
			"</div></div></div>");
	$(".setting_model").append(scrollBoxmac);
	var scrollBox = $("<div class='scrollBox2'><div class='item2'>" +
			"<div class='title2'>&nbsp;&nbsp;&nbsp;背景音乐开关" +
			"<div class='bj'></div>" +
	"</div></div></div>");
	$(".setting_form").append(scrollBox);
	$(".bj").append(audio);
	$(".bj-mac").append(audio2);
	$(".fy").append(yinxiao);
	$(".fy-mac").append(yinxiao2);
	if(isMobile){
		if(!hasAudio()){
			$("#bottomBar").append(audioCon);
		}
//		audioCon.css("right","90px");
//		audioCon.css("left","calc(26% + 10px)");
		if(bgAudioUrl == ""){
//			$(".u-audio").find(".audio_open").removeClass("css_sprite01").addClass("css_sprite02");
			$(".u-audio1").remove();
			return;
		}else{
			$(".u-audio1").find(".audio_open1").addClass("css_sprite11");
//			$(".u-audio").find(".audio_open").addClass("css_sprite01");
		}
	}else{
		if(!hasAudio()){
			$("#bottomBar_pc").append(audioCon);
			audioCon.css("right","90px");
		}
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
	 $(".setting_form").find(".close").on('click',function(e){
		 var i = 100;
		 var t = setInterval(function() {
			i -= 5;
			if(i<=0){
				clearInterval(t);
			}
			$(".setting_form").css("transform","translateX("+i+"%)");
			$("#main").css("transform","translateX("+i+"%)");
		},10)
		$(".form_mask_phone").css("display","none");
	 });
	 $("body").on('click',".setting_model .closemac",function(e){
		$(".setting_model").hide();
		 $(".form_mask_phone").css("display","none");
	 });
	 if($("#closeTurnMusic").val() == "N"){
		 $(".y-audio").find(".y_open").addClass("y_sprite02");
	 }else{
		 $(".y-audio").find(".y_open").addClass("y_sprite01");
		 
	 }
   $(".u-audio1").find('.audio_open1').on('click',function(e){
	   console.log(">>>")
 	  if(isMobile){
// 		 $(".setting_form").css("transform","translate3d(340px, 0px, 0px)");
// 		 $("#main").css("transform","translate3d(340px, 0px, 0px)");
// 		$(".setting_form").animate({transform:"translateX(260px)"},500);
//		 $("#main").animate({transform:"translateX(260px)"},500);
		 
		 var i = 0;
		 var t = setInterval(function() {
			i += 5;
			if(i>=100){
				clearInterval(t);
			}
	 		 $(".setting_form").css("transform","translateX("+i+"%)");
	 		 $("#main").css("transform","translateX("+(i-20)+"%)");
		},10)
		$(".form_mask_phone").css("display","block");
 	  }else{
 		  $(".setting_model").css("display","block");
 		  $(".form_mask_phone").css("display","block");
 	  }
	});
   $(".u-audio").find('.audio_open').on('click',function(e){
	   if(bgAudio.paused){
		   bgAudio.play();
	   }else{
		   bgAudio.pause();
	   }
	   e.preventDefault();
   });
   
   $(".y-audio").find('.y_open').on('click',function(e){
	   if( $("#closeTurnMusic").val() == "Y"){
		   $(".y-audio").find(".y_open").removeClass("y_sprite01").addClass("y_sprite02");
		   $("#closeTurnMusic").val("N");
	   }else{
		   $(".y-audio").find(".y_open").removeClass("y_sprite02").addClass("y_sprite01");
		   $("#closeTurnMusic").val("Y");
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
function getMulu(curIsHardCover){
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
	return listStr;
}
//function nextPage(){
//	$(flipBookCon).turn("next");
//}
//function previousPage(){
//	$(flipBookCon).turn("previous");
//}
function closePage(){
	xcx_close_audio.pause();
}
$("body").on("click",".rewardArea",function(){
	location.href="http://www.360youtu.com/uwp/weixin/Shop/ebookReward.jsp?shareID="+$("#shareID").val();
//	mainCon.append("<iframe id='rewardIframe' src='http://www.360youtu.com/uwp/weixin/Shop/ebookReward.jsp?shareID="+$("#shareID").val()+"'></iframe>");
})