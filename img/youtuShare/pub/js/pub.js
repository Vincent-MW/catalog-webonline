var h5TextArea={
		_serachicon:$(".searchicon"),
		_searchResult:$(".searchResult"),
		_msgicon:$(".tomsg"),
		_textAreaMask:$(".textArea"),
		_readerNo:$(".showYDL"),
		_pageo:$(".page-no"),
		_textData:$(".popTextInfo"),//老版H5文本数据
		_textDataSize:$(".popTextInfo").length,
		_loadingHtml:$("<div class='msg-loading'><div></div></div>"),
		_startTime:0,
		_loadTime:1000,
		_shareID:$("#shareID").val(),
		searchText:function(searchText){
			var resultData = [];
			if(this._textDataSize>0){//老版本
				for(var i=0;i<this._textDataSize;i++){
					var text = $(this._textData[i]).attr("poptextinfostr");
					var id = $(this._textData[i]).attr("comid");
					if(text.indexOf(searchText)>-1){
						var json = {"id":id,"text":text};
						resultData.push(json);
					}
				}
			}else{//新版本
				try{
					for(var i in allTriggerDatas){
						for(var j in allTriggerDatas[i]){
							var click = allTriggerDatas[i][j].click;
							if(click.length>0&&click[0].type=="popTextInfo"){
								var text=click[0].text;
								if(text.indexOf(searchText)>-1){
									var json = {"id":j,"text":text};
									resultData.push(json);
								}
							}
						}
					}
				}catch (e) {
					// TODO: handle exception
				}
			}
			
			return resultData;
		},
		updatePageInfo:function(index){
			try{
				var cur_page  = car2._pageNow+1;
				$(".page-no>p").html(cur_page+"/"+car2._pageNum);
			}catch (e) {
				// TODO: handle exception
			}
		},
		show:function(){
			this._serachicon.show();
			this._readerNo.show();
			this._pageo.show();
			this.scaleSearchIconByAudioIcon();
		},
		scaleSearchIconByAudioIcon:function(){
			var scale = $(".u-audio").css("transform");
			$(".searchicon").css("transform",scale);
		},
		findPageNo:function(comid){
			var isfind = false;
			var num = 0;
			for(var i=0;i<car2._page.length;i++){
				var subDiv = $(car2._page[i]).find("div");
				for(var j=0;j<subDiv.length;j++){
					if($(subDiv[j]).attr("comid")==comid){
						isfind = true;
						break;
					}
				}
				num = i+1;
				if(isfind){
					break;
				}
			}
			return num;
		},
		appendHtml_msg:function(){
			var main = $("<div class='msg-head'>" +
					"<div class='msg-tips'></div>" +
					"<textarea class='msg-textarea' placeholder=''></textarea>" +
					"<div class='msg-btn'><div>提交</div></div>" +
					"</div>" +
					"<div class='msg-body'></div>");
			this._textAreaMask.append(main);
			this._textAreaMask.find(".msg-body").append(this._loadingHtml);
			
			//开始请求时间
			this._startTime = new Date().getTime();
			this.getData_msg();
		},
		tipMsg:function(text){//提示信息
			$(".msg-tips").html(text);
		},
		getData_msg:function(){//从服务器获取当前H5的留言或评论数据
			var url="/uwp/newServlet?serviceName=UserCenterMag&medthodName=getComment";
			$.get(url,{"shareID":this._shareID},function(data){
				if(data.status){
					h5TextArea.writeData_json(data.msg);
				}
			},'json');
		},
		postData_msg:function(text){
			var url = "/uwp/newServlet?serviceName=UserCenterMag&medthodName=submitComment";
			$.post(url,{"shareID":this._shareID,"commentContent":text},function(data){
				if(data){
					h5TextArea.writeData_text(text);
				}else{
					h5TextArea.tipMsg("提交留言出错，请重试！");
				}
			});
		},
		writeData_json:function(data){//输出数据（data是json格式数据）
			var curTime = new Date().getTime();
			var reqTime = curTime-h5TextArea._startTime;
			var html = "";
			for(var i in data){
				html +="<p>匿名："+data[i].Content+"</p>";
			}
			if(reqTime>this._loadTime){
				$(".msg-loading").remove();
				$(".msg-body").html(html);
			}else{
				setTimeout(function(){
					$(".msg-loading").remove();
					$(".msg-body").html(html);
				},this._loadTime-reqTime);
			}
		},
		writeData_text:function(data){//输出数据（data是文本格式数据）
			var pElement = $(".msg-body").find("P");
			data = "<p>匿名："+data+"</p>";
			if(pElement.length>0){
				$(".msg-body").find("p:first-child").before(data);
			}else{
				$(".msg-body").html(data);
			}
		}
		
}
//==========检索开始===========//
try{
	h5TextArea._serachicon.click(function(){
		var dataType = $(this).attr("data-type");
		if(dataType!="search"){
			h5TextArea._searchResult.toggle();
		}
	});
	h5TextArea._searchResult.find(".searchicon").click(function(){
		var text = $(this).parent().find("input").val();
		if($.trim(text).length>0){
			var html = "";
			var returnData = h5TextArea.searchText(text);
			if(returnData.length==0){
				h5TextArea._searchResult.find(".search-body").html("未搜索到数据！");
				return;
			}
			for(var i=0;i<returnData.length;i++){
				var pageID = $(document).find("div[comid='"+returnData[i].id+"']").parent().attr("pageid");
				html +="<p page-id='"+pageID+"'>P"+h5TextArea.findPageNo(returnData[i].id)+"："+returnData[i].text.replace(/<br>/g,"").replace(/<br\/>/g,"").replace(/\n/g,"")+"</p>";
			}
			h5TextArea._searchResult.find(".search-body").html(html);
		}else{
			h5TextArea._searchResult.find(".search-body").html("请输入要搜索的字符！");
		}
	});
	h5TextArea._searchResult.find(".search-body").on("click","p",function(e){
		var pageID = $(this).attr("page-id");
		car2.pageTurnTo(pageID);
		e.stopPropagation();
	});
	h5TextArea._searchResult.find(".search-body").on("click",function(){
		h5TextArea._searchResult.hide();
	});
}catch (e) {
	// TODO: handle exception
}
//==========检索结束===========//
//==========留言开始===========//
h5TextArea._msgicon.click(function(){
	h5TextArea._textAreaMask.toggle();
	var html = h5TextArea._textAreaMask.html();
	if(html==""){
		h5TextArea.appendHtml_msg();
	}
});
h5TextArea._textAreaMask.on("click",".msg-btn",function(e){
	var submitMsg = $(".msg-textarea").val();
	if($.trim(submitMsg)==""){
		h5TextArea.tipMsg("请输入您的留言内容！");
		$(".msg-textarea").focus();
		return;
	}
	h5TextArea.tipMsg("");
	h5TextArea.postData_msg(submitMsg);
	e.stopPropagation();
});
h5TextArea._textAreaMask.on("click",".msg-body",function(){
	h5TextArea._textAreaMask.hide();
});
//==========留言结束===========//
$(".showYDL .zan").one("click",function(e){
	e.preventDefault();
	var shareID = $("#shareID").val();
	var curCount = $(this).parent().find(".zanCount").html();
	var curCountInt = 0;
	try{
		curCountInt = parseInt(curCount);
	}catch(e){
	}
	if(isNaN(curCountInt)){
		curCountInt = 0;
	}
	curCountInt++;
	$(this).parent().find(".zanCount").html(curCountInt);
	$.get("/uwp/youtuShare/js/updateVisitCount.jsp?type=4&shareID="+shareID);
});
function getShareCounts(){
	var shareID = $("#shareID").val();
	$.get("/uwp/youtuShare/js/updateVisitCount.jsp?type=-1",{"shareID":shareID},function(msg,status){
		if(status=="success"){
			var counts = msg.split("|");
			if(counts&&counts.length>3){
				$(".visitCount").html(counts[0]);
				$(".forwardingCount").html(counts[1]);
				$(".shareCount").html(counts[2]);
				$(".zanCount").html(counts[3]);
			}
		}
	});
}

