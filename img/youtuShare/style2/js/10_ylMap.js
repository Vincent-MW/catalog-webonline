(function(A){A.fn.ylmap=function(C){A.fn.ylmap.defaults={detal:{sign_name:"TXjiang",contact_tel:18624443174,address:"天安门"},latitude:39.915,longitude:116.404,fnOpen:null,fnClose:null};var B=A.extend({},A.fn.ylmap.defaults,C);return this.each(function(){console.log(A(this));var U=A(this),L=B.detal,M=B.latitude,S=B.longitude,W=B.fnClose,N=B.fnOpen,H=U.hasClass("bigOpen"),K=null,O=null,P=null,T=null;var V,R,Y,G;var J=A('<div id="BDMap" class="BDMap"></div>');U.append(J);U.append(A('<div id="transit_result"></div>'));U.append(A('<div class="tit"><p><a href="javascript:void(0)"><span class="css_sprite01"></span>'+L.address+"</a></p></div>"));U.append(A('<p class="map_close_btn">退出</p>'));if(U.length>0){var Q=U.height()}if(H){U.find(".map_close_btn").css("display","block")}if(A("#transit_result").length>0&&A("#transit_result").html()!=""){A(".transitBtn").removeClass("hide")}var D=function(){if(U.size()>0){R=new BMap.Map(J.attr("id")),Y=new BMap.Point(S,M),G=new BMap.Marker(Y);R.enableScrollWheelZoom();R.enableInertialDragging();R.centerAndZoom(Y,15);R.addOverlay(G);F();G.addEventListener("click",function(Z){F()});R.addEventListener("click",function(Z){return false});R.addEventListener("zoomend",function(Z){var a=R.getZoom();R.centerAndZoom(Y,a)})}},F=function(){E(G,L)},E=function(c,a){var Z=A('<div class="infoWindow"></div>');if(typeof(a.contact_tel)!="undefined"){Z.append('<p class="tel"><a href="tel:'+a.contact_tel+'">'+a.contact_tel+"</a></p>")}Z.append('<p class="address">'+a.address+"</p>");Z.append('<div class="window_btn"><span class="open_navigate open_bus" onclick="open_navigate(this)">公交</span><span class="open_navigate open_car" onclick="open_navigate(this)">自驾</span><span class="State"></span></div>');var b={width:0,height:0,title:" "};var d=new BMap.InfoWindow(Z[0],b);c.openInfoWindow(d,R.getCenter())};open_navigate=function(Z){A(Z).hasClass("open_bus")?K="bus":K="car";navigate();A(".infoWindow").find("span.State").html("正在定位您的位置！")},navigate=function(){if(window.navigator.geolocation){window.navigator.geolocation.getCurrentPosition(handleSuccess,handleError,{timeout:10000})}else{alert("sorry！您的设备不支持定位功能")}},handleError=function(Z){var a;switch(Z.code){case Z.TIMEOUT:a="获取超时!请稍后重试!";break;case Z.POSITION_UNAVAILABLE:a="无法获取当前位置!";break;case Z.PERMISSION_DENIED:a="您已拒绝共享地理位置!";break;case Z.UNKNOWN_ERROR:a="无法获取当前位置!";break}if(A(".infoWindow").find("span.State").length>0){A(".infoWindow").find("span.State").html(a)}else{alert(a)}},handleSuccess=function(a){var c=a.coords;var Z=c.latitude;var b=c.longitude;T=new BMap.Point(b,Z);A(".infoWindow").find("span.State").html("获取信息成功，正在加载中！");if(K=="bus"){bus_transit()}else{self_transit()}if(!H){J.parent().addClass("open")}else{J.parent().addClass("mapOpen")}};A(".map_close_btn").on("click",function(){U.removeClass("mapOpen open");if(W){W()}});bus_transit=function(){if(O){O.clearResults()}if(P){P.clearResults()}if(!T){alert("抱歉：定位失败！");return}A(".fn-audio").hide();if(typeof(loadingPageShow)=="function"){loadingPageShow()}A(".infoWindow").find("span.State").html("正在绘制出导航路线");var Z=A("#transit_result")||A('<div id="transit_result"></div>');Z.appendTo(U);O=new BMap.TransitRoute(R,{renderOptions:{map:R,panel:"transit_result",autoViewport:true},onSearchComplete:searchComplete});O.search(T,Y)},self_transit=function(){if(O){O.clearResults()}if(P){P.clearResults()}if(!T){alert("抱歉：定位失败！");return}A(".fn-audio").hide();if(typeof(loadingPageShow)=="function"){loadingPageShow()}A(".infoWindow").find("span.State").html("正在绘制出导航路线");var Z=A("#transit_result")||A('<div id="transit_result"></div>');Z.appendTo(U);P=new BMap.DrivingRoute(R,{renderOptions:{map:R,panel:Z.attr("id"),autoViewport:true},onSearchComplete:searchComplete});P.search(T,Y)},searchComplete=function(b){if(b.getNumPlans()==0){alert("非常抱歉,未搜索到可用路线");R.reset();R.centerAndZoom(Y,15);F();A("#transit_result").removeClass("open").hide();A(".transitBtn").hide()}else{A("#transit_result").addClass("open");A(".infoWindow").find("span.State").html("");if(!A(".transitBtn").length>0){A("#transit_result").after(A('<p class="transitBtn close" onclick="transit_result_close()"><a href="javascript:void(0)">关闭</a></p>'));A("#transit_result").after(A('<p class="transitBtn bus" onclick="bus_transit()"><a href="javascript:void(0)">公交</a></p>'));A("#transit_result").after(A('<p class="transitBtn car" onclick="self_transit()"><a href="javascript:void(0)">自驾</a></p>'))}U.find(".close_map").show();A("#transit_result").addClass("open");A(".transitBtn").show();A("#transit_result").on("touchstart",a);A("#transit_result").on("touchmove",Z);function a(d){var c;c=window.event.touches[0].pageY;V=c}function Z(e){e.stopPropagation();e.preventDefault();var c;c=window.event.touches[0].pageY;var d=A(this).scrollTop();A(this).scrollTop(d+V-c);V=c}}if(typeof(loadingPageHide)=="function"){loadingPageHide()}if(!H){U.css({"position":"fixed","top":"0","left":"0","height":"100%",})}if(A("#transit_result").hasClass("open")){A(".close").find("a").html("关闭")}else{A(".close").find("a").html("打开")}};transit_result_close=function(){if(A("#transit_result").hasClass("open")){A("#transit_result").removeClass("open");A(".close").find("a").html("打开")}else{A("#transit_result").addClass("open");A(".close").find("a").html("关闭")}};window.mapInit=D;function I(){if(A(".BDS").length<=0){var a=document.createElement("script");a.src="http://api.map.baidu.com/api?v=1.4&callback=mapInit";a.className+="BDS";document.head.appendChild(a)}else{D()}if(A(".BDC").length<=0){var d=document.createElement("style");d.type="text/css";d.className+="BDC";var c=X();if(c){mapScale=1;phoneScale=1}else{if(phoneScale>1){mapScale=1}else{mapScale=1/phoneScale}}var Z=A(window).height();var b=".ylmap.open,.ylmap.mapOpen {height:100%;width:100%;background:#fff;}.ylmap img {max-width:initial!important;}.ylmap .tit { position:absolute; left:0; bottom:0; height:70px; width:100%; overflow: hidden; background:rgba(0,0,0,0.5); }.ylmap .tit p { margin-right:100px; }.ylmap .tit p a { position:relative; display:block; font-size:24px; color:#fff; height:70px; line-height:70px; padding-left:70px; }.ylmap .tit p a span { position:absolute; left:15px; top:15px; display:inline-block; width:40px;height:40px; }.ylmap .tit .close_map { display:none; position: absolute; bottom: 15px; right: 20px; width: 40px; height: 40px; margin-right:0; cursor:pointer; background-position: -100px -73px; }.ylmap .map_close_btn{position:absolute;top:10px;left:10px;display:none;width:80px;box-shadow:0 0 2px rgba(0,0,0,0.6) inset, 0 0 2px rgba(0,0,0,0.6);height:80px;border-radius:80%;color:#fff;background:rgba(230,45,36,0.8);text-align:center;line-height:80px;font-size:26px; font-weight:bold;cursor:pointer;}.ylmap.open .map_close_btn{display:block;}.ylmap.mapOpen .map_close_btn{display:block;}#BDMap {transform:scale("+mapScale+");-webkit-transform:scale("+mapScale+");}#BDMap {width:100%;height:100%;}#BDMap img{width:auto;height:auto;}.ylmap.open .transitBtn{display:block;}.ylmap.mapOpen .transitBtn{display:block;}.transitBtn {display:none;position:absolute;z-index:3000;}.transitBtn a{display:block;width:80px;box-shadow:0 0 2px rgba(0,0,0,0.6) inset, 0 0 2px rgba(0,0,0,0.6);height:80px;border-radius:80%;color:#fff;background:rgba(230,45,36,0.8);text-align:center;line-height:80px;font-size:24px; font-weight:bold}.transitBtn.close {top:10px;right:10px;}.transitBtn.bus {top:10px;right:110px;}.transitBtn.car {top:110px;right:10px;}.transitBtn.bus a{background:rgba(28,237,235,0.8);}.transitBtn.car a{background:rgba(89,237,37,0.8);}#transit_result{display:none;position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000;overflow-y:scroll;}#transit_result.open{display:block;}#transit_result h1{font-size:26px!important;}#transit_result div[onclick^='Instance']{background:none!important;}#transit_result span{display:inline-block;font-size:20px;padding:0 5px;}#transit_result table {font-size:20px!important;}#transit_result table td{padding:5px 10px!important;line-height:150%!important;}.infoWindow p{margin-bottom:10px;}.infoWindow .window_btn .open_navigate{display:inline-block;padding:2px 6px; margin-right:10px;border:1px solid #ccc;border-radius:6px;text-align:center;cursor:pointer;}.anchorBL{display:none!important;}";d.innerHTML=b;document.head.appendChild(d)}}function X(){var Z=navigator.userAgent;var b=new Array("Android","iPhone","SymbianOS","Windows Phone","iPad","iPod");var c=true;for(var a=0;a<b.length;a++){if(Z.indexOf(b[a])>0){c=false;break}}return c}I()})}})(Zepto);