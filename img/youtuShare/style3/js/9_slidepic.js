(function(B){var A=function(C,E){var D=this;D.div=typeof(C)=="string"?document.getElementById(C):C;D.options={urls:"",interval:5000,track:"left",speed:10,time:500,lpos:0,posInit:null,posSet:null,ulImg:null,ulBtn:null,pos:1,x:0,firstx:0,move:true,direction:"",touchmove:false,kernel:"",width:640,aotuTime:null,shape:"c",position:"r",};var F;for(F in E){D.options[F]=E[F]}D.options.urls=D.options.urls.split(",");if(D.options.lpos==0){D.options.lpos=D.options.urls.length}D.setBroseType();D._initHtml();D._initCssAndEvent();if(D.options.lpos>1){D._auto();D._watchAuto()}return D};A.prototype={handleEvent:function(D){var C=this;switch(D.type){case"touchstart":C._touchstart(D);break;case"touchmove":C._touchmove(D);break;case"touchend":C._touchend(D);break}},_touchstart:function(D){var C=this;C.options.touchmove=true;C.options.firstx=B.event.touches[0].pageX;if(C.options.aotuTime){clearInterval(C.options.aotuTime);C.options.aotuTime=null}},_touchmove:function(C){var D=this;if(!D.options.touchmove){return}D.options.touchmove=false;var F=B.event.touches[0].pageX;var E=F-D.options.firstx;if(Math.abs(E)>15){C.preventDefault();if(E>0){D.options.direction="right"}else{D.options.direction="left"}}else{D.options.direction=null;D.options.firstx=F}},_touchend:function(D){var C=this;if(C.options.touchmove){return}C.options.touchmove=true;if(C.options.direction=="right"){C._right()}else{if(C.options.direction=="left"){C._left()}}},_wxScale:function(D){var F=this;var G=B.document.domain,C,H=[];for(C=0;C<F.options.lpos;C++){H[C]="http://"+G+F.options.urls[C]}var E="http://"+$(D.currentTarget).find("img").attr("src");if(RegExp("MicroMessenger").test(navigator.userAgent)&&typeof(F.options.urls)=="object"){WeixinJSBridge.invoke("imagePreview",{"current":E,"urls":H})}},_right:function(){var C=this;if(!C.options.move){return}C.options.move=false;C.options.pos--;var E=-C.options.width*(C.options.pos);var D=E-C.options.x;if(C.options.pos==0){C._transform(D,C.options.time,C.options.speed,0,function(F){F.options.pos=F.options.lpos;F.options.x=-(F.options.width*F.options.lpos);C._setPos()})}else{C._transform(D,C.options.time,C.options.speed,0);C._setPos()}},_left:function(){var C=this;if(!C.options.move){return}C.options.move=false;C.options.pos++;var E=-C.options.width*(C.options.pos);var D=E-C.options.x;if(C.options.pos-1==C.options.lpos){C._transform(D,C.options.time,C.options.speed,0,function(F){F.options.pos=1;F.options.x=-F.options.width;C._setPos()})}else{C._transform(D,C.options.time,C.options.speed,0);C._setPos()}},_auto:function(){var C=this;C.options.aotuTime=setInterval(function(){if(C.options.track=="left"){C._left()}else{track._right()}},C.options.interval)},_watchAuto:function(){var C=this;setInterval(function(){if(!C.options.aotuTime){C._auto()}},5000)},_transform:function(F,C,H,D,E){var G=this;if(typeof(C)!="undefined"&&typeof(H)!="undefined"&&C>0&&H>0){D++;if(D>parseInt(C/H)){if(typeof(E)=="function"){E.call(this,G)}G.options.move=true;return}G.options.x+=F*(H/C);G._pos();setTimeout(function(){G._transform(F,C,H,D,E)},H)}else{G.options.x+=F;G._pos();G.options.move=true}},_pos:function(){var C=this;C.options.kernel?C.options.ulImg.css("-"+C.options.kernel+"-transform","translate("+C.options.x+"px, 0px)"):C.options.ulImg.css("transform","translate("+C.options.x+"px, 0px)")},_initHtml:function(){var E=this;var J,C=E.options.urls.length,D;if(!E.options.ulImg){E.options.ulImg=$("<ul></ul>");for(J=0;J<E.options.lpos;J++){var H=E.options.urls[J].split("|")[0];if(E.options.urls[J].split("|").length>1){var G=E.options.urls[J].split("|")[1];if(E.options.urls[J].split("|").length>2){var F=E.options.urls[J].split("|")[2];D=$('<li><a class="clickAds" linkadid="'+F+'" href="'+G+'" target="_blank"><img src="'+H+'" style="width:100%;height:100%;"/></a></li>')}else{D=$('<li><a href="'+G+'" target="_blank"><img src="'+H+'" style="width:100%;height:100%;"/></a></li>')}}else{D=$('<li><img src="'+H+'" style="width:100%;height:100%;"/></li>')}E.options.ulImg.append(D)}$(E.div).append(E.options.ulImg)}if(!E.options.ulBtn&&E.options.lpos>1){E.options.ulBtn=$("<ul></ul>");E.options.ulBtn.css({"position":"absolute","bottom":"15px","margin":"0","padding":"0","height":"18px","list-style":"none",});if(E.options.position=="l"){E.options.ulBtn.css({"left":"20px"})}else{if(E.options.position=="c"){var I=E.options.lpos*21;E.options.ulBtn.css({"left":(E.options.width-I)/2+"px"})}else{E.options.ulBtn.css({"right":"20px"})}}for(J=0;J<E.options.lpos;J++){E.options.ulBtn.append("<li><a>"+J+"</a></li>")}E.options.ulBtn.find("li").css({"float":"left","margin-left":"6px","padding":"0",});E.options.ulBtn.find("li").find("a").css({"width":"10px","height":"10px","box-shadow":"inset 0 0 3px rgab(0,0,0,0.3)","background":"rgba(0,0,0,0.5)","display":"block","text-indent":"-9999px"});if(E.options.shape==null||E.options.shape=="c"){E.options.ulBtn.find("li").find("a").css({"border-radius":"50%"})}$(E.div).append(E.options.ulBtn);if(typeof(E.options.posInit)=="function"){E.options.posInit.call(this,E)}}},_initCssAndEvent:function(){var D=this,F=0;if(D.options.lpos>1){var E=D.options.ulImg.find("li").eq(D.options.lpos-1).clone(),C=D.options.ulImg.find("li").eq(0).clone();D.options.ulImg.find("li").eq(0).before(E);D.options.ulImg.append(C);D._bind("touchstart",D.options.ulImg[0],false);D._bind("touchmove",D.options.ulImg[0],false);D._bind("touchend",D.options.ulImg[0],false);D._transform(-D.options.width);F=2;D._setPos()}D.options.ulImg.wrap('<div style="width:'+D.options.width+'px;height:100%;overflow:hidden;"></div>');D.options.ulImg.css({"width":D.options.width*(D.options.lpos+F)+"px","height":"100%","overflow":"hidden","margin":0,"padding":"0","list-style":"none",});D.options.ulImg.find("li").css({"float":"left","width":D.options.width+"px","height":"100%","overflow":"hidden","padding":"0",})},_setPos:function(){var C=this;if(typeof(C.options.posSet)=="function"){C.options.posSet.call(this,C)}else{C.options.ulBtn.find("li").find("a").css("background","rgba(0,0,0,0.5)");C.options.ulBtn.find("li").eq(C.options.pos-1).find("a").css("background","rgba(0,0,0,0.9)")}},setBroseType:function(){var D=this;dummyStyle=document.body.style;var G="t,webkitT,MozT,msT,OT".split(","),E,F=0,C=G.length;for(;F<C;F++){E=G[F]+"ransform";if(E in dummyStyle){D.options.kernel=G[F].substr(0,G[F].length-1);break}}},_bind:function(E,D,C){D.addEventListener(E,this,!!C)},_unbind:function(E,D,C){D.removeEventListener(E,this,!!C)},};B.slidepic=A})(window);