$(".iwanttodoWCJ").on("click",function(){
	document.location = "http://mp.weixin.qq.com/s?__biz=MzA5MjYwNzM2Ng==&mid=421512713&idx=1&sn=f3830d64432a96b3c788db3412e7ec97#rd";
});
$(".iwanttodoPPT").on("click",function(){
	document.location = "http://mp.weixin.qq.com/s?__biz=MzA5MjYwNzM2Ng==&mid=421512713&idx=1&sn=f3830d64432a96b3c788db3412e7ec97#rd";
});
$(".iwanttodoWGW").on("click",function(){
	document.location = "http://mp.weixin.qq.com/s?__biz=MzA5MjYwNzM2Ng==&mid=421512713&idx=1&sn=f3830d64432a96b3c788db3412e7ec97#rd";
});

function hidenParentFrameClose(closeCur){
	if(closeCur){
		$(".j-close-htmlFrameWeb").hide();
	}
	if(window.parent!=window&&window.parent&&typeof(window.parent.hidenParentFrameClose)!="undefined"){
		window.parent.hidenParentFrameClose(true);
	}
}
function showParentFrameClose(showCur){
	if(showCur){
		$(".j-close-htmlFrameWeb").show();
	}
	if(window.parent!=window&&window.parent&&typeof(window.parent.showParentFrameClose)!="undefined"){
		window.parent.showParentFrameClose(true);
	}
}
//停止父窗口的背景音乐
function stopParentMusic(stopCur){
	if(stopCur){//是否停止当前窗口
		if(typeof(car2)!="undefined"){
			if(car2._audio) car2._audio.pause();
		}else if(typeof(uniSwiper)!="undefined"){
			if(uniSwiper._audio) uniSwiper._audio.pause();
		}
	}
	if(window.parent!=window&&window.parent&&typeof(window.parent.stopParentMusic)!="undefined"){
		window.parent.stopParentMusic(true);
	}
}
////////投票相关/////////////
function initVote(){
	var updateCount = function(comid,count){
		var that = $(".vote-count[comid='"+comid+"']");
		var voteCountStart = that.parent().attr("voteCountStart");
		var voteCountEnd = that.parent().attr("voteCountEnd");
		var voteCountInitValue = that.parent().attr("voteCount");
		try{
			voteCountInitValue = parseInt(voteCountInitValue);
		}catch(e){
			voteCountInitValue = 0;
		}
		try{
			count = parseInt(count);
		}catch(e){
			count = 0;
		}
		that.html(voteCountStart+""+(count+voteCountInitValue)+""+voteCountEnd);
	};
	function getVotePageName()
     {
         var strUrl=location.href;
         var arrUrl=strUrl.split("/");
         var strPage=arrUrl[arrUrl.length-1];
		 strPage = strPage.substring(0,strPage.indexOf("."));
         return strPage;
     }
	//初始化投票显示
	$(".vote").each(function(){
		var votecountcolor = $(this).attr("votecountcolor");
		var votecountbgcolor = $(this).attr("votecountbgcolor");
		var votecountpadding = $(this).attr("votecountpadding");
		var votecountsize = $(this).attr("votecountsize")+"px";
		if(typeof(color) == undefined){
			color ="red";
		}
		try{
			votecountpadding = parseInt(votecountpadding);
		}catch(e){
			votecountpadding = 0;
		}
		var voteLayout = $(this).attr("voteLayout");
		var translateX = 0;
		var translateY = 0;
		
		var voteCount = $("<div class='vote-count' comid='"+$(this).attr("comid")+"'></div>");
		voteCount.css("white-space","nowrap");
		voteCount.css("color",votecountcolor);
		voteCount.css("background-color",votecountbgcolor);
		voteCount.css("font-size",votecountsize);
		$(this).append(voteCount);
		//初始化文字
		updateCount($(this).attr("comid"),0);
		//布局
		var that = $(this);
		
		var thatW = Math.round(that.attr("originw"));
		var thatH = Math.round(that.attr("originh"));
		
		//获取记数div的宽高，因为如果当前页面隐藏则获取不到
		var getWClone = voteCount.clone();
		$("body").append(getWClone);
		var countW = getWClone.width();
		var countH = getWClone.height();
		getWClone.remove();
		
		if(voteLayout=="LR"){
			translateX = thatW+votecountpadding;
			translateY = (thatH-countH)/2;
		}else if(voteLayout=="RL"){
			translateX = -countW-votecountpadding;
			translateY = (thatH-countH)/2;
		}else if(voteLayout=="BT"){
			translateX = (thatW-countW)/2;
			translateY = -countH-votecountpadding;
		}else if(voteLayout=="TB"){
			translateX = (thatW-countW)/2;
			translateY = thatH+votecountpadding;
		}
		voteCount.css("transform","translate("+translateX+"px,"+translateY+"px)");
		voteCount.css("-webkit-transform","translate("+translateX+"px,"+translateY+"px)");
	});
	//获取当前投票数量
	var shareID = $("#shareID").val();
	try {
		$.get("/uwp/youtuShare/js/uniVoteServices.jsp",{"action":"getData","shareID":shareID},function(msg,status){
			if(status=="success"){
					var jsdata = JSON.parse(msg);
					for(var i=0;i<jsdata.length;i++){
						updateCount(jsdata[i].comid,jsdata[i].count);
					}
			}
		});
	} catch (e) {
	}
	$(".vote").on("click",function(){
		var curComID = $(this).attr("comid");
		
		var curPageName = getVotePageName();
		
		var cookieName = "voterecord_shareID_";
		if(shareID=="158726"){
			cookieName = cookieName+"_V1_"+curPageName;
		}else{
			cookieName = shareID+"_"+curComID;
		}
		//投票模式
		var voteCountMode = $("#voteCountMode").val();
		if(!voteEnable(cookieName,voteCountMode)){
			alert("您已经投过票了！");
		}else{
			//判断投票次数
			var voteCount = $("#voteCount").val();
			if(typeof(voteCount)!=="undefined"&&/\d+/.test(voteCount)&&voteCount>0){//验证次数
				var hasVoteCount = getVotedCount(shareID,voteCountMode=="day");
				if(hasVoteCount+1>voteCount){
					alert("每人"+(voteCountMode=="day"?"每天":"")+"最多投"+voteCount+"票!");
					return;
				}
			}
			$.get("/uwp/youtuShare/js/uniVoteServices.jsp",{"action":"update","comid":curComID,"shareID":shareID},function(msg,status){
				if(msg=="0"){
					alert("投票失败！");
				}else if(msg=="-2"){
					alert("投票未开始！");
				}else if(msg=="-3"){
					alert("投票活动已过期！");
				}else{
					updateCount(curComID,msg);
					$.fn.cookie(cookieName,new Date().toDateString().replace(/\s/g,"-"),{path:'/',expires:10000});
					alert("投票成功！");
				}
			});
		}
	});
	//是否可以投票
	function voteEnable(cookieName,voteCountMode){
		var voterecord = $.fn.cookie(cookieName);
		if(voteCountMode=="day"){
			return voterecord!=new Date().toDateString().replace(/\s/g,"-");
		}else{
			return voterecord==null;
		}
	}
	$("video").on("playing",function(){
		$(this).parent().find(".videoBtnFlash").hide();
		$(this).parent().find(".uniImg").hide();
	}).on("pause",function(){
		$(this).parent().find(".videoBtnFlash").show();
		$(this).parent().find(".uniImg").show();
	});
}
/**
 * 获取用户对shareID的投票次数
 * @param shareID
 * @param isToday	是否只获取今天的投票次数
 * @returns {Number}
 */
