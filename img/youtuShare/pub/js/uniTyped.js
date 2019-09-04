/**
 * Created by jack on 16-4-28.
 * zepto plugin template
 */

/**
 * 将插件封装在一个闭包里面，防止外部代码污染  冲突
 */
(function ($) {
    /**
     * 定义一个插件 Plugin
     */
    var UniTyped,
        initDomItem;  //插件的私有方法，也可以看做是插件的工具方法集
    
    initDomItem = function(){
		$(this).find("*[ALIGN='justify']").attr("ALIGN","left").attr("oldAlign","justify");
		$(this).find("*").each(function(){
			if($(this).children().length==0){
				if($.trim($(this).html()).length>0){
					$(this).attr("typingTxt",$(this).html());
					$(this).html("");
				}
			}
		});
    }
    
    var initAll = function(){
    	var typedList =  $(document).find(".item").filter(function(index){
    		var animationtype = $(this).attr("animationtype");
    		return /(^| )zzcx_/.test(animationtype);
    	});
    	typedList.find(".vectorText").each(initDomItem);
    }
    initAll();
    /**
     * 这里是插件的主体部分
     * 这里是一个自运行的单例模式。
     * 这里之所以用一个 Plugin 的单例模式 包含一个 Plugin的类，主要是为了封装性，更好的划分代码块
     * 同时 也 方便区分私有方法及公共方法
     * PS：但有时私有方法为了方便还是写在了Plugin类里，这时建议私有方法前加上"_"
     */
    UniTyped = (function () {

        /**
         * 插件实例化部分，初始化时调用的代码可以放这里
         * @param element 传入jq对象的选择器，如 $("#J_plugin").plugin() ,其中 $("#J_plugin") 即是 element
         * @param options 插件的一些参数神马的
         * @constructor
         */
        function UniTyped(element, options) {
            //将插件的默认参数及用户定义的参数合并到一个新的obj里
            this.settings = $.extend({}, $.fn.uniTyped.defaults, options);
            //将dom jquery对象赋值给插件，方便后续调用
            this.$element = $(element);
            this.allTypedEle=[];
            //初始化调用一下
            this.init();
            this.playCount = 0;
        }
        /**
         * 
         * 将插件所有函数放在prototype的大对象里
         * @type {{}}
         */
        UniTyped.prototype = {
            	//初始化打字效果
            	init:function(options){
            		if(typeof options !='undefined')this.settings = $.extend(this.settings, $.fn.uniTyped.defaults, options);
            		//初始化参数
            		this.initParames();
            		this.initDom();
            		this.playTyping();
            	},
            	initParames:function(){
            		playCount = 0;
            		var curEffectName = this.settings.cssName;
            		//解析参数
					var curEffectNames = curEffectName.split("_");
					var options = {};
					if(curEffectNames.length>1){
						options.startDelay = curEffectNames[1];
						if(curEffectNames.length>2){
							options.duration = curEffectNames[2];
							if(curEffectNames.length>3){
								options.repeatCount = curEffectNames[3];
							}
						}
					}
					this.settings = $.extend(this.settings, $.fn.uniTyped.defaults, options);
            	},
            	initDom:function(){
            		var that = this.$element;
            		$(that).find(".vectorText").each(initDomItem);
            	},
        		playTyping:function(){
        			var that = this;
        			var item = $(this.$element);
        			var textLine = [];
        			var allTxtLen = 0;//总字数
        			item.find("*").each(function(){
        				if($(this).children().length==0){
        					var typingTxt = $(this).attr("typingTxt");
        					if(typingTxt!=null)typingTxt = typingTxt.replace(/&nbsp;/ig," ");
        					else typingTxt = "";
            				if(typingTxt.length>0){
            					allTxtLen+=typingTxt.length;
            					var startDelay = textLine.length==0?that.settings.startDelay:0;
            					textLine.push({ele:this,txt:typingTxt,startDelay:startDelay});
            				}
        				}
        			});
        			//计算速度
        			that.settings.speed = Math.ceil(that.settings.duration/allTxtLen);
    				this.doPlayTyping(textLine);
            	},
            	doPlayTyping:function(textLine){
            		var that = this;
            		if(textLine.length>0){
        				var curTypingObj = textLine.shift();
        				var curTyped  = jQuery(curTypingObj.ele).data("typed");
        				if(curTyped!=null){
        					curTyped.typeSpeed = that.settings.speed;
        					curTyped.startDelay = curTypingObj.startDelay;
        					curTyped.options.callback=function () {
        			        	that.doPlayTyping(textLine);
        			        }
        					curTyped.init();
        				}else{
	        				curTyped =  jQuery(curTypingObj.ele).typed({
	        			        strings: [curTypingObj.txt],
	        			        typeSpeed: that.settings.speed,
	        			        showCursor: false,
	        			        loop: false,
	        			        startDelay:curTypingObj.startDelay,
	        			        loopCount: false,
	        			        callback: function () {
	        			        	//检测是否播放前是两端对齐
	        			        	$(curTypingObj.ele).parents("[oldAlign='justify']").attr("ALIGN","justify");
	        			        	that.doPlayTyping(textLine);
	        			        },
//	        			        preStringTyped: function () {
//	        			        	$(curTypingObj.ele).addClass("saying");
//	        			        },
//	        			        onStringTyped: function () {
//	        			        	$(curTypingObj.ele).removeClass("saying");
//	        			        }
	        			    });
	        				if(typeof(that.allTypedEle)==='undefined') that.allTypedEle = [];
	        				that.allTypedEle.push(curTyped.data("typed"));
        				}
        			}else{
        				playCount++;
        				//是否循环
        				if(that.settings.repeatCount==-1){//无限循环
        					//重新开始
        					that.initDom();
    						that.playTyping();
        				}else{
        					if(playCount>=that.settings.repeatCount){
        						//派发完成事件
        						that.$element.trigger("animationEnd");
        					}else{
        						//重新开始
        						that.initDom();
        						that.playTyping();
        					}
        				}
        			}
            	}
        };
        return UniTyped;

    })();

    /**
     * 这里是将UniTyped对象 转为zepto插件的形式进行调用
     * 定义一个插件 plugin
     * zepto的data方法与jq的data方法不同
     * 这里的实现方式可参考文章：http://trentrichardson.com/2013/08/20/creating-zepto-plugins-from-jquery-plugins/
     */
    $.fn.uniTyped = function(options){
        return this.each(function () {
            var $this = $(this),
                instance = $.fn.uniTyped.lookup[$this.data('uniTyped')];
            if (!instance) {
                //zepto的data方法只能保存字符串，所以用此方法解决一下
                $.fn.uniTyped.lookup[++$.fn.uniTyped.lookup.i] = new UniTyped(this,options);
                $this.data('uniTyped', $.fn.uniTyped.lookup.i);
                instance = $.fn.uniTyped.lookup[$this.data('uniTyped')];
            }else{
            	instance.init(options);
            }
            if (typeof options === 'string') instance[options]();
        })
    };

    $.fn.uniTyped.lookup = {i: 0};
    $.fn.uniTypedStopEffect = function(){
    	var that =this;
    	var curUniTyped = $.fn.uniTyped.lookup[$(this).data('uniTyped')];
		if(typeof curUniTyped !== 'undefined' && typeof curUniTyped.allTypedEle !== 'undefined'){
			for(var i in curUniTyped.allTypedEle){
				var curTyped = curUniTyped.allTypedEle[i];
				if(typeof curTyped !== void 0) {
					//停止插件
		        	clearInterval(curTyped.timeout);
		        	curTyped.el.html("");
		        	curTyped.el.removeClass("saying");
		        	curTyped.el.data("typed",null);
				}
			};
			curUniTyped.allTypedEle = [];
		}
    };
    /**
     * 插件的默认值
     */
    $.fn.uniTyped.defaults = {
        speed: 200,
        loop: false
    };

    /**
     * 优雅处： 通过data-xxx 的方式 实例化插件。
     * 这样的话 在页面上就不需要显示调用了。
     * 可以查看bootstrap 里面的JS插件写法
     */
    $(function () {
    	//return new UniTyped($('[data-plugin]'));
    });
})(Zepto);