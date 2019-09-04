function Lottery(A,D,C,E,B,F){this.conNode=A;this.background=null;this.backCtx=null;this.mask=null;this.maskCtx=null;this.lottery=null;this.lotteryType="image";this.cover=D||"#000";this.coverType=C;this.pixlesData=null;this.width=E;this.height=B;this.lastPosition=null;this.drawPercentCallback=F;this.vail=false}Lottery.prototype={createElement:function(B,A){var C=document.createElement(B);for(var D in A){C.setAttribute(D,A[D])}return C},getTransparentPercent:function(B,G,I){try{var D=B.getImageData(0,0,G,I),A=D.data,C=[];for(var E=0,F=A.length;E<F;E+=4){var H=A[E+3];if(H<128){C.push(E)}}return(C.length/(A.length/4)*100).toFixed(2)}catch(J){return 100}},resizeCanvas:function(C,B,A){C.width=B;C.height=A;C.getContext("2d").clearRect(0,0,B,A)},resizeCanvas_w:function(C,B,A){C.width=B;C.height=A;C.getContext("2d").clearRect(0,0,B,A);if(this.vail){this.drawLottery()}else{this.drawMask()}},drawPoint:function(B,C,A){this.maskCtx.beginPath();this.maskCtx.arc(B,C,30,0,Math.PI*2);this.maskCtx.fill();this.maskCtx.beginPath();this.maskCtx.lineWidth=80;this.maskCtx.lineCap=this.maskCtx.lineJoin="round";if(this.lastPosition){this.maskCtx.moveTo(this.lastPosition[0],this.lastPosition[1])}this.maskCtx.lineTo(B,C);this.maskCtx.stroke();this.lastPosition=[B,C];this.mask.style.zIndex=(this.mask.style.zIndex==20)?21:20},bindEvent:function(){var D=this;var B=(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));var E=B?"touchstart":"mousedown";var A=B?"touchmove":"mousemove";if(!B){var C=false;D.conNode.addEventListener("mouseup",function(F){F.preventDefault();C=false;var G=D.getTransparentPercent(D.maskCtx,D.width,D.height);if(G>=10){if(typeof(D.drawPercentCallback)=="function"){D.drawPercentCallback()}}},false)}else{D.conNode.addEventListener("touchmove",function(F){if(C){F.preventDefault()}if(F.cancelable){F.preventDefault()}else{window.event.returnValue=false}},false);D.conNode.addEventListener("touchend",function(F){C=false;var G=D.getTransparentPercent(D.maskCtx,D.width,D.height);if(G>=10){if(typeof(D.drawPercentCallback)=="function"){D.drawPercentCallback()}}},false)}this.mask.addEventListener(E,function(G){G.preventDefault();C=true;var H=(B?G.touches[0].pageX:G.offsetX||G.pageX);var F=(B?G.touches[0].pageY:G.offsetY||G.pageY);D.drawPoint(H,F,C)},false);this.mask.addEventListener(A,function(G){G.preventDefault();if(!C){return false}G.preventDefault();var H=(B?G.touches[0].pageX:G.offsetX||G.pageX);var F=(B?G.touches[0].pageY:G.offsetY||G.pageY);D.drawPoint(H,F,C)},false)},drawLottery:function(){if(this.lotteryType=="image"){var B=new Image(),C=this;B.onload=function(){this.width=C.width;this.height=C.height;C.resizeCanvas(C.background,C.width,C.height);C.backCtx.drawImage(this,0,0,C.width,C.height);C.drawMask()};B.src=this.lottery}else{if(this.lotteryType=="text"){this.width=this.width;this.height=this.height;this.resizeCanvas(this.background,this.width,this.height);this.backCtx.save();this.backCtx.fillStyle="#FFF";this.backCtx.fillRect(0,0,this.width,this.height);this.backCtx.restore();this.backCtx.save();var A=30;this.backCtx.font="Bold "+A+"px Arial";this.backCtx.textAlign="center";this.backCtx.fillStyle="#F60";this.backCtx.fillText(this.lottery,this.width/2,this.height/2+A/2);this.backCtx.restore();this.drawMask()}}},drawMask:function(){if(this.coverType=="color"){this.maskCtx.fillStyle=this.cover;this.maskCtx.fillRect(0,0,this.width,this.height);this.maskCtx.globalCompositeOperation="destination-out"}else{if(this.coverType=="image"){var A=new Image(),B=this;A.onload=function(){B.resizeCanvas(B.mask,B.width,B.height);var E=(/android/i.test(navigator.userAgent.toLowerCase()));B.maskCtx.globalAlpha=0.98;B.maskCtx.drawImage(this,0,0,B.width,B.height);console.info(B.width+":::"+B.height);var D=50;var C=$("#ca-tips").val();var F=B.maskCtx.createLinearGradient(0,0,B.width,0);F.addColorStop("0","#fff");F.addColorStop("1.0","#000");B.maskCtx.font="Bold "+D+"px Arial";B.maskCtx.textAlign="left";B.maskCtx.fillStyle=F;B.maskCtx.fillText(C,B.width/2-B.maskCtx.measureText(C).width/2,100);B.maskCtx.globalAlpha=1;B.maskCtx.globalCompositeOperation="destination-out"};A.src=this.cover}}},init:function(A,B){if(A){this.lottery=A;this.lottery.width=this.width;this.lottery.height=this.height;this.lotteryType=B||"image";this.vail=true}if(this.vail){this.background=this.background||this.createElement("canvas",{style:"position:fixed;left:50%;top:0;width:640px;margin-left:-320px;height:100%;background-color:transparent;"})}this.mask=this.mask||this.createElement("canvas",{style:"position:fixed;left:50%;top:0;width:640px;margin-left:-320px;height:100%;background-color:transparent;"});this.mask.style.zIndex=20;if(!this.conNode.innerHTML.replace(/[\w\W]| /g,"")){if(this.vail){this.conNode.appendChild(this.background)}this.conNode.appendChild(this.mask);this.bindEvent()}if(this.vail){this.backCtx=this.backCtx||this.background.getContext("2d")}this.maskCtx=this.maskCtx||this.mask.getContext("2d");if(this.vail){this.drawLottery()}else{this.drawMask()}var C=this;window.addEventListener("resize",function(){C.width=document.documentElement.clientWidth;C.height=document.documentElement.clientHeight;C.resizeCanvas_w(C.mask,C.width,C.height)},false)}};