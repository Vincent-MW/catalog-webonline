var triggerActions = {
		doTrigger:function(curTrigger){
			var triggerType = curTrigger.type;
			triggerType = triggerType.replace("-","");
			if(triggerType=="linkGZH")triggerType = "web";
			var isShowText = $("#isShowText").val();
			if(isShowText=="Y"){
				if(typeof this[triggerType] !== 'undefined')this[triggerType](curTrigger);
			}else if(triggerType != "popTextInfo"){
				if(typeof this[triggerType] !== 'undefined')this[triggerType](curTrigger);
			}
		},
		//////////////工具方法///////////////
		youkuPlayer:null,
		showYoutkuVideo:function(value){
			if(typeof YKU === 'undefined'){
				jQuery.getScript("//player.youku.com/jsapi",function(){
					youkuPlayer = new YKU.Player('youkuPlayer',{
						client_id: '698d1ef24d7c819e',
						vid: value,
						show_related: false,
						autoplay: true
					});
				});
			}else{
				youkuPlayer = new YKU.Player('youkuPlayer',{
					client_id: '698d1ef24d7c819e',
					vid: value,
					show_related: false,
					autoplay: true
				});
			}
		},
		turnPageNext:function(){
			if(typeof car2 !=='undefined'){
				car2.pageTurn(true);
			}else	if(typeof uniSwiper!=="undefined"){
				if(typeof uniSwiper.curSwiper.swipeNext !=="undefined"){
					uniSwiper.curSwiper.swipeNext();
				}else{
					uniSwiper.curSwiper.slideNext();						
				}
			}
		},
		turnPageTo:function(turnPageID){
			if(typeof car2 !=='undefined'){
				car2.pageTurnTo(turnPageID);
			}else	if(typeof uniSwiper!=="undefined"){
				uniSwiper.pageTurnTo(turnPageID);
			}
		},
		//获取主App对象
		getMainApp:function(){
			if(typeof car2!=="undefined"){
    			return car2;
    		}else if(typeof uniSwiper!=="undefined"){
    			return uniSwiper;
    		}	
		},
		//////////////工具方法 end///////////////
		
		//拨打电话
		tel:function(curTrigger){
			var linkUrl = curTrigger.linkUrl;
			var target = curTrigger.target;
			if(!linkUrl.match(/^tel:\/\/.*$/i)){
				linkUrl = "tel://"+linkUrl;
			}
			window.open(linkUrl,target);
		},
		//网页链接
		web:function(curTrigger){
			var linkUrl = curTrigger.linkUrl;
			var target = curTrigger.target;
			if(!linkUrl.match(/^http(s?):\/\/.*$/i)){
				linkUrl = "http://"+linkUrl;
			}
			window.open(linkUrl,target);
		},
		//内嵌网页链接
		innerWeb:function(curTrigger){
			var linkUrl = curTrigger.linkUrl;
			if(!linkUrl.match(/^http(s?):\/\/.*$/i)){
				linkUrl = "http://"+linkUrl;
			}
			if(typeof setIframeEmptyTimeOut !== "undefined")clearTimeout(setIframeEmptyTimeOut);
			
			var start = function(){
				$con.addClass("uniShowFromRight");
				$con.css("z-index","99999");
				$con.css("background-color","#FFFFFF");
				$(".htmlConWeb iframe").css("display","block");
				$(".htmlConWeb iframe").attr("src",linkUrl);
				// 箭头隐藏
				$('.u-arrow').addClass('f-hide');
				//隐藏音乐开关
				$('.u-audio').addClass('f-hide');
				hidenParentFrameClose(false);
			}
			
			var $con = $(".htmlConWeb");
			if($con.length==0){
				$con = $("<div class='htmlConWeb'><iframe id='htmlFrameWeb' style='border: none;' frameborder='0' src='' width='100%' height='100%'></iframe><a class='j-close-htmlFrameWeb'></a></div>").appendTo($("body"));
				$con.find(".j-close-htmlFrameWeb").click(function(){
					$con.removeClass("uniShowFromRight");
					setIframeEmptyTimeOut = setTimeout(function(){
						$con.find("iframe").attr("src","about:blank");
					},500);
					$(".htmlCon").css("background-color","#FFFFFF");
					//开启音乐
//					car2.audio_play();
					// 显示箭头
//					if(car2._pageNow<car2._pageNum-1){
//						$('.u-arrow').removeClass('f-hide');
//					}
					//显示音乐开关
//					car2._audioNode.removeClass('f-hide');
					showParentFrameClose(false);
				});
				setTimeout(start,100);
			}else{
				start();
			}
		},
		//视频链接
		video:function(curTrigger){
			var linkUrl = curTrigger.linkUrl;
			var target = curTrigger.target;
			if(!linkUrl.match(/^http(s?):\/\/.*$/i)){
				linkUrl = "http://"+linkUrl;
			}
			
			hidenParentFrameClose(true);
			
			var start = function(){
				console.info("start");
				var href=linkUrl;
				$htmlCon.addClass("uniShow");
				$htmlCon.css("z-index","99999");
				$htmlCon.css("background-color","#FFFFFF");
				$htmlCon.find("iframe").css("display","block");
				if(href.indexOf("v.youku.com")>-1&&href.indexOf(".html")>-1){//优酷视频地址
					var urls = href.split("/");
					var parames = urls.pop();
					var youkuVideoValue = parames.substring(0,parames.indexOf(".html"));
					youkuVideoValue = youkuVideoValue.replace("id_","");
					youkuVideoValue = youkuVideoValue.split("_")[0];
					$("#youkuPlayer").css("display","block");
					$htmlCon.css("background-color","rgba(0, 0, 0, 0.7)");
					$(".htmlCon iframe").css("display","none");
					this.showYoutkuVideo(youkuVideoValue);
				}else{
					$("#youkuPlayer").css("display","none");
					$(".htmlCon iframe").attr("src",href);
				}
				var mainApp = this.getMainApp();
				//暂停音乐
				mainApp.audio_stop();
				//隐藏音乐开关
				if(typeof mainApp._audioNode !=='undefined'){
					mainApp._audioNode.addClass('f-hide');
				}
			}
			
			var $htmlCon = $(".htmlCon");
			if($htmlCon.length==0){
				//初始化dom
				$htmlCon = $("<div class='htmlCon'><iframe id='htmlFrame' style='border: none;' frameborder='0' src='' width='100%' height='100%'/><div id='youkuPlayer' style='display:none;position: absolute;left:0px;right:0px;width:100%;height:460px;top:260px;'/><a class='j-close-htmlFrame'/></div>").appendTo($("body"));
				var that = this;
				$htmlCon.find(".j-close-htmlFrame").click(function(){
					$htmlCon.css("z-index","-1");
					$htmlCon.removeClass("uniShow");
					$htmlCon.css("background-color","#FFFFFF");
					$htmlCon.find("iframe").attr("src","about:blank");
					
					var mainApp = that.getMainApp();
					//开启音乐
					mainApp.audio_play();
					//显示音乐开关
					if(typeof mainApp._audioNode !== 'undefined')mainApp._audioNode.removeClass('f-hide');
					showParentFrameClose(true);
					setTimeout(function(){
						$("#youkuPlayer").children().remove();
						$("#youkuPlayer").css("display","none");
					},100);
				});
				setTimeout(function(){
					start.call(that);
				},100);
			}else{
				start.call(this);
			}
		},
		//点击翻页
		clickTurnPage:function(curTrigger){
    		var turnPageID = curTrigger.turnPageID;
    		if(/\d/.test(turnPageID)){
    			this.turnPageTo(turnPageID);
    		}else{
    			this.turnPageNext();
    		}
		},
		//播放音频
		playAudio:function(curTrigger){
			console.info("播放音频");
			var audioUrl = curTrigger.audioUrl;
			if(typeof curTrigger.audio === "undefined"){
				curTrigger.audio = new Audio();
				if(audioUrl.indexOf("/html")==0){
					audioUrl = audioUrl.replace("/html","");
				}
				curTrigger.audio.src = audioUrl;
			}
			var curAudio = curTrigger.audio;
			console.info(curAudio.src);
			var mainApp = this.getMainApp();
			if(curAudio.paused){
				mainApp.audio_stop();
				curAudio.play();
			}else{
				curAudio.pause();
				if(mainApp._audioSysOff==false){//通过音乐开关关闭音乐，则翻页播放音乐事件失效
					mainApp.audio_play();
				}
			}
		},
		//显示大图
		showBigImg:function(curTrigger){
			var imgVal = curTrigger.reNameStr;
			if(imgVal&&imgVal!=""){
				imgVal = $("#imgBasePath").val()+imgVal;
				if(typeof hidenParentFrameClose != 'undefined')hidenParentFrameClose(true);
				var mainApp = this.getMainApp();
	    		if(typeof mainApp !=='undefined'&&typeof mainApp._scrollStart !=='undefined')mainApp._scrollStart();
				
				$(".showBigImgWin .showBigImgContainer").css("background-image","url('/youtuShare/style3/img/load.gif')");
				var img=new Image();
	            img.src=imgVal;
	            
	            var showBigImgCon = jQuery(".showBigImgWin .showBigImgContainer");
	            if(jQuery(".showBigImgWin").length==0){
	            	var showBigImgWin = jQuery("<div class='showBigImgWin'><div class='showBigImgContainer'></div><a class='j-close'></a></div>").appendTo(jQuery("body"));
	            	showBigImgCon = showBigImgWin.find(".showBigImgContainer");
	            	showBigImgWin.find(".j-close").click(function(){
	            		showBigImgWin.removeClass("uniShow");
	            	});
	            	setTimeout(function(){
	            		showBigImgWin.addClass("uniShow");
	            	},100);
	            }else{
	            	$(".showBigImgWin").addClass("uniShow");
	            }
	            $(img).on("load",function(){
	            	showBigImgCon.css("background-image","url('"+imgVal+"')").uniPinch({w:this.width,h:this.height});
	            });
			}
		},
		//地图
		jmap:function(curTrigger){
			var mapDetail = curTrigger.mapDetail;
			var mapValue = curTrigger.mapValue;
			var mapIndex = mapValue;
			var mainApp = this.getMainApp();
    		//option地图函数的参数
    		var option ={
    			fnOpen	: mainApp._scrollStop,
    			fnClose	: mainApp.mapSave
    		};
    		// 获取各自地图的资源信息
    		option.detal = mapDetail;
    		option.latitude = 0;
    		option.longitude = 0;
    		if(mapValue&&mapValue.split(",").length>1){
    			option.latitude = mapValue.split(",")[1];
    			option.longitude = mapValue.split(",")[0];
    		}
    		// 地图添加
    		var detal		= option.detal,
    			latitude	= option.latitude,
    			longitude	= option.longitude,
    		 	fnOpen		= option.fnOpen,
    			fnClose		= option.fnClose;

    		//初始化
    		if(mainApp._map.length==0){
    			mainApp._map = $("<div class='ylmap bigOpen'><div class='bk'><span class='css_sprite01 s-bg-map-logo'></span></div></div>").appendTo($("body"));
    		}
    		if(typeof mainApp._scrollStop !='undefined')mainApp._scrollStop();
    		if(typeof mainApp._map !='undefined')mainApp._map.addClass('show');
    		try{
    			$(document.body).animate({scrollTop: 0}, 0);
    		}catch(e){
    			console.info(e);
    		}
    		
    		//判断开启地图的位置是否是当前的
    		if(mapIndex!=mainApp._mapIndex){
    			mainApp._map.html($('<div class="bk"><span class="css_sprite01 s-bg-map-logo"></span></div>'));
    			mainApp._mapValue = false;
    			mainApp._mapIndex = mapIndex;
    		}else{
    			mainApp._mapValue = true;	
    		}
    		setTimeout(function(){
    			//将地图显示出来
    			if(mainApp._map.find('div').length>=1){
    				mainApp._map.addClass("mapOpen");
    				if(mainApp.page_stop)mainApp.page_stop();
    				if(mainApp._scrollStop)mainApp._scrollStop();
    				if(typeof mainApp._audioNode !== 'undefined')mainApp._audioNode.addClass('z-low');
    				// 设置层级关系-z-index
    				if(mainApp._page)mainApp._page.eq(mainApp._pageNow).css('z-index',15);

    				setTimeout(function(){
    					//如果开启地图的位置不一样则，创建新的地图
    					if(!mainApp._mapValue) mainApp.addMap(detal,latitude,longitude,fnOpen,fnClose);
    				},500)
    			}else return;
    		},100)
		},
		//表单提交
		popSubmitInfo:function(curTrigger){
			var formDivId = ".book-form";
			var type_show = $(this).attr("data-submit");
			if (type_show == 'true') {
				return;
			}
			var heigt = $(window).height();
			$(document.body).css('height',heigt);
			if(typeof car2 !== "undefined"){
				car2.page_stop();
				car2._scrollStart();
				// 设置层级关系-z-index
				car2._page.eq(car2._pageNow).css('z-index',15);
			}

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
					if(typeof car2 !== "undefined"){
						car2.page_start();
						car2._scrollStop();
						// 设置层级关系-z-index
						car2._page.eq(car2._pageNow).css('z-index',9);
					}
					
					$('.book-bg').addClass('f-hide');
					$(formDivId).addClass('f-hide');
				},500)
			})
		},
		//显示图文页
		showContent:function(curTrigger){
			var showContentWin = $(".showContentWin");
			//容器
			if(showContentWin.length==0){
				showContentWin = $("<div class=\"showContentWin\"></div>");
				showContentWin.append("<div class='showBigImgContainer' style='overflow: hidden !important;'><div class='swiper-wrapper'><div class='swiper-slide'/></div><div class=\"swiper-scrollbar\"/></div>");
				showContentWin.append("<div class=\"j-close\"></div>");
				
				showContentWin.find(".j-close").on("click",function(e){
					showParentFrameClose(true);
					$(this).parent().removeClass("uniShow").find(".swiper-wrapper").css("transform","");
				});
				$("body").append(showContentWin);
				
				var hasResize = false;
				if(typeof Swiper3 === "undefined"){
					jQuery.getScript("/youtuShare/style2/swiper/min.js?v1",function(){
						initShowContentSwiper();
					});
				}else{
					initShowContentSwiper();
				}
				var initShowContentSwiper = function(){
					//初始化swiper
					var swiper0 = new Swiper3('.showContentWin .showBigImgContainer', {
						scrollbar: '.showContentWin .swiper-scrollbar',
						direction: 'vertical',
						slidesPerView: 'auto',
						mousewheelControl: false,
						freeMode: true,
						onTouchStart : function(swiper,even){
							if(!hasResize){hasResize0=true;
								swiper.update(false);
							}
						}
					});
				}
			}
			//水平居中
			showContentWin.find(".swiper-wrapper").css("margin-left",($(window).width()-640)/2+"px");
			
			var showContentContainer = showContentWin.find(".swiper-slide");
			
			//解析内容
			var showContentList = curTrigger.showContentList;
			if(showContentList&&showContentList.length>0){
				var showContent = showContentList[0];
				var showContentID = showContent.id;
				if(showContentContainer.attr("showContentID")==showContentID){
					//不需要解析,重新利用
				}else{
					showContentContainer.html("");
					showContentContainer.attr("showContentID",showContentID);
					//解析内容
					var title = (showContent.showContentItemTitle&&showContent.showContentItemTitle.length>0)?showContent.showContentItemTitle[0].text:"";
					if(title!=""){
						showContentContainer.append("<div class='showContentTitle'>"+title+"</div>");
					}
					var author = (showContent.showContentItemAutor&&showContent.showContentItemAutor.length>0)?showContent.showContentItemAutor[0].text:"";
					if(author!=""){
						showContentContainer.append("<div class='showContentAuthor'>"+author+"</div>");
					}
					if(showContent.ItemContent){
						var imgBasePath = $("#imgBasePath").val();
						for(var i=0;i<showContent.ItemContent.length;i++){
							var itemContentStr =  showContent.ItemContent[i].text;
							var itemContentType = showContent.ItemContent[i].type;
							if(itemContentType=="img"){
								showContentContainer.append("<div class='img'><img alt='' src='"+imgBasePath+itemContentStr+"'></div>");
							}else if(itemContentType == "label"){
								showContentContainer.append("<div class='article'>"+itemContentStr+"</div>");
							}
						}
					}
				}
			}
			hidenParentFrameClose(true);
			setTimeout(function(){
				showContentWin.addClass("uniShow");
			},10);
		},
		//触发元素
		itemAction:function(curTrigger){
			var actions = curTrigger.action;
			var curAction;
			for(var i=0;i<actions.length;i++){
				curAction = actions[i];
				var triggerItem = $(".item[comid='"+curAction.itemComID+"']");
				if(curAction.actionType=="show"){
					if((typeof curAction.playEffectWhenShow)==="undefined"||curAction.playEffectWhenShow=="true"){
						//旧版
						triggerItem.each(function(){
							$.fn.playEffect(this);
						});
					}else{
						//新版
						triggerItem.show();
					}
				}else{
					triggerItem.find("audio,video").each(function(){
						this.pause();
						this.currentTime = 0;
					});
//					console.info("隐藏》");
//					triggerItem.hide().css("opacity","1");
					triggerItem.css("opacity","1").animate({opacity:0},200,'ease',function(){
						$(this).hide().css("opacity","1");
					});
					$.fn.removeEffectStyleName(triggerItem);
				}
			}
		},
		//弹出文字内容
    	popTextInfo:function(curTrigger){
    		var popTextInfoStr = curTrigger.text;
    		$(".showTextWin .showTextContainer").html(popTextInfoStr);
			$(".showTextWin").addClass("uniShow");
    	},
    	//播放动画
    	playEffect:function(curTrigger){
//    		console.info("触发播放动画》》");
    		var actions = curTrigger.action;
			
    		var itemList = {};
    		
    		var curAction;
    		var curEffectName;
			for(var i=0;i<actions.length;i++){
				curAction = actions[i];
				curEffectName = allTriggerDatas.effectMap[curAction.effectID];
				if(curEffectName!=null){
					if(itemList[curAction.itemComID]){
						itemList[curAction.itemComID].push(curEffectName);
					}else{
						itemList[curAction.itemComID] = [curEffectName];
					}
				}
			}
			
			for(var comID in itemList){
				var triggerItem = $(".item[comid='"+comID+"']");
				triggerItem.data("playing","false");
				$.fn.playEffect(triggerItem,itemList[comID].join(" "));
			}
			
    	}
}