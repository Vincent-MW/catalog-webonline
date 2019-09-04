var setIframeEmptyTimeOut=0;
function bindEvent(){
		$(".popImgShare").on("click",function(e){
	    	$(".share-page").removeClass("f-hide");
	    	$(".share-page").css("opacity",1);
	    	// 禁止滑动
			car2.page_stop();
			car2._scrollStop();
	    	
	    	// 点击窗口让内容隐藏
			$('.share-page').on('click',function(e){
				$('.market-img').removeClass('show');
				setTimeout(function(){
					$('.share-page').removeClass('show');
					setTimeout(function(){
						$('.share-page').addClass('f-hide');
					},100)
				},100)
				// 禁止滑动
				car2.page_start();
				car2._scrollStart();
			});
	    });
		$(".j-close-img").on("click",function(e){
				$('.u-arrow').removeClass('f-hide');
				$('.u-audio').removeClass('f-hide');
	    		$(document.body).css('height','100%');
				car2.page_start();
				car2._scrollStop();
				$('.book-bg').addClass('f-hide');
				$('.book-form').addClass('f-hide');
				$('.book-form').removeClass('z-show');
	    });
		$(".mask-circle-1").on("click",function(e){
			$(this).hide();
			$(".mask-toolTip").hide();
			var w = "";
			var h = "";
				w = -jQuery(".mask-img-touch").attr("width");
				h = -jQuery(".mask-img-touch").attr("height");
			var i = 0;
			var setInter = setInterval(function() {
				var curY = Math.floor(i/4);
				var curX = Math.floor(i%4);
                jQuery(".mask-img-touch").css("-webkit-mask-position",(w*curX)+"px "+(h*curY)+"px");
                i++;
                if(i>=20){
                	jQuery(".groupPicsCon").show();
                	jQuery(".groupPicsConMirror").hide();
                	jQuery(".mask-click-top").hide();
                	clearInterval(setInter);
                	car2.menban_callback();
                }
            },150);
		});
		$(".showBigImg").on("click",function(e){
			hidenParentFrameClose(true);
			car2._scrollStart();
			
			var imgBgSrc = "";
			if($(this).attr("big_img_url")!=null&&$(this).attr("big_img_url")!=""&&$(this).attr("big_img_url")!="null"){
				imgBgSrc = $(this).attr("big_img_url");
			}else{
				var imgSrc = "";
				if($(this).find("img").length>0){
					imgSrc = $(this).find("img").attr("data-src");
				}else if($(this).find(".vectorText").length>0){
					imgSrc = $(this).find(".vectorText").attr("imgSrc");
				}
				var big_img_exp = $(this).attr("big_img_exp");
				imgBgSrc = getBigImgSrc(imgSrc,big_img_exp);
			}
			
			$(".showBigImgWin .showBigImgContainer").css("background-image","url('/youtuShare/style3/img/load.gif')");
			var img=new Image();
            img.src=imgBgSrc;
            $(".showBigImgWin").addClass("uniShow");
            $(img).on("load",function(){
            	jQuery(".showBigImgWin .showBigImgContainer").css("background-image","url('"+imgBgSrc+"')").uniPinch({w:this.width,h:this.height});
            });
		});
		$(".showBigImgWin").on("click",function(e){
			showParentFrameClose(true);
			car2._scrollStop();
			$(".showBigImgWin").removeClass("uniShow");
		});
		
		//显示图文--------start------------
		$(".showContent").on("click",function(e){
			hidenParentFrameClose(true);
			car2._scrollStart();
			var popShowContentIndex = $(this).attr("popShowContentIndex");
			var textarea = $(".showContentWin_"+popShowContentIndex).find("textarea");
			$(".showContentWin_"+popShowContentIndex).addClass("uniShow");
			if(textarea.length>0){
				if($(".showContentWin_"+popShowContentIndex).find(".swiper-slide").html()==""){
					$(".showContentWin_"+popShowContentIndex).find(".swiper-slide").html(textarea.val());
				}
			}
		});
		$(".showContentWin .j-close").on("click",function(e){
			showParentFrameClose(true);
			car2._scrollStop();
			$(this).parent().removeClass("uniShow");
		});
		//显示图文--------end------------
		
		//显示导航页--------start------------
		$(".m-page").on("click",function(e){
			if($(e.target).parent().hasClass("toNav")){
				if($(".m-page-pop").hasClass("uniShowFromRight")){
					$(".m-page-pop").removeClass("uniShowFromRight");
					setTimeout(function(){
						car2.stopEffect($(".m-page-pop"));
					},500);
				}else{
					$(".m-page-pop").addClass("uniShowFromRight");
					setTimeout(function(){
						car2.startEffect($(".m-page-pop"));
					},500);
				}
			}else{
				$(".m-page-pop").removeClass("uniShowFromRight");
				setTimeout(function(){
					car2.stopEffect($(".m-page-pop"));
				},500);
			}
		});
		//显示导航页--------end------------
		
		
		$(".popTextInfo").on("click",function(e){
			hidenParentFrameClose(true);
			car2._scrollStart();
			var popTextInfoIndex = $(this).attr("popTextInfoIndex");
			if(popTextInfoIndex!=null){//兼容老版本
				$(".showText"+popTextInfoIndex).addClass("uniShow");
			}else{
				var popTextInfoStr = $(this).attr("popTextInfoStr");
				$(".showTextWin .showTextContainer").html(popTextInfoStr);
				$(".showTextWin").addClass("uniShow");
			}
		});
		$(".showTextWin .showTextContainer").on("click",function(e){
			showParentFrameClose(true);
			car2._scrollStop();
			$(".showTextWin").removeClass("uniShow");
		});
		$(".uniLinkWeb").on("click",function(e){
			clearTimeout(setIframeEmptyTimeOut);
			var href=$(this).attr("hrefUrl");
			$(".htmlConWeb").addClass("uniShowFromRight");
			$(".htmlConWeb").css("z-index","99999");
			$(".htmlConWeb").css("background-color","#FFFFFF");
			$(".htmlConWeb iframe").css("display","block");
			$(".htmlConWeb iframe").attr("src",href);
			//暂停音乐
//			car2.audio_stop();
			// 箭头隐藏
			$('.u-arrow').addClass('f-hide');
			//隐藏音乐开关
			car2._audioNode.addClass('f-hide');
			hidenParentFrameClose(false);
		});
		$(".htmlConWeb .j-close-htmlFrameWeb").on("click",function(e){
			$(".htmlConWeb").removeClass("uniShowFromRight");
			setIframeEmptyTimeOut = setTimeout(function(){
				$(".htmlConWeb iframe").attr("src","about:blank");
			},500);
			$(".htmlCon").css("background-color","#FFFFFF");
			//开启音乐
			car2.audio_play();
			// 显示箭头
			if(car2._pageNow<car2._pageNum-1){
				$('.u-arrow').removeClass('f-hide');
			}
			//显示音乐开关
			car2._audioNode.removeClass('f-hide');
			showParentFrameClose(false);
		});
		$(".uniLink").on("click",function(e){
			hidenParentFrameClose(true);
			var href=$(this).attr("hrefUrl");
			$(".htmlCon").addClass("uniShow");
			$(".htmlCon").css("z-index","99999");
			$(".htmlCon").css("background-color","#FFFFFF");
			$(".htmlCon iframe").css("display","block");
			if(href.indexOf("v.youku.com")>-1&&href.indexOf(".html")>-1){//优酷视频地址
				var urls = href.split("/");
				var parames = urls.pop();
				var youkuVideoValue = parames.substring(0,parames.indexOf(".html"));
				youkuVideoValue = youkuVideoValue.replace("id_","");
				youkuVideoValue = youkuVideoValue.split("_")[0];
				$("#youkuPlayer").css("display","block");
				$(".htmlCon").css("background-color","rgba(0, 0, 0, 0.7)");
				$(".htmlCon iframe").css("display","none");
				setTimeout(function(){
					showYoutkuVideo(youkuVideoValue);
				},1);
			}else{
				$("#youkuPlayer").css("display","none");
				$(".htmlCon iframe").attr("src",href);
				//window.location.href=href;
				//return;
			}
			//暂停音乐
			car2.audio_stop();
			// 箭头隐藏
			$('.u-arrow').addClass('f-hide');
			//隐藏音乐开关
			car2._audioNode.addClass('f-hide');
		});
		$(".htmlCon .j-close-htmlFrame").on("click",function(e){
			
			$(".htmlCon").css("z-index","-1");
			$(".htmlCon").removeClass("uniShow");
			$(".htmlCon").css("background-color","#FFFFFF");
			$(".htmlCon iframe").attr("src","about:blank");
			
			//开启音乐
			car2.audio_play();
			// 显示箭头
			if(car2._pageNow<car2._pageNum-1){
				$('.u-arrow').removeClass('f-hide');
			}
			//显示音乐开关
			car2._audioNode.removeClass('f-hide');
			showParentFrameClose(true);
			setTimeout(function(){
				$("#youkuPlayer").children().remove();
				$("#youkuPlayer").css("display","none");
			},100);
		});
		$(".clickTurnPage").each(function(){
			var that = this;
			var turnEvent = $(this).attr("turnEvent");
			if(turnEvent==null||(typeof turnEvent) == 'undefined'||turnEvent==""){
				turnEvent = "click";
			}
			if(turnEvent=="slideRight"&&(typeof Hammer)!= "undefined"){
				var hammer = new Hammer(this);
				hammer.on("swipe",function(ev) {
					if(ev.offsetDirection==2){//向右滑动
						turnPage();
					}
				});
			}else{
				$(this).on("click",function(){
					turnPage();
				});
			}
			var turnPage = function(){
				var turnPageID = $(that).attr("turnPageID");
				if(turnPageID==null||typeof(turnPageID)=="undefined"){
					car2.pageTurn(true);
				}else{
					car2.pageTurnTo(turnPageID);
				}
			}
		});
		$(".playMusic").on("click",function(e){
			$(this).find("audio").each(function(){
				if(this.paused){
					car2.audio_stop();
					this.play();
				}else{
					this.pause();
					if(car2._audioSysOff==false){//通过音乐开关关闭音乐，则翻页播放音乐事件失效
						car2.audio_play();
					}
				}
			});
		});
		$(".videoBtnFlash").on("click",function(e){
			$(this).parent().find("video").each(function(e){
				this.play();
			});
		});
		
		$(".playEffect").on("click",function(e){
			var playTarget = $(this).attr("playtarget");
			
			var tartarry = playTarget.split(",");
			for(var i=0;i<tartarry.length;i++){
				var target = tartarry[i];
				$(this).parent().find("#"+target).each(function(){
					var curAnimationName = $(this).attr("animationType");
		 			$(this).show();
		 			var animationNamesArray = curAnimationName.split(" ");
		 			var curEffectName = animationNamesArray.shift();
		 			$(this).addClass(curEffectName);
		 			if(car2.isInitNeedHide(curEffectName)){
		 				$(this).css("opacity","0");
					}else{
						$(this).css("opacity","1");
					}
		 			var curAnimationObj = $(this);
		 			$(this).on('webkitAnimationEnd animationEnd',playNextEffect);
		 			function playNextEffect(){
		 				if(animationNamesArray.length>0){
		 					curAnimationObj.removeClass(curEffectName);
		 					curEffectName = animationNamesArray.shift();
		 					curAnimationObj.addClass(curEffectName);
		 					if(car2.isInitNeedHide(curEffectName)){
		 						curAnimationObj.css("opacity","0");
		 					}else{
		 						curAnimationObj.css("opacity","1");
		 					}
		 				}
		 			}
				});
			}
		});
		$(".itemAction").on("click",function(e){
			$.fn.triggerItemAction(this);
		});
		if(car2._isForWeb){
			$("body").css("overflowY","auto");
			$(".p-ct").height($(".translate-back").height());
			
			car2._on("loadComplete",function(){
				setTimeout(function(){
					checkTalkShow(window);
				},100);
				$(window).on("scroll",function(){
					checkTalkShow(window);
				});
			});
		}else{//
			car2._on("begin",function(e){//作品开始
				console.info("begin");
				var curPageEle = car2._page.eq(car2._pageNow);
				if(curPageEle.hasClass("long-page")){
					checkTalkShow(curPageEle);
					curPageEle.on("scroll",function(){
						checkTalkShow(curPageEle);
					});
				}
			});
			car2._on("success",function(e){//作品翻页结束
				var curPageEle = car2._page.eq(car2._pageNext);
				console.info("success");
				$.each(car2._page,function(){
					if($(this).hasClass("long-page")){
						$(this).scrollTop(0);
						$(this).off("scroll");
					}
				});
				if(curPageEle.hasClass("long-page")){
					checkTalkShow(curPageEle);
					curPageEle.on("scroll",function(){
						checkTalkShow(curPageEle);
					});
				}
			});
		}
		//////////////自动翻页开始////////////
		var isAutoTurnPage = $("#isAutoTurnPage").val();
		var autoTurnPageGap = $("#autoTurnPageGap").val()*1000;
		var isLoop = $("#isLoop").val();
		var autoTurnWatch;
		
		if(isAutoTurnPage=="true"&&car2._page.length>1&&car2._turnMode!="3D"){
			clearTimeout(autoTurnWatch);
			autoTurnWatch = setTimeout(function(){
				car2.pageTurn(true);
			},autoTurnPageGap);
			car2._on("success",function(){
				if(isLoop=="true"||car2._pageNext<car2._page.length-1){
					console.info("准备下一个翻页");
					clearTimeout(autoTurnWatch);
					autoTurnWatch = setTimeout(function(){
						car2.pageTurn(true);
					},autoTurnPageGap);
				}
			});
			car2._on("touchPage",function(){
				console.info("停止自动翻页"+car2._moveing);
				clearTimeout(autoTurnWatch);
			});
		}
		//////////////自动翻页结束////////////
};		
		////检测所有对话框是否需要显示////
		function checkTalkShow(con){
			var scrollTop = parseInt($(con).scrollTop());//当前屏幕显示区域y坐标
			var windowH = $(con).height();
			var tbLen = 0;//显示区间距离上下边距
			var jline = scrollTop+windowH;
			var pageHeight = $("#imgHeight").val();//页面总高
			var needPlayItem = [];
			if(con === window){
				con = "body";
			}
			$(con).find(".animation").each(function(){
				var top = parseInt($(this).css("top").replace("px",""));//元素y坐标
				var itemH = parseInt($(this).css("height").replace("px",""));//元素高度
				
				var itemShowMin = 0;
				var itemShowMax = 0;
				
				itemShowMin = scrollTop;
				itemShowMax = scrollTop+(windowH-tbLen);
				
				if(top<itemShowMax){
					needPlayItem.push(this);
				}
			});
			car2.startEffect(null,needPlayItem,true);
		}


		function showYoutkuVideo(value){
			showVideo('youkuPlayer',value);
		}
		var youkuPlayer;
		function showVideo(domid,vid){
			youkuPlayer = new YKU.Player(domid,{
			           client_id: '698d1ef24d7c819e',
			           vid: vid,
			           show_related: false,
			           autoplay: true
			});
		}
		//分开效果
		var slice = {
			_touchStartValY	: 0,									// 触摸开始获取的第一个值
			_touchStartValX	: 0,									// 触摸开始获取的第一个值
			_mouseDown	: false,									// 判断鼠标是否按下	
			
			//幕布效果鼠标事件
			removeBindEvent:function(){
				$(".sliceCon").off('touchmove mousemove');
				$(".sliceCon").off('touchstart mousedown');
			},
			//幕布效果鼠标事件
			bindEvent:function(){
				$(".sliceCon").on('touchstart mousedown',slice.toucheSliceStart);
				$(".sliceCon").on('touchmove mousemove',slice.toucheSliceMove);
			},
			//移动事件
			toucheSliceMove:function(e){
				//if(!slice._mouseDown)return;
				e.preventDefault();
				if(car2._page.eq(car2._pageNow).attr("canTurnPage")=="true")return;
				// 设置变量值
		 		var $self = $(this),
		 			h = parseInt($self.height()),
		 			movePY,
		 			movePX,
		 			scrollTop,
		 			node=null,
		 			move=false;
	
		 		// 获取移动的值
		 		if(e.type == "touchmove"){
		 			movePX = window.event.touches[0].pageX;
		 			movePY = window.event.touches[0].pageY;
		        	move = true;
		        }else{
		        	if(slice._mouseDown){
		        		movePY = e.pageY||e.y;
		        		movePX = e.pageX||e.x;
		        		move = true;
		        	}else return;
		        }
		 		if(Math.abs(slice._touchStartValY-movePY)<100&&Math.abs(slice._touchStartValX-movePX)<100){
		 			return;
		 		}
		 		slice.startShowEffect($(this));
			},
			//启动触摸事件
			toucheSliceStart:function(e){
				e.preventDefault();
				if(slice._mouseDown)return;
				if(e.type == "touchstart"){
					slice._touchStartValY = window.event.touches[0].pageY;
					slice._touchStartValX = window.event.touches[0].pageX;
		        }else{
		        	slice._touchStartValY = e.pageY||e.y;
		        	slice._touchStartValX = e.pageX||e.x;
		        	slice._mouseDown = true;
		        }
			},
			startShowEffect:function(con){
// 				var osrc = con.find(".sl-content-slice");
// 				osrc[0].style[car2._prefixStyle('transform')]='translateX(-100%) rotate(0deg) scale(1)';
// 				osrc[1].style[car2._prefixStyle('transform')]='translateX(100%) rotate(0deg) scale(1)';
				
				con.find(".sl-content-slice").each(function(){
					var data_dir = $(this).attr("data-dir");
					var data_distance = $(this).attr("data-distance");
					$(this)[0].style[car2._prefixStyle('transform')]='translate'+data_dir+'('+data_distance+'%) rotate(0deg) scale(1)';
				});
				
				setTimeout(function(){
					car2._page.eq(car2._pageNow).attr("canTurnPage","true");
					car2.menban_callback();
					$(".sliceCon").remove();
				},2000);
				slice.removeBindEvent();
			}
		}
		slice.bindEvent();
		
function getBigImgSrc(src,big_img_exp){
	var bigSrc = src.split(".");
	var r = "0";
	if(src.split("?").length>1){
		r = src.split("?")[1];
	}
	return bigSrc[0]+"_b."+big_img_exp+"?"+r;
}