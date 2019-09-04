(function($){
	var UniPinch;
	
	var reqAnimationFrame = (function() {
		return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	UniPinch = (function(){
		function UniPinch(element,options){
			 //将插件的默认参数及用户定义的参数合并到一个新的obj里
	    this.settings = $.extend({}, $.fn.uniPinch.defaults, options);
	    this.$element = $(element);
	    this.el = element;
	    
	    this.pinchEnd = false;
	    
	    this.minScale = 1;//最小缩放值
	    this.initScale = 1;//初始缩放值
	    this.transform = {
					translate: {
						x: this.START_X,
						y: this.START_Y
					},
					scale: 1,
					angle: 0,
					rx: 0,
					ry: 0,
					rz: 0
				};
	    this.init();
	    
	    this.mc = new Hammer.Manager(this.el);
	    //hammer 配置 start/////////////////////////
			this.mc.add(new Hammer.Pan({
				threshold: 0,
				pointers: 0
			}));
			this.mc.add(new Hammer.Pinch({//缩放配置
				threshold: 0
			})).recognizeWith([this.mc.get('pan')]);
	     //hammer 配置 end/////////////////////////
	    this.initEvent();
		}
		UniPinch.prototype = {
				init:function(options){
					if(typeof options !=="undefined"){
						this.settings = $.extend({}, $.fn.uniPinch.defaults, options);
					}
					this.$element.css("width",this.settings.w+"px");
					this.$element.css("height",this.settings.h+"px");
					this.START_X = Math.round((window.innerWidth - this.settings.w) / 2);
					this.START_Y = Math.round((window.innerHeight - this.settings.h) / 2);
					
					this.transform.scale = this.minScale =  this.initScale = window.innerWidth/window.innerHeight>this.settings.w/this.settings.h?window.innerHeight/this.settings.h:window.innerWidth/this.settings.w;
					this.transform.translate.x = this.START_X;
					this.transform.translate.y = this.START_Y;
					this.requestElementUpdate();
				},
				initEvent:function(){
					var  that = this;
					that.mc.on("panstart panmove", function(ev){//拖动
							if(!that.pinchEnd){
								that.transform.translate = {
									x: that.START_X + ev.deltaX,
									y: that.START_Y + ev.deltaY
								};
								that.requestElementUpdate();
							}
						});
					that.mc.on("pinchstart pinchmove", function(ev) {//缩放
							if (ev.type == 'pinchstart') {
								that.initScale = that.transform.scale || 1;//当次缩放初始化缩放值
								that.pinchEnd = false;
							}
							
							that.transform.scale = Math.max(that.minScale,that.initScale * ev.scale);
							
							//矫正缩放中心位置
							that.transform.translate.x*=ev.scale;
							that.transform.translate.y*=ev.scale;
							
							that.requestElementUpdate();
						});
					that.mc.on("pinchend",function(){
						that.START_X = that.transform.translate.x;
						that.START_Y = that.transform.translate.y;
						//防止缩放后再次触发移动事件而错位，保证缩放结束不再触发移动事件
						that.pinchEnd = true;
						setTimeout(function(){
							that.pinchEnd = false;
						},50);
					});
					that.mc.on("hammer.input", function(ev) {
							if (ev.isFinal) {//输入结束返回初始位置
								that.START_X = that.transform.translate.x;
								that.START_Y = that.transform.translate.y;
							}
						});
				},
				requestElementUpdate:function () {//过渡
					var that = this;
					var value = [
						'translate3d(' + that.transform.translate.x + 'px, ' + that.transform.translate.y + 'px, 0)',
						'scale(' + that.transform.scale + ', ' + that.transform.scale + ')',
						'rotate3d(' + that.transform.rx + ',' + that.transform.ry + ',' + that.transform.rz + ',' + that.transform.angle + 'deg)'
					];
					value = value.join(" ");
					that.el.style.webkitTransform = value;
					that.el.style.mozTransform = value;
					that.el.style.transform = value;
				},
				showLog:function(msg){//调试用的的方法
					var logDiv = $("#log");
					if(logDiv.length==0){
						logDiv = $("<div id='log'></div>");
						$("body").append(logDiv);
					}
					logDiv.css("z-index","999999999999999");
					logDiv.css("position","absolute");
					logDiv.css("top","100px");
					logDiv.css("left","100px");
					logDiv.html(msg);
				}
		};
		return UniPinch;
	})();
	
	/**
     * 这里是将UniDrag对象 转为jQuery插件的形式进行调用
     * 定义一个插件 plugin
     */
    $.fn.uniPinch = function(options){
        return this.each(function () {
            var $this = $(this),
                instance = $this.data('uniPinch');
            if (!instance) {
                $this.data('uniPinch', new UniPinch(this,options));
                instance = $this.data('uniPinch');
            }else{
            	instance.init(options);
            }
            if (typeof options === 'string') instance[options]();
        })
    };
    
    /**
     * 插件的默认值
     */
    $.fn.uniPinch.defaults = {
    };
    /**
     * 优雅处： 通过data-xxx 的方式 实例化插件。
     * 这样的话 在页面上就不需要显示调用了。
     * 可以查看bootstrap 里面的JS插件写法
     */
    /*$(function(){
    	$(".dragItem").each(function(){
    		var dragOption = eval("("+$(this).attr("dragOption")+")");
    		$(this).uniDrag(dragOption);
    	});
    });*/
})(jQuery);