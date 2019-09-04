define(["/youtuShare/pub/js/imgHelper.js", "/youtuShare/pub/js/numberHelper.js"],function (imgHelper,numberHelper) {
	return {
		init:function(){
			var config = {
					bgColor : "#000",
					photos : [[{
								width : "180px",
								height : "240px",
								top : "160px",
								left : "32px"
							}, {
								width : "240px",
								height : "200px",
								top : "27px",
								left : "183px"
							}, {
								width : "200px",
								height : "240px",
								top : "200px",
								left : "234px"
							}, {
								width : "180px",
								height : "240px",
								top : "181px",
								left : "450px"
							}, {
								width : "200px",
								height : "200px",
								top : "417px",
								left : "134px"
							}, {
								width : "200px",
								height : "160px",
								top : "464px",
								left : "440px"
							}, {
								width : "200px",
								height : "280px",
								top : "360px",
								left : "0px"
							}, {
								width : "200px",
								height : "200px",
								top : "0px",
								left : "12px"
							}, {
								width : "200px",
								height : "200px",
								top : "0px",
								left : "440px"
							}, {
								width : "180px",
								height : "240px",
								top : "400px",
								left : "303px"
							}
						], [{
								width : "200px",
								height : "180px",
								top : "29px",
								left : "169px"
							}, {
								width : "200px",
								height : "240px",
								top : "305px",
								left : "369px"
							}, {
								width : "180px",
								height : "180px",
								top : "0px",
								left : "380px"
							}, {
								width : "200px",
								height : "260px",
								top : "216px",
								left : "49px"
							}, {
								width : "180px",
								height : "160px",
								top : "458px",
								left : "169px"
							}, {
								width : "200px",
								height : "280px",
								top : "10px",
								left : "10px"
							}, {
								width : "180px",
								height : "180px",
								top : "103px",
								left : "449px"
							}, {
								width : "200px",
								height : "200px",
								top : "234px",
								left : "232px"
							}, {
								width : "240px",
								height : "180px",
								top : "460px",
								left : "400px"
							}, {
								width : "200px",
								height : "200px",
								top : "436px",
								left : "3px"
							}
						]]
				},
				initPhotoWall=function(){
					$(".photoWall").each(function(){
						var that = $(this);
						var fileEle = $("<input style='opacity:0;position:absolute;width:100%;height:100%;' type='file' class='file' accept='image/*' capture='camera'>");
						that.append(fileEle);
						console.info(">>>>");
						fileEle.on("change",selectPhotoChange);
						imgHelper.getPhotoAllList($("#shareID").val(),{"comID":that.attr("comID"),"count":20},function(listData){
							for(var i=0;i<listData.list.length;i++){
								var img = listData.list[i];
								addToPhotoWall(img.photo,that);
							}
							wallStartScroll(that.attr("comid")+"_wall");
						});
					});
				},
				selectPhotoChange = function(e){
					showLoading();
					var reader = new FileReader();
					var curFile = e.target;
					reader.onload = function(e) {
				    	imgHelper.compress(e.target.result,"",function(t){
				    		imgPreview(t.base64Img,function(){
				    			var curItem = $(curFile).parent();
				    			addToPhotoWall(t.base64Img,curItem);
				    			wallStartScroll(curItem.attr("comid")+"_wall");
				    			hideLoading();
				    			uploadToServer(t.base64Img,curItem.attr("comID"),$("#shareID").val());
				    		});
						});
					}
					reader.readAsDataURL(e.target.files[0]);
				},
				showLoading = function(){
					var loadingDivEle;
					if($("#loadingDiv").length==0){
						var loadingDiv = ['<div id=\"loadingDiv\" style=\"z-index:9999999;position: fixed; width: 100%; height: 100%; top: 0px;display: none;background-color: rgba(0, 0, 0, 0.498039);\">',
						                  '<div class="loading-circle" style="background-image: url(/youtuShare/pub/img/loading_2.png); background-repeat: no-repeat;background-position: center;left: 50%;top: 50%;">',
						                  '</div>',
						                  '</div>'];
						loadingDivEle = $(loadingDiv.join(""));
						$(document.body).append(loadingDivEle);
					}else{
						loadingDivEle  = $("#loadingDiv");
					}
					loadingDivEle.show();
				},
				hideLoading = function(){
					$("#loadingDiv").hide();
				},
				uploadToServer=function(imgData,comID,shareID){
					var params = {comID:comID,photo_data:imgData};
					imgHelper.addPhotoAll(shareID,params,function(){
						console.info("uploadSuccess");
					});
				},
				addToPhotoWall=function(previewUrl,curItem){//添加一个图片到照片墙
					var comID = curItem.attr("comid");
					var pwc;
					if(curItem.parent().find(".c-photo-wall").length>0){
						pwc = curItem.parent().find(".child-container")[0];
					}else{
						pwc = $("<div class=\"child-container\"></div>");
						curItem.before($("<div class=\"c-photo-wall\" id=\""+comID+"_wall\"></div>").append(pwc));
					}
					
					//如果是水平翻页把z-index去掉
					curItem.parent().find(".c-photo-wall").css("z-index","inherit");
					
					var pwcpage;
					var wallPages = $(pwc).find(".photo-wall");
					if(wallPages.length>0){
						for(var i=0;i<wallPages.length;i++){
							if($(wallPages[i]).children().length<100){
								pwcpage = $(wallPages[i]);
								break;
							}
						}
						if(typeof(pwcpage) == 'undefined'){
							pwcpage = $("<div class=\"photo-wall wall"+($(pwc).find(".photo-wall").length+1)+"\"></div>");
							$(pwc).append(pwcpage);
						}
					}else{
						pwcpage = $("<div class=\"photo-wall wall1\"></div>");
						$(pwc).append(pwcpage);
					}
					if($(pwc).find(".photo-wall").length==1){
						$(pwc).css("width","640px");
					}else{
						$(pwc).css("width",($(pwc).find(".photo-wall").length+1)*640+"px");
					}
					var index = pwcpage.children().length%10;
					var opt = config.photos[0][index];
					var photoItem = $("<div class='photo-wall-item' style=\"left:"+opt.left+";top:"+opt.top+"; width:"+opt.width+";height:"+opt.height+";background-size:100% 100%; background-image:url('"+previewUrl+"')\"></div>");
					bgImgAutomaticFit(previewUrl,opt.width,opt.height,photoItem);
					var startDelay = pwcpage.children().length;
					if(imgHelper.isBase64(previewUrl)){
						startDelay = 1;
					}
					photoItem.css("animation", "fadein 1s ease-out " + .3 * startDelay + "s backwards").css("-webkit-animation", "fadein 1s ease-out " + .3 * startDelay + "s backwards");
					pwcpage.append(photoItem);
				},
				wallStartScroll=function(wallID){//开始滚动
//					var walls =  $("#"+wallID).find(".photo-wall");
//					if(walls.length>1){
//						$("#"+wallID).find(".child-container").append($(walls[0]).clone());
//					}
//					$("#"+wallID).find(".child-container").animate({left:"-640px"},2000,"linear");
				},
				imgPreview=function(previewUrl,okCallBack){
					var previewHtml = ['<div class="imgPreShow a-fadein" style="z-index:9999999;width: 100%; height: 100%; position: fixed; left: 0px; top: 0px;background-color:#000;background-size: 100% 100%;">',
					         '<div class="imgPreShowBack" style="background-color: rgba(0,0,0,0.6);width: 100%; height: 100%; position: absolute;"></div>',
					         '<div class="f-fix" style="margin:120px auto 0px auto;height: 640px;width: 520px;">', 
					         '<div class="a-fadein" style="background-size:contain;float:left;position: relative;border: 10px solid white;box-sizing: border-box;;width: 100%;height: 100%;background-repeat: no-repeat;background-position: center;background-color: rgba(0,0,0,1);background-image: url(' + previewUrl + ')">', 
					         "</div>", 
					         "</div>", 
					         '<div style="width:318px;height:88px; position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);-webkit-transform: translateX(-50%);">', 
					         '<img class="cancelBtn" src="/youtuShare/pub/img/cancel.png" style="width: 88px; height:88px;margin-right: 142px;"/>',
					         '<img class="okBtn" src="/youtuShare/pub/img/ok.png" style="width: 88px; height:88px;"/>', 
					         "</div>", 
					         "</div>"];
					previewHtml = $(previewHtml.join(""));
					previewHtml.bind("click", ".cancelBtn", function () {
						$(this).parents(".imgPreShow").remove();
						hideLoading();
					});
					previewHtml.bind("click", ".okBtn", function () {
						$(this).parents(".imgPreShow").remove();
						okCallBack&&okCallBack.call();
					});
					$(document.body).append(previewHtml);
				},
				bgImgAutomaticFit=function(imgUrl,w,h,itemPhoto) {
					if(imgUrl) {
						var img = new Image;
						img.onload = function () {
							var newSize = automaticFit({
									cHeight : h,
									cWidth : w,
									imgHeight : this.height,
									imgWidth : this.width
								});
							newSize.backgroundSize && itemPhoto.css("backgroundSize", newSize.backgroundSize),
							newSize.backgroundPosition && itemPhoto.css("backgroundPosition", newSize.backgroundPosition)
						},
						img.src = imgUrl;
					}
				},
				/**
			     * 图片作为背景自动适应容器对象，不压缩，但是也铺满
			     * @param obj
			     * @returns {*|a}
			     */
				automaticFit=function (obj) {
					var numHelper = require('/youtuShare/pub/js/numberHelper.js');
			        // 容器宽
			        var cWidth = parseFloat(obj.cWidth);
			        // 容器高
			        var cHeight = parseFloat(obj.cHeight);
			        // 图片宽
			        var imgWidth = parseFloat(obj.imgWidth);
			        // 图片高
			        var imgHeight = parseFloat(obj.imgHeight);

			        var widthRatio = numHelper.div(cWidth, imgWidth);
			        var heightRatio = numHelper.div(cHeight, imgHeight);
			        var ratio = Math.max(widthRatio, heightRatio);

			        var bgWidth = numHelper.mul(imgWidth, ratio);
			        var bgHeight = numHelper.mul(imgHeight, ratio);

			        var res = {};
			        res.backgroundSize = bgWidth + 'px ' + bgHeight + 'px';
			        res.backgroundPosition = (numHelper.div(numHelper.sub(bgWidth, cWidth), 2) * -1) + 'px ' + (numHelper.div(numHelper.sub(bgHeight, cHeight), 2) * -1) + 'px';

			        return res;
			    };
//			    $(window).on("load",function(){
					initPhotoWall();
//				});
		}
	}
});
