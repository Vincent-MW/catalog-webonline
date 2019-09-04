function bindEvent(){
			$(".popImgShare").on("click",function(e){
		    	$(".share-page").removeClass("f-hide");
		    	$(".share-page").css("opacity",1);
		    	// 禁止滑动
		    	
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
				});
		    });
			$(".j-close-img").on("click",function(e){
					$('.u-audio').removeClass('f-hide');
		    		$(document.body).css('height','100%');
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
	                }
	            },150);
			});
			$(".showBigImg").on("click",function(e){
				hidenParentFrameClose(true);
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
			
			$(".showYDL .zan").one("click",function(){
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

			
			
			$(".showBigImgWin").on("click",function(e){
				showParentFrameClose(true);
				$(".showBigImgWin").removeClass("uniShow");
			});
			//显示图文--------start------------
			$(".showContent").on("click",function(e){
				hidenParentFrameClose(true);
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
				$(this).parent().removeClass("uniShow");
			});
			//显示图文--------end------------
			
			$(".popTextInfo").on("click",function(e){
				var popTextInfoIndex = $(this).attr("popTextInfoIndex");
				if(popTextInfoIndex!=null){//兼容老版本
					$(".showText"+popTextInfoIndex).addClass("uniShow");
				}else{
					var popTextInfoStr = $(this).attr("popTextInfoStr");
					$(".showTextWin .showTextContainer").html(popTextInfoStr);
					$(".showTextWin").addClass("uniShow");
				}
				hidenParentFrameClose(true);
			});
			$(".showTextWin .showTextContainer").on("click",function(e){
				showParentFrameClose(true);
				$(".showTextWin").removeClass("uniShow");
			});
			$(".swiper-slide .uniLinkWeb").on("click",function(e){
				clearTimeout(setIframeEmptyTimeOut);
				var href=$(this).attr("hrefUrl");
				$(".htmlConWeb").addClass("uniShowFromRight");
				$(".htmlConWeb").css("z-index","99999");
				$(".htmlConWeb").css("background-color","#FFFFFF");
				$(".htmlConWeb iframe").css("display","block");
				$(".htmlConWeb iframe").attr("src",href);
				//暂停音乐
//				uniSwiper.audio_stop();
				// 箭头隐藏
				$('.u-arrow').addClass('f-hide');
				//隐藏音乐开关
				uniSwiper._audioNode.addClass('f-hide');
				hidenParentFrameClose(false);
			});
			
			$(".itemAction").on("click",function(e){
				$.fn.triggerItemAction(this);
			});
			
			var setIframeEmptyTimeOut=0;
			$(".htmlConWeb .j-close-htmlFrameWeb").on("click",function(e){
				$(".htmlConWeb").removeClass("uniShowFromRight");
				setIframeEmptyTimeOut = setTimeout(function(){
					$(".htmlConWeb iframe").attr("src","about:blank");
				},500);
				$(".htmlCon").css("background-color","#FFFFFF");
				//开启音乐
				uniSwiper.audio_play();
				// 显示箭头
				if(uniSwiper._pageNow<uniSwiper._pageNum-1){
					$('.u-arrow').removeClass('f-hide');
				}
				//显示音乐开关
				uniSwiper._audioNode.removeClass('f-hide');
				showParentFrameClose(false);
			});
			$(".swiper-slide .uniLink").on("click",function(e){
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
				uniSwiper.audio_stop();
				// 箭头隐藏
				$('.u-arrow').addClass('f-hide');
				//隐藏音乐开关
				uniSwiper._audioNode.addClass('f-hide');
			});
			$(".htmlCon .j-close-htmlFrame").on("click",function(e){
				showParentFrameClose(true);
				$(".htmlCon").css("z-index","-1");
				$(".htmlCon").removeClass("uniShow");
				$(".htmlCon iframe").attr("src","about:blank");
				
				$("#youkuPlayer").children().remove();
				$("#youkuPlayer").css("display","none");
				$(".htmlCon").css("background-color","#FFFFFF");
				//开启音乐
				uniSwiper.audio_play();
				// 显示箭头
				if(uniSwiper._pageNow<uniSwiper._pageNum-1){
					$('.u-arrow').removeClass('f-hide');
				}
				//显示音乐开关
				uniSwiper._audioNode.removeClass('f-hide');
			});
//			$(".clickTurnPage").on("click",function(){
//				uniSwiper.curSwiper.swipeNext();
//			});
			$(".clickTurnPage").on("click",function(){
				var turnPageID = $(this).attr("turnPageID");
				if(turnPageID==null||typeof(turnPageID)=="undefined"){
					uniSwiper.curSwiper.swipeNext();
				}else{
					uniSwiper.pageTurnTo(turnPageID);
				}
			});
			
			$(".iwanttodoWCJ").on("click",function(){
				document.location = "http://mp.weixin.qq.com/s?__biz=MzA5MjYwNzM2Ng==&mid=421512713&idx=1&sn=f3830d64432a96b3c788db3412e7ec97#rd";
			});		
			
			
			$(".playMusic").on("click",function(e){
				$(this).find("audio").each(function(){
					if(this.paused){
						uniSwiper.audio_stop();
						this.play();
					}else{
						this.pause();
						if(uniSwiper._audioSysOff==false){//通过音乐开关关闭音乐，则翻页播放音乐事件失效
							uniSwiper.audio_play();
						}
					}
				});
			});
			$(".videoBtnFlash").on("click",function(e){
				$(this).parent().find("video").each(function(e){
					this.play();
				});
			});
			
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
			_touchDeltaY	: 0,									// 滑动的距离	
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
				if(uniSwiper._page.eq(uniSwiper._pageNow).attr("canTurnPage")=="true")return;
				// 设置变量值
		 		var $self = $(this),
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
		        	if(slice._mouseDown){
		        		moveP = e.pageY||e.y;
		        		move = true;
		        	}else return;
		        }
		 		if(Math.abs(slice._touchStartValY-moveP)<100){
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
		        }else{
		        	slice._touchStartValY = e.pageY||e.y;
		        	slice._mouseDown = true;
		        }
			},
			startShowEffect:function(con){
				var osrc = con.find(".sl-content-slice");
				osrc[0].style[uniSwiper._prefixStyle('transform')]='translateX(-100%) rotate(0deg) scale(1)';
				osrc[1].style[uniSwiper._prefixStyle('transform')]='translateX(100%) rotate(0deg) scale(1)';
				
				setTimeout(function(){
					uniSwiper._page.eq(uniSwiper._pageNow).attr("canTurnPage","true");
					uniSwiper.menban_callback();
					$(".sliceCon").remove();
				},2000);
				slice.removeBindEvent();
			}
		}
		slice.bindEvent();
		//翻书效果
		var turnBook = {
				_touchStartValX	: 0,									// 触摸开始获取的第一个值
				_turnTime	: 2000,										// 翻页需要时间	
				_mouseDown	: false,									// 判断鼠标是否按下	
				
				//幕布效果鼠标事件
				removeBindEvent:function(){
					$(".turnBook").off('touchmove mousemove');
					$(".turnBook").off('touchstart mousedown');
				},
				//幕布效果鼠标事件
				bindEvent:function(){
					$(".turnBook").on('touchstart mousedown',turnBook.toucheSliceStart);
					$(".turnBook").on('touchmove mousemove',turnBook.toucheSliceMove);
				},
				//移动事件
				toucheSliceMove:function(e){
					e.preventDefault();
//					if(uniSwiper._page.eq(uniSwiper._pageNow).attr("canTurnPage")=="true")return;
					// 设置变量值
					var $self = $(this),
					h = parseInt($self.height()),
					moveP,
					scrollTop,
					node=null,
					move=false;
					
					// 获取移动的值
					if(e.type == "touchmove"){
						moveP = window.event.touches[0].pageX;
						move = true;
					}else{
						if(turnBook._mouseDown){
							moveP = e.pageX||e.x;
							move = true;
						}else return;
					}
					if(Math.abs(turnBook._touchStartValX-moveP)<100){
						return;
					}
					if(turnBook._touchStartValX-moveP>0){
						turnBook.startShowEffect($(this));
					}
					
				},
				//启动触摸事件
				toucheSliceStart:function(e){
					e.preventDefault();
					if(turnBook._mouseDown)return;
					if(e.type == "touchstart"){
						turnBook._touchStartValX = window.event.touches[0].pageX;
					}else{
						turnBook._touchStartValX = e.pageX||e.x;
						turnBook._mouseDown = true;
					}
				},
				startShowEffect:function(con){
					TweenLite.set([con], {
						transformPerspective: turnBook._turnTime
					});
					var tl = new TimelineLite({
						paused: true
					});
					tl.to(con, 1, {
						rotationY: -90,
						transformOrigin: "left center",
						ease:Linear.easeNone
					});
					tl.play();
						//uniSwiper._page.eq(uniSwiper._pageNow).attr("canTurnPage","true");
					uniSwiper.menban_callback();
					turnBook.removeBindEvent();
					setTimeout(function(){
						$(".turnBook").remove();
					},turnBook._turnTime);
				}
		}
		turnBook.bindEvent();
		
		function getBigImgSrc(src,big_img_exp){
			var bigSrc = src.split(".");
			return bigSrc[0]+"_b."+big_img_exp;
		}		
		
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