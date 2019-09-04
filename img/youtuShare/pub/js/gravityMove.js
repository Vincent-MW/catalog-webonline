define(function(){
	return {
		init:function(){
			var gravityImgs,
			initGravityMove=function(){
				gravityImgs = $(".gravityMove");
				if(gravityImgs.length>0){
					window.addEventListener('devicemotion', devicemotionListener, false);
				}
			},
			devicemotionListener=function (e){
				var acceleration =e.accelerationIncludingGravity;
				 x = acceleration.x;
	             gravityImgs.each(function(){
	            	 var l = $(this).css("left").replace("px","");
	            	 var w = $(this).css("width").replace("px","");
	            	 var left = (parseFloat(l)-x);
	            	 var windowW = $(window).width();
	            	 var minLimit = 0;
	            	 var maxLimit = 0;
	            	 if(w>windowW){
	            		 minLimit = -(w-windowW);
	            		 maxLimit = 0;
	            	 }else{
	            		 minLimit = 0;
	            		 maxLimit = windowW-w;
	            	 }
	            	 if(left<=maxLimit&&left>=minLimit){
	            		 $(this).css("left",left+"px");
	            	 }
	             });
		    }
			initGravityMove();
		}
	}
});