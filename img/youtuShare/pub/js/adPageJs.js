function initAdPagePosition(M){try{var H=$(window).height();if(M){var D=$("#imgWidth").val();var J=$("#imgHeight").val();var F=0;if(640/H>D/J){F=(640/D*J-H)/2}$(".tuiguangCon").css("height",H+"px");$(".tuiguangCon").css("top",F+"px")}var E=$(".tuiguang").css("height").replace("px","");var L=$(".tuiguangTxt").css("height").replace("px","");var G=$(".market-notice").css("height").replace("px","");var K=(H-E-L-G-20);$(".hotShare").css("height",K+"px");var B=115;var C=40;var I=Math.floor(K/(B+C)+0.1);var A=(K/I-B)/2;$(".shareItem").css("padding",A+"px 0px")}catch(N){}};