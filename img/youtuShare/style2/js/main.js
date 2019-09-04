var uniSwiper={
			preLoadPageCount:5,
			curSwiper:null,
			_events 		: {},									// 自定义事件---this._execEvent('scrollStart');
			isLoop			:$("#isLoop").val()=="true",			//是否循环
			_audioNode		: $('.u-audio'),						// 声音模块
			_audio			: null,									// 声音对象
			_audio_val		: true,									// 声音是否开启控制
			_audioSysOff	: false,								//是否点击音乐开关关闭音乐
			_hasClickAudioCountorl:false,							// 是否点击过声音控制按钮
			hasSubmitInfo:false,									//是否已经提交用户信息
			
			_leftArrow		:$('.arrow-left'),		//箭头（左）
			_rightArrow		:$('.arrow-right'),		//箭头（右）
			
			_paddingTop		:0,										//距离顶部距离
			_paddingLeft	:0,										//距离左边距离
			_imgScale		:1,										//图片为适应屏幕做的缩放
			
			
			_map 			: $('.ylmap'),							// 地图DOM对象
			_mapValue		: null,									// 地图打开时，存储最近打开的一个地图
			_mapIndex		: null,									// 开启地图的坐标位置
			
			_elementStyle	: document.createElement('div').style,	// css属性保存对象
			
			_maskIndex		:0,										//蒙版出现的位置
			_maskType		:0,										//蒙版类型 0：擦除效果 1：点击消失
			_maskHasDel		:0,										//蒙版是否已经删除
			
			/**
			*	初始化swiper
			*/
			initSwiper:function(){
				uniSwiper._maskIndex = $("#r-cover-index").val();
				uniSwiper._maskType = $("#maskType").val();
				uniSwiper._linkUrl = $("#linkUrl").val();
				uniSwiper.curSwiper = new Swiper('.swiper-container', {
					pagination : '#pagination',
					loop : uniSwiper.isLoop,
					grabCursor : true,
					mode:'horizontal',
					autoResize:true,
					queueEndCallbacks:true,
					paginationClickable : true,
					onInit:function(){
						console.info("swiperInit");
						uniSwiper._handleEvent("init");
					},
					onSlideClick:function(e){
						//alert(e);
					},
					onSwiperCreated:function(){
						setTimeout(function(){
							uniSwiper.onSwiperCreatedHandler();
						},1000);
					},
					onSlideChangeEnd:function(){
						//更改箭头状态
						uniSwiper.changeArrowState();
						uniSwiper.startEffect();
						uniSwiper._handleEvent("success");
					}
				});
				uniSwiper.lightapp_intro();
				bindEvent();
		},
		changeArrowState:function(){
			var canTurnPage = null;
			canTurnPage = $(uniSwiper.curSwiper.getSlide(uniSwiper.curSwiper.activeIndex)).attr("canTurnPage");
			if(canTurnPage=="false"){
				$(".arrowNew").hide();
				uniSwiper.curSwiper.stopTurnPage();
			}else{
				$(".arrowNew").show();
				uniSwiper.curSwiper.startTurnPage();
			}
		},
		media_init:function(){
			if(uniSwiper.media_inited)return;
			console.info("media_init");
			uniSwiper.media_inited = true;
			if(typeof(Audio)!='undefined'){
				// 声音初始化
				uniSwiper.audio_init();
			}
			uniSwiper.audio_addEvent();
			uniSwiper.audio_play();
			uniSwiper.mapCreate();
			
			// 音符飘逸
 	 		Zepto('#coffee_flow').coffee({
 	 			steams				: ["<div class='audio_widget_01'/>","<div class='audio_widget_02'/>"], 
 	 			steamHeight			: 100,
 	 			steamWidth			: 44 
 	 		});
		},
		onSwiperCreatedHandler:function(s){
			try{
				var height = $(window).height();
				var imgWidth = $("#imgWidth").val();
				var imgHeight = $("#imgHeight").val();
				if(640/height<imgWidth/imgHeight){
					uniSwiper._paddingLeft = (imgWidth/imgHeight*height-640)/2;
					uniSwiper._imgScale = height/imgHeight;
				}else{
					uniSwiper._paddingTop = (640/imgWidth*imgHeight-height)/2;
					uniSwiper._imgScale = 640/imgWidth;
				}
				uniSwiper.initConPostion();
				
			}catch(e){}
			
			//开始加载前几页图片
			uniSwiper.loadStartImg(uniSwiper.preLoadPageCount,function(){
				// 显示封面内容
				setTimeout(function(){
					uniSwiper.plugin();
					
					uniSwiper.media_init();
					
					// 报名提交执行
					new uniForm().signUp_submit();
					
					uniSwiper.resizeSwiperContainer();
					
					$(window).on("resize",function(){
						uniSwiper.resizeSwiperContainer();
					});
					
					//初始化箭头状态
					uniSwiper.changeArrowState();
					
					$(".startLoading").remove();
					//开启首页动画
					uniSwiper.startFirstPageEffect();
					uniSwiper._audioNode.removeClass("f-hide");
	 				var mskUrl = $('#r-cover').val();
	// 				//显示蒙版
	 				if(uniSwiper._maskIndex==0&&mskUrl.length>1){
	 					// 显示正面
	 					$('#j-mengban').addClass('z-show');
	 					$('#j-mengban').removeClass('f-hide');
	 				}
					//开始加载剩余的图片
	 				var pageCount = uniSwiper.curSwiper.slides.length;
	 				 if(uniSwiper.isLoop){
	 					 pageCount-=1;
	 				 }
					var lastPageArray = new Array();
					for(var i=uniSwiper.preLoadPageCount;i<pageCount;i++){
						if(uniSwiper.isLoop){
							lastPageArray.push($(uniSwiper.curSwiper.getSlide(i+1)));
						}else{
							lastPageArray.push($(uniSwiper.curSwiper.getSlide(i)));
						}
					}
					uniSwiper._handleEvent("loadComplete");
					loadPageTools.loadPagesArray(lastPageArray,false,function(){
						
					});
				},1000)
			});
		},
		resizeSwiperContainer:function(){
			var scale = $(window).height()/$("#imgHeight").val();
			scale = Math.max(scale,1);
			$(".swiper-container").css("transform","scale("+scale+")");
			$(".swiper-container").css("-webkit-transform","scale("+scale+")");
		},
		pageTurnTo:function(turnPageID){
			var pageCount = uniSwiper.curSwiper.slides.length;
			for(var i=0;i<pageCount;i++){
				var curSlide = $(uniSwiper.curSwiper.getSlide(i));
				if(curSlide.attr("pageid")==turnPageID){
					var turnIndex = uniSwiper.isLoop?curSlide.index()-1:curSlide.index();
					uniSwiper.curSwiper.swipeTo(turnIndex, 500, true);
					break;
				}
			}
		},
		/**
		 * 开始加载前几页的所有图片
		 * startPageIndex:前几页
		 * callBack:加载完成回调函数
		 */	
		 loadStartImg:function(startPageIndex,callBack){
			 var pageArray = new Array();
			 var pageCount = uniSwiper.curSwiper.slides.length;
			 if(uniSwiper.isLoop){
				 startPageIndex=startPageIndex+1;
			 }
			 if(startPageIndex>pageCount){
				 startPageIndex = pageCount;
			 }
			 pageArray.push($(".turnBook"));
			 for(var i=0;i<startPageIndex;i++){
				pageArray.push($(uniSwiper.curSwiper.getSlide(i)));
			 }
			 loadPageTools.loadPagesArray(pageArray,true,callBack);
		 },
		//启动首页的动画
		startFirstPageEffect:function(){
			if($('#r-cover').val().length<5&&uniSwiper._maskIndex==0){
	 			//首页没有蒙版效果则 启动首页动画
	 			setTimeout(function(){
	 				uniSwiper.startEffect();
	 			},500);
			}else if(uniSwiper._maskType=="1"&&uniSwiper._maskIndex==0){//首页是点击打开蒙版效果
 				$('.u-arrow').addClass('f-hide');
			}
		},
		startEffect:function(){
	 		//暂停所有非当前页动画
	 		$(".swiper-slide").not($(uniSwiper.curSwiper.getSlide(uniSwiper.curSwiper.activeIndex))).find(".animation").each(function(){
	 			$.fn.stopEffect(this);
	 		});
	 		//启动所有当前页动画
	 		$(uniSwiper.curSwiper.getSlide(uniSwiper.curSwiper.activeIndex)).find(".animation").each(function(){
	 			//判断是否有控制该元素显示的元素
 				var flag = $.fn.checkIsCanPlayEffect(this);
 				if(flag){
 					$.fn.playEffect(this);
 				}
	 		});
	 		if(uniSwiper._audioSysOff==false){//通过音乐开关关闭音乐，则翻页播放音乐事件失效
	 			uniSwiper.audio_play();
	 		}
 	  },
	 	 /**
	 	  *  相关插件的启动
	 	  */
	 	  	plugin : function(){
	 	 		// 地图
	 	 		//uniSwiper.mapCreate();
	 	 		
	 	 		// 蒙板插件
	 	 		uniSwiper.initMask();
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
	 		    	if(uniSwiper._maskHasDel == 0){//防止重复调用
	 			    	uniSwiper._maskHasDel = 1;
	 			    	setTimeout(function(){
	 				    	$('#j-mengban canvas').addClass("hideMengBan");
	 				 		setTimeout(function(){
	 				 			$('#j-mengban').removeClass('z-show');
	 				 			$('#j-mengban').addClass('f-hide');
	 				 			setTimeout(function(){
	 				 				if(uniSwiper._pageNow<uniSwiper._pageNum-1){
	 				 					$('.u-arrow').removeClass('f-hide');
	 				 				}
	 				 				if(!uniSwiper._hasClickAudioCountorl){
	 				 					uniSwiper._audioNode.removeClass('f-hide');
	 				 					uniSwiper._audio.play();
	 				 				}
	 				 			},1000);
	 				 			uniSwiper.startEffect();
	 				 		},500);
	 			    	},500);
	 		    	}
	 			},
	 		// 初始化蒙板插件
	 		 	initMask : function(){
	 		 		if($('#r-cover').val()==null||$('#r-cover').val().length<4){
	 		 			uniSwiper._audioNode.removeClass('f-hide');
	 		 			if(uniSwiper._audio)uniSwiper._audio.play();
	 		 			$('.u-arrow').removeClass('f-hide');
	 		 			//uniSwiper.startFirstPageEffect();
	 		 			return;
	 		 		}
	 		 		if(uniSwiper._maskType!="0"){
	 		 			uniSwiper._audioNode.removeClass('f-hide');
	 		 			$('.u-arrow').removeClass('f-hide');
	 		 			//uniSwiper.page_start();
	 		 			//uniSwiper.startFirstPageEffect();
	 		 			return;
	 		 		}
	 		 		
	 				
	 				// 蒙板插件
	 				var node = $('#j-mengban')[0],
	 					canvas_url = $('#r-cover').val(),
	 					type = 'image',
	 					w = 640,
	 					h = $(window).height(),
	 					callback = uniSwiper.menban_callback;
	 				if(uniSwiper._maskIndex>0){
	 					//开启翻页
	 					//uniSwiper.page_start();
	 					//uniSwiper.startFirstPageEffect();
	 		 			$('.u-arrow').removeClass('f-hide');
	 					// 播放声音
	 					if(uniSwiper._audio){
	 						uniSwiper._audioNode.removeClass('f-hide');
	 						uniSwiper._audio.play();
	 					}
	 					//隐藏蒙版
	 					$('#j-mengban').removeClass("z-show");
	 					$('#j-mengban').addClass("f-hide");
	 				}else{
	 					// 箭头隐藏
	 					$('.u-arrow').addClass('f-hide');
	 					
	 					// 声音启动
//	 					$(document).one("touchstart", function(){
//	 						uniSwiper._audio.play();
//	 					});
	 				}
	 				uniSwiper.cover_draw(node,canvas_url,type,w,h,callback);
	 		 	},
	 	  	
	 	  	// 声音事件绑定
	 	 	audio_addEvent : function(){
	 	 		if(uniSwiper._audioNode.length<=0) return;

	 	 		// 声音按钮点击事件
	 	 		var txt = uniSwiper._audioNode.find('.txt_audio'),
	 	 			time_txt = null;
	 	 		uniSwiper._audioNode.find('.btn_audio').on('click',function(){
	 	 			uniSwiper._hasClickAudioCountorl = true;
	 	 			uniSwiper.audio_contorl();
	 	 			});

	 	 		// 声音打开事件
	 	 		$(uniSwiper._audio).on('play',function(){
	 	 			uniSwiper._audio_val = false;

	 	 			audio_txt(txt,true,time_txt);
	 	 			// 开启音符冒泡
	 	 			Zepto.fn.coffee.start();
	 	 			$('.coffee-steam-box').show(500);
	 	 		})

	 	 		// 声音关闭事件
	 	 		$(uniSwiper._audio).on('pause',function(){
	 	 			audio_txt(txt,false,time_txt)

	 	 			// 关闭音符冒泡
	 	 			Zepto.fn.coffee.stop();
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
	 	// 声音初始化
	 	 	audio_init : function(){
	 	 		// media资源的加载
	 			var options_audio = {
	 				loop: true,
	 	            preload: "auto",
	 	            src: uniSwiper._audioNode.attr('data-src')
	 			}
	 			uniSwiper._audio = new Audio(); 
	 			try{
			        //监听音乐播放事件，当播放的时候暂停其他音乐
	 				uniSwiper._audio.addEventListener("playing",function(){
			        	stopParentMusic(false);
					});
		        }catch(e){};
	 	        for(var key in options_audio){
	 	            if(options_audio.hasOwnProperty(key) && (key in uniSwiper._audio)){
	 	            	uniSwiper._audio[key] = options_audio[key];
	 	            }
	 	        }
	 	       uniSwiper._audio.load();
	 	 	},
	 	// 声音控制函数
	 	 	audio_contorl : function(){
	 	 		if(!uniSwiper._audio_val){
	 	 			uniSwiper._audioSysOff=true;
	 	 			uniSwiper.audio_stop();
	 	 		}else{
	 	 			uniSwiper._audioSysOff=false;
	 	 			uniSwiper.audio_play();
	 	 		}
	 	 	},	

	 	// 声音播放
	 	 	audio_play : function(){
	 	 		uniSwiper._audio_val = false;
	 	 		var curPageEle = null;
	 	 		try{
	 	 			curPageEle = $(uniSwiper.curSwiper.getSlide(uniSwiper.curSwiper.activeIndex));
	 	 		}catch(e){
	 	 			curPageEle = $($(".swiper-wrapper .swiper-slide")[0]);
	 	 		}
	 	 		$(".swiper-slide").not(curPageEle).each(function(){
	 	 			//停止当前页的所有音乐
	 	 			$(this).find("audio").each(function(){
	 	 				this.pause();
	 	 			});
	 	 		});
	 	 		if(curPageEle.children("audio").length>0){
	 		 		//启动当前页的背景音乐
	 		 		curPageEle.children("audio").each(function(){
	 		 			this.play();
	 		 		});
	 		 		if(uniSwiper._audio) uniSwiper._audio.pause();
	 			}else{
	 				if(uniSwiper._audio) uniSwiper._audio.play();
	 			}
	 	 	},
	 	 	// 声音停止
	 	 	audio_stop	: function(){
	 	 		uniSwiper._audio_val = true;
	 	 		if(uniSwiper._audio) uniSwiper._audio.pause(); 
	 	 		$(".swiper-slide").each(function(){
	 		 		//停止所有音乐
	 				$(this).find("audio").each(function(){
	 		 			this.pause();
	 		 		});
	 			});
	 	 	},
	 	// 表单显示，输入
	 		input_form : function(){
	 			$('body').on('click','.popSubmitInfo',function(){
	 				var type_show = $(this).attr("data-submit");
	 				if (type_show == 'true') {
	 					return;
	 				}

	 				var heigt = $(window).height();

	 				$(document.body).css('height',heigt);
	 				//uniSwiper.page_stop();
	 				//uniSwiper._scrollStart();
	 				// 设置层级关系-z-index
	 				//uniSwiper._page.eq(uniSwiper._pageNow).css('z-index',15);

	 				$('.book-bg').removeClass('f-hide');
	 				$('.book-form').removeClass('f-hide');
	 				$('.u-audio').addClass('f-hide');
	 				setTimeout(function(){
	 					$('.book-form').addClass('z-show');
	 					$('.book-bg').addClass('z-show');
	 				},50)

	 				$('.book-bg').off('click');
	 				$('.book-bg').on('click',function(e){
	 					e.stopPropagation();

	 					var node = $(e.target);

	 					if(node.parents('.book-form').length>=1 && !node.hasClass('j-close-img') && node.parents('.j-close').length<=0) return;

	 					$('.book-form').removeClass('z-show');
	 					$('.book-bg').removeClass('z-show');
	 					setTimeout(function(){
	 						$(document.body).css('height','100%');
	 						//uniSwiper.page_start();
	 						//uniSwiper._scrollStop();
	 						// 设置层级关系-z-index
	 						//uniSwiper._page.eq(uniSwiper._pageNow).css('z-index',9);
	 						
	 						$('.book-bg').addClass('f-hide');
	 						$('.book-form').addClass('f-hide');
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
	 		// loading显示
	 			loadingPageShow : function(){
	 				$('.u-pageLoading').show();
	 			},
	 			
	 			// loading隐藏
	 			loadingPageHide : function (){
	 				$('.u-pageLoading').hide();	
	 			},
	 			
	 		// 显示轻APP按钮
	 			lightapp_intro_show : function(){
//	 				if(uniSwiper._linkUrl==""){
//	 					return;
//	 				}
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
//	 		 		alert("1");
//	 		 		alert($('.market-page'));
	 		 		$('.market-page').removeClass('f-hide');
	 				setTimeout(function(){
	 					$('.market-page').addClass('show');
	 					setTimeout(function(){
	 						$('.market-img').addClass('show');
	 					},100)
	 				},100)

	 				// 禁止滑动
//	 				uniSwiper.page_stop();
	 				uniSwiper._scrollStop();
	 				
	 				// 点击窗口让内容隐藏
	 				$('.market-page').off('click');
	 				$('.market-page').on('click',function(e){
	 					uniSwiper.page_hide_info_bar(e);
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
	 					uniSwiper.lightapp_intro_show();

	 					// 禁止滑动
//	 					uniSwiper.page_start();
	 					uniSwiper._scrollStart();
	 				}
	 		 	},

	 			// 轻APP介绍弹窗关联
	 			lightapp_intro : function(){
//	 				if(uniSwiper._linkUrl=="")return;
	 				// 点击按钮显示内容
	 				//$('.market-notice').off('click');
	 				$('.market-notice').on('click',function(){
	 					uniSwiper.page_show_info_bar();
	 				});

	 				// 点击窗口让内容隐藏
	 				$('.market-page').off('click');
	 				$('.market-page').on('click',function(e){
	 					uniSwiper.page_hide_info_bar(e);
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
	 				    if(!uniSwiper._isOwnEmpty(option)){
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
//	 					option.detail = str_data != '' ? eval('('+str_data+')') : '';
	 					option.detal = str_data;
	 					option.latitude = $(this).attr('data-latitude');
	 					option.longitude = $(this).attr('data-longitude');

	 					// 地图添加
	 					var detal		= option.detal,
	 						latitude	= option.latitude,
	 						longitude	= option.longitude,
	 					 	fnOpen		= option.fnOpen,
	 						fnClose		= option.fnClose;

	 					//uniSwiper._scrollStop();
	 					uniSwiper._map.addClass('show');
	 					$(document.body).animate({scrollTop: 0}, 0);
	 					
	 					//判断开启地图的位置是否是当前的
	 					if($(this).attr('data-mapIndex')!=uniSwiper._mapIndex){
	 						uniSwiper._map.html($('<div class="bk"><span class="css_sprite01 s-bg-map-logo"></span></div>'));
	 						uniSwiper._mapValue = false;
	 						uniSwiper._mapIndex = $(this).attr('data-mapIndex');
	 					}else{
	 						uniSwiper._mapValue = true;	
	 					} 

	 					setTimeout(function(){
	 						//将地图显示出来
	 						if(uniSwiper._map.find('div').length>=1){
	 							uniSwiper._map.addClass("mapOpen");
	 							//uniSwiper.page_stop();
	 							//uniSwiper._scrollStop();
	 							uniSwiper._audioNode.addClass('z-low');
	 							// 设置层级关系-z-index
	 							//uniSwiper._page.eq(uniSwiper._pageNow).css('z-index',15);

	 							setTimeout(function(){
	 								//如果开启地图的位置不一样则，创建新的地图
	 								if(!uniSwiper._mapValue) uniSwiper.addMap(detal,latitude,longitude,fnOpen,fnClose);
	 							},500)
	 						}else return;
	 					},100)
	 				},	
	 				
	 				//地图关闭，将里面的内容清空（优化DON结构）
	 				mapSave	: function(){
	 					$(window).on('webkitTransitionEnd transitionend',mapClose);
	 					//uniSwiper.page_start();
	 					//uniSwiper._scrollStart();
	 					uniSwiper._map.removeClass("mapOpen");
	 					uniSwiper._audioNode.removeClass('z-low');

	 					if(!uniSwiper._mapValue) uniSwiper._mapValue = true;

	 					function mapClose(){
	 						uniSwiper._map.removeClass('show');
	 						// 设置层级关系-z-index
	 						//uniSwiper._page.eq(uniSwiper._pageNow).css('z-index',9);
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
//	 					uniSwiper._isOwnEmpty(detal)	? detal=a:detal=detal;
	 					detal = a;
	 					!latitude? latitude=39.915:latitude=latitude;
	 					!longitude? longitude=116.404:longitude=longitude;
	 					//创建地图
	 					uniSwiper._map.ylmap({
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
	 						fnOpen	: uniSwiper._scrollStop,
	 						fnClose	: uniSwiper.mapSave
	 					};
	 					uniSwiper.mapAddEventHandler(node,'click',uniSwiper.mapShow,option);
	 				},
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
	 										if(uniSwiper._hasPerspective){
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
	 					
	 					//初始化背景图片位置
	 					initConPostion:function(){
	 						var imgWidth = $("#imgWidth").val();
	 						var imgHeight = $("#imgHeight").val();
	 						$(".page-con-img").css("width","100%");
	 						$(".page-con-img").css("height","100%");
//	 						$(".page-con-img").each(function(){
//	 							$(this).css("left",-uniSwiper._paddingLeft+"px");
//	 							$(this).css("top",-uniSwiper._paddingTop+"px");
//	 							$(this).css("width",Math.round(imgWidth*uniSwiper._imgScale) +"px");
//	 							$(this).css("height",Math.round(imgHeight*uniSwiper._imgScale)+"px");
//	 						});
	 						$(".showYDL").css("bottom",uniSwiper._paddingTop+"px");
	 					},
	 			
		};
		
		var loadPageTools={
				 curNeedLoadPageArray:null,//当前需要加载的所有页
				 loadStartImgCallBack:null,//加载完成回调函数
				 isPreLoading:false,//是否初次预加载
				 curLoadedImgCount	:0,//当前页面已加载图片的个数
				 curNeedLoadImgCount:0,//当前页面需要加载图片的个数
				 
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
					 });
				 },
					 
			};