/**
*	Zepto.js 插件
*
*/

(function($){
	var UniPathMove;
	//主方法
	UniPathMove = (function(){
		/**
		 * 构造方法
		 */
		function UniPathMove(element,options){
			this.settings = $.extend({}, $.fn.uniPathMove.defaults, options);
			this.$element = $(element);
		}
		
		UniPathMove.prototype = {
			initParames:function(){
				this.settings.playedCount = 0;
				if(allTriggerDatas&&allTriggerDatas.pathMoveDatas){
					var curEffectName = this.$element.data("curPlayEffectName");
            		var pathMoveData = allTriggerDatas.pathMoveDatas[curEffectName];
            		var rotateWidthPath = pathMoveData.rotateWidthPath;
            		var duration = pathMoveData.duration;
            		var repeatCount = pathMoveData.repeatCount;
            		var startDelay = pathMoveData.startDelay;
            		var autoRotate = false;
            		if(rotateWidthPath=="true"){
            			var r = this.$element.attr("originR");
            			autoRotate = 90;
            		}
            		var ps = pathMoveData.pathDatas.split(",");
            		var bezierValues = [];
            		
            		this.settings.previousPoint = this.getPreviousEffectPathEndPoint();
            		for(var i=0;i<ps.length;i+=2){
            			bezierValues.push({x:parseInt(ps[i])+this.settings.previousPoint.x,y:parseInt(ps[i+1])+this.settings.previousPoint.y});
            		}
            		$.extend(this.settings,{
            			duration:duration,
            			repeatCount:repeatCount,
            			startDelay:startDelay,
            			autoRotate:autoRotate,
            			bezierValues,bezierValues
            		});
            		$.each(bezierValues,function(){
            			console.info(this.x+":"+this.y);
            			
            		});
				}
            },
            play:function(){
            	var that = this;
            	if(typeof this.settings.bezierValues!=="undefined"){
            		that.settings.delayTimeout = setTimeout(function(){
            			clearTimeout(that.settings.delayTimeout);
        				that.settings.curTweenMax = TweenMax.to(that.$element,that.settings.duration/1000,{bezier:{values:that.settings.bezierValues,autoRotate:that.settings.autoRotate},ease: Power0.easeNone,onComplete:function(){
        					that.playComplete();
        				}});
        			},this.settings.startDelay);
            	}else{
            		this.playComplete();
            	}
            },
            stop:function(){
            	if(this.settings.curTweenMax)this.settings.curTweenMax.kill();
            	clearTimeout(this.settings.delayTimeout);
            },
            playComplete:function(){
            	if(typeof this.settings.repeatCount === "undefined"){
            		//派发完成事件
            		this.$element.trigger("animationEnd");
            	}else{
        			this.settings.playedCount++;
            		//判断是否播放完
        			if(this.settings.repeatCount==-1||this.settings.playedCount<this.settings.repeatCount){
        				this.play();
        			}else{
        				this.stop();
        				//派发完成事件
        				this.$element.trigger("animationEnd");
        			}
            	}
            },
            /**
    		 * 获取当前元素的上一个效果的结束位置
    		 */
    		getPreviousEffectPathEndPoint:function(){
    			var previousPoint = {x:0,y:0};
            	var curEffectName = this.$element.data("curPlayEffectName");
            	
            	if(allTriggerDatas&&allTriggerDatas.pathMoveDatas&&allTriggerDatas.pathMoveDatas[curEffectName]&&allTriggerDatas.pathMoveDatas[curEffectName].basePoint){
            		previousPoint = allTriggerDatas.pathMoveDatas[curEffectName].basePoint;
            	}else{
	            	var curAnimationName = this.$element.attr("animationType");
	            	var animationNamesArray = curAnimationName.split(" ");
	            	if(allTriggerDatas&&allTriggerDatas.pathMoveDatas){
	            		for(var i=0,len=animationNamesArray.length;i<len;i++){
	            			var effectName = animationNamesArray[i];
	            			if(effectName!=curEffectName){
	            				if(typeof allTriggerDatas.pathMoveDatas[effectName] !=="undefined"){
		            				var pathMoveData = allTriggerDatas.pathMoveDatas[effectName];
		            				var ps = pathMoveData.pathDatas.split(",");
		            				previousPoint.x += parseInt(ps[ps.length-2]);
		            				previousPoint.y += parseInt(ps[ps.length-1]);
	            				}
	            			}else{
	            				break;
	            			}
	            		}
	            	}
            	}
    			return previousPoint;
    		},
		 }
		return UniPathMove;
	})();
	 $.fn.uniPathMove = function(options){
        return this.each(function () {
            var $this = $(this),
                instance = $.fn.uniPathMove.lookup[$this.data('uniPathMove')];
            if (!instance) {
                //zepto的data方法只能保存字符串，所以用此方法解决一下
                $.fn.uniPathMove.lookup[++$.fn.uniPathMove.lookup.i] = new UniPathMove(this,options);
                $this.data('uniPathMove', $.fn.uniPathMove.lookup.i);
                instance = $.fn.uniPathMove.lookup[$this.data('uniPathMove')];
            }
            instance.initParames();
            instance.play();
            if (typeof options === 'string') instance[options]();
        })
    };
    $.fn.uniPathMoveStop = function(){
    	var $this = $(this),
        instance = $.fn.uniPathMove.lookup[$this.data('uniPathMove')];
	    if(instance) {
	    	instance.stop();
	    }
    }
    $.fn.uniPathMove.lookup = {i: 0};
	/**
     * 插件的默认值
     */
    $.fn.uniPathMove.defaults = {playedCount:0};
})(Zepto);