jQuery().ready(function(){var B="/uwp/newServlet?serviceName=ShareMag&medthodName=getWXParames";var C=window.location.href;var A={"curUrl":C};jQuery.get(B,A,getWXParamesCallBack,"text")});function getWXParamesCallBack(A,D){if(A!=""){var C=JSON.parse(A);var F="";var B="";var E="";wx.config({debug:false,appId:"wx91e4c1925de9ff50",timestamp:C.timestamp,nonceStr:C.noncestr,signature:C.signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo"]});wx.ready(function(){alert("window.location.href"+window.location.href);wx.onMenuShareAppMessage({title:"title",desc:"shareDec",link:window.location.href,imgUrl:"http://wt.360youtu.com/design/share/2015/01/28/2249/35598/001.jpg"});wx.onMenuShareTimeline({title:"shareTitle",link:window.location.href,imgUrl:"http://wt.360youtu.com/design/share/2015/01/28/2249/35598/001.jpg"});wx.onMenuShareQQ({title:shareTitle,desc:shareDec,link:window.location.href,imgUrl:shareImg})})}};