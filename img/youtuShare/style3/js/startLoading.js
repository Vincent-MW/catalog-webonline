particle_no = 0;

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     ||  
    function( callback ){
    window.setTimeout(callback,1000/60);
  };
})();

var canvasEle = $("<canvas id=\"in\" style=\"position: absolute; top: 50%;margin-top:75px;left:50%;margin-left:-100px\"></canvas>");
$("#in").append(canvasEle);
//var canvas = document.getElementById("in");
canvas = canvasEle[0];
var ctx = canvas.getContext("2d");
//
var counter = 0;
//进度粒子数组
var particles = [];
var w = 200, h = 150;
canvas.width = w;
canvas.height = h;

function reset(){
//	  ctx.fillStyle = "white";
	  ctx.fillStyle = "rgba(255,255,255,0)";
	  ctx.fillRect(0,0,w,h);
	  
//	  ctx.fillStyle = "#FF6600";
//	  ctx.fillRect(0,80,150,5);
	}

	function progressbar(){
	  this.widths = 0;
	  this.hue = 0;
	  
	  this.draw = function(){
		  //进度条的透明度  //hsla色彩模式
		 
	    ctx.fillStyle = 'hsla('+this.hue+', 100%, 40%, 1)';
		//进度条长度
	    ctx.fillRect(0,80,this.widths,3);
	    var grad = ctx.createLinearGradient(0,0,0,130);
		//transparent 
	    grad.addColorStop(1,"#FF6600");
	    //grad.addColorStop(1,"rgba(0,0,0,0.5)");
	    ctx.fillStyle = grad;
		//滚动条的坐标
		//长度
	    ctx.fillRect(0,80,this.widths,3);
	  }
	}

	function particle(){
		//粒子闪落
		//例子在位置
		
	  this.x =bar.widths;
	  this.y = 82;
	  
	  this.vx = 0.8 + Math.random()*1;
	  this.v = Math.random()*5;
	  this.g = 1 + Math.random()*3;
	  this.down = false;
	  
	  this.draw = function(){
		  //颜色//(bar.hue+0.3)
	    ctx.fillStyle = 'hsla('+this.hue+', 100%, 40%, 1)';
		//粒子的大小
	    var size = Math.random()*2;
	    ctx.fillRect(this.x, this.y, size, size);
	  }
	}

	bar = new progressbar();

	function draw(){
	  reset();
	  counter++
	  bar.hue += 0.8;
	  //进度条速度
	  bar.widths += 1;
	  if(bar.widths > 350){
	    if(counter > 150){
	      reset();
	      bar.hue = 0;
	      bar.widths = 0;
	      counter = 0;
	      particles = [];
		  
	    }
	    else{
	      bar.hue = 126;
	      bar.widths = 351;
	      bar.draw();
		  
	    }
	  }
	  else{
		  //进度条运动
	    bar.draw();
		//粒子的密度
	    for(var i=0;i<particle_no;i++){
	      particles.push(new particle());
		  
	    }
	  }
	  //粒子效果
//	  update();
	}

	function update(){

	  for(var i=0;i<particles.length;i++){	//粒子密度
	    var p = particles[i];
		
		//粒子喷发的方向
	    p.x -= p.vx;//粒子的斜度
		//可以改变粒子效果
	    if(p.down ==true ){
	      p.g += 0.1;
	      p.y += p.g;
	    }
	    else{
	      if(p.g<0){
	        p.down = false;
	        p.g += 0.1;
	        p.y += p.g;
	      }
		  //粒子上下位置
	      else{
	        p.y -= p.g;
	        p.g -= 0.1;
	      }
	    }
	    p.draw();
	  }
	}
	//val 0-100;

	function setProgress(val){
		//进度条的长度
		bar.widths = val/100*300;
	}

	function animloop() {
		if(counter<150||jQuery("#in").is(":visible")){
			  draw();
			  requestAnimFrame(animloop);
		}
	}
if($("#in").length>0){
	animloop();	
}