function getVotedCount(shareID,isToday){//获取当前用户当前作品总共投票次数
	var cookies = document.cookie.split(";");
	var c = 0;
	var regExpStr = "";
	if(isToday){
		regExpStr = shareID+"_[0-9A-Z\-]{36}="+new Date().toDateString().replace(/\s/g,"-");
	}else{
		regExpStr = shareID+"_[0-9A-Z\-]{36}=.+";
	}
	$.each(cookies,function(){
		var curVal = $.trim(this.toString());
		if(new RegExp(regExpStr).test(curVal)){
			c++;
		}
	});
	return c;
}
function getVotedCountToday(shareID){//获取当前用户当前作品今天的总共投票次数
	var cookies = document.cookie.split(";");
	var c = 0;
	$.each(cookies,function(){
		var curVal = $.trim(this.toString());
		if(new RegExp(shareID+"_[0-9A-Z\-]{36}=1").test(curVal)){
			c++;
		}
	});
	return c;
}

//初始化组图页
function initSwiper(){
	$(".groupPicsCon").each(function(){
		//遍历所有组图
		var container = $(this).find(".swiper-con");
		var containerSelector = "";
		if(container.length>0){
			containerSelector = "."+container[0].className.replace(/\bswiper-con$/,"");
		}
		var pagination = $(this).find(".pagination");
		var paginationSelector = "";
		if(pagination.length>0){
			paginationSelector = "#"+pagination.attr("id");
		}
		var mySwiper = new Swiper(containerSelector, {
			pagination : paginationSelector,
			loop : true,
			grabCursor : false,
			paginationClickable : true,
			onTouchMove:function(s){
				car2.page_stop();
			},
			onTouchEnd:function(s){
				setTimeout(function(){
					car2.page_start();
				},1000);
				car2._moveInit = false;
			},
			onSlideChangeEnd:function(){
				car2.startEffect($(mySwiper.slides[mySwiper.activeIndex]));
			}
		});
		$(this).find(".arrow-left").click(function(){
			mySwiper.swipePrev();
		});
		$(this).find(".arrow-right").click(function(){
			mySwiper.swipeNext();
		});
		//遍历结束
	});
}
//解决ios上默认不播放音乐的问题
if(RegExp("MicroMessenger","i").test(navigator.userAgent)&&RegExp("iPhone","i").test(navigator.userAgent)||RegExp("iPod","i").test(navigator.userAgent)||RegExp("iPad","i").test(navigator.userAgent)||RegExp("andr1111oid","i").test(navigator.userAgent)){
	document.addEventListener("WeixinJSBridgeReady", function(){
		var main = null;
		if(typeof(car2)!=="undefined"){
			main = car2;
		}else if(typeof(uniSwiper)!=="undefined"){
			main = uniSwiper;
		}
		main.media_init();
		main.audio_play();
	}, false);
}
/**
 * 解决IOS不能js控制播放音乐的问题
 * @param callBack
 */
function getWXPlay(callBack){
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
function resizeAdPage(){
	if($(window).height()>$(window).width()){
		var bottom = (1010-$(window).height())/2;
		if(bottom>0){
			$(".bottomBar").css("bottom",bottom);
		}
	}else{
		$(".bottomBar").css("bottom","0px");
	}
}

resizeAdPage();
$(window).on("resize",function(){
	resizeAdPage();
});
$(window).on("load",function(){
	var initViewPoint = function(){
		var allMetas =  document.head.getElementsByTagName("meta");
		var curViewPort = null;
		for(var i=0;i<allMetas.length;i++){
			if(allMetas[i].name=="viewport"){
				curViewPort = allMetas[i];
				break;
			}
		}
		var viewport = document.createElement("meta");
		viewport.name="viewport";
		viewport.content = curViewPort.content;
		document.head.appendChild(viewport);
	}
	if(typeof YKU === 'undefined'){
		if($("#isForWeb").val()=="true"){
			jQuery.getScript("//player.youku.com/jsapi",function(){
				initViewPoint();
			});
		}
	}else{
		initViewPoint();
		$("body").show();
		if(typeof(uniSwiper) != 'undefined'&&uniSwiper.initSwiper){
			uniSwiper.initSwiper();
		}
		if(typeof(initAdPagePosition) != 'undefined'){
			initAdPagePosition(true);
		}
		if(typeof(initShowContentSwiper) != 'undefined'){
			initShowContentSwiper();
		}
		if(typeof(getShareCounts) != 'undefined'){
			getShareCounts();
		}
	}
	//绑定所有元素的触发器
	$(".uniAction").each(function(){
		$(this).addTriggerEventListener();
	});
	//链接文章栏目
	$(".linkArticleCatalog").click(function(){
		var articleCatalogUrl = $(this).attr("articleCatalogUrl");
		window.open(articleCatalogUrl,"_self");
	});
	//领取红包
	$(".wxHongbao").click(function(){
		window.open("/uwp/weixin/hb/index.jsp?state="+$("#shareID").val(),"_self");
	});
	//微官网跳转链接
	  $(".linkPage").click(function(e){
	  	if(window.location.protocol=="http:"){
	  		var pathName =window.location.pathname;
	  		var curUrlName = pathName.substr(pathName.lastIndexOf("/")+1);
	  		curUrlName = curUrlName.replace(/(_(\d+))*.html/,"");
	  		var href = $(this).attr('linkUrl');
	  		var re = new RegExp(curUrlName+"(_(.*?))?.html");
	  		if(re.test(href)){
	  			car2.linkToUrl(href,false);
	  		}
	  	}
	  });
	  h5TextArea.updatePageInfo(1);
	  
	  //初始化元素状态
	  $(".item").each(function(){
		  $(this).initItemStatus();
	  }); 
	  
	  //重新设置最后一页广告图片
	  if($(".adPageConBg").length>0){
		  var adBgImg = $("<img src='/youtuShare/pub/img/adPageBg.jpg'>");
		  var adEwmImg = $("<img src='/youtuShare/pub/img/adPageEwm.jpg'>");
		  adEwmImg.css({"position":"absolute","left":"228px","top":"240px"});
		  $(".adPageConBg").css("background-image","").html("").append(adBgImg).append(adEwmImg);
	  }
});

(function($){
	$.extend({
		includePath: '',
		//jQuery添加方法，动态加载css
		includeCss: function(file)
		{
			var files = typeof file == "string" ? [file] : file;
			for (var i = 0; i < files.length; i++)
			{
				var href = files[i];
				var appendEle;
				appendEle = document.createElement("link");
				appendEle.type = "text/css";
				appendEle.rel = "stylesheet";
				appendEle.href = href;
				var head = document.head || document.getElementsByTagName('head')[0];					
				head.appendChild(appendEle);
			}
		}
	});
})(jQuery);