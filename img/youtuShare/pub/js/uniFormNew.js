/**
 * 表单验证函数控制
 * -->提交按钮的点击事件
 * -->每一个表单的输入值进行验证
 * -->正则验证的函数
 * -->异步提交的函数
 * -->提交显示信息的函数
 */
;(function(window){
	var uniFormNew = function(){
		var that = this;
		that.hasSubmitInfoForms=[];								//是否已经提交信息表单列表
		return that;
	};
	uniFormNew.prototype = {
			// 提交按钮点击，进行验证函数
		 	signUp_submit 	: function(){
		 		var that = this;
		 		var submitBtn = ".submit-from-btn";
		 		$(submitBtn).on('click',function(e){
			 		e.preventDefault();
			 		var form = $(this).parents('.uniForm');
		 			var formID = form.find("input[name='comID']").val();
		 			if(that.hasSubmitInfoForms.length>0){
		 				for(var i=0;i<that.hasSubmitInfoForms.length;i++){
		 					if(that.hasSubmitInfoForms[i]==formID){
		 						that.showCheckMessage('您已经提交过信息了！',true);
		 						return;
		 					}
		 				}
		 			}
			 		var valid = that.signUpCheck_input(form);
			 		if(valid) {
			 			that.signUpCheck_submit(form);
			 		}
			 		else return;
			 	})
		 	},
		 	// 我要报名表单验证函数
		 	signUpCheck_input	: function (form, type){
		 		var that = this;
				var valid = true;
				var inputs = form.find('input,textarea');
				inputs.each(function(){
					if(this.name != '' && this.name != 'undefined'){
						//函数验证
						var allowEmpty = $(this).attr('allowEmpty')=='true';
						var name = $(this).attr("keyName");
						if(name == null || typeof(name)=="undefined"){
							name = this.name;
						}
						var backData;
						if(name.indexOf("Prop")>-1){
							var cusName = $(this).parents("tr").find("th").html();
							if(cusName!=null){
								cusName = cusName.substr(0,cusName.length-1);
							}
							backData	= {
									empty_tip	:cusName+"不能为空",
									reg_tip		:reg_tip,
									reg 		:reg
								};
						}else{
							backData	= that.regFunction(name);
						}
						var empty_tip = backData.empty_tip,
							reg       = backData.reg,
							reg_tip   = backData.reg_tip;
						//根据结果处理
						if ($.trim($(this).val()) == ''&&!allowEmpty) {
							that.showCheckMessage(empty_tip, true);
							$(this).focus();
							$(this).addClass('z-error');
							valid = false;
							return false;
						}
						if(!allowEmpty){
							if (reg != undefined && reg != '') {
								if(!$(this).val().match(reg)){
									$(this).focus();
									$(this).addClass('z-error');
									that.showCheckMessage(reg_tip, true);
									valid = false;
									return false;		
								}
							}
						}
						$(this).removeClass('z-error');
						$('.u-note-error').html('');	
					}
				});
				if (valid == false) {
					return false;
				}else{
					return true;
				}
			},
			
			// 正则函数验证
			regFunction	: function(inputName){
				var that = this;
				var empty_tip = '',
					reg_tip = '',
					reg = '';

				//判断
				switch (inputName) {
					case 'name':
						reg = /^[\u4e00-\u9fa5|a-z|A-Z|\s]{1,20}$/;
						empty_tip = '不能落下姓名哦！';
						reg_tip = '这名字太怪了！';
						break;
					case 'sex':
						empty_tip = '想想，该怎么称呼您呢？';
						reg_tip = '想想，该怎么称呼您呢？';
						break;
					case 'tel':
						reg = /^1[0-9][0-9]\d{8}$/;
						empty_tip = '有个联系方式，就更好了！';
						reg_tip = '这号码,可打不通... ';
						break;
					case 'email':
						//reg = /(^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$)/i;
						reg = /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/i;
						empty_tip = '都21世纪了，应该有个电子邮箱吧！';
						reg_tip = '邮箱格式有问题哦！';
						break;
					case 'computer':
						reg = /^[\u4e00-\u9fa5|a-z|A-Z|\s|\d]{1,20}$/;
						empty_tip = '填个公司吧！';
						reg_tip = '这个公司太奇怪了！';
						break;
					case 'industry':
						reg = /^[\u4e00-\u9fa5|a-z|A-Z|\s|\d]{1,20}$/;
						empty_tip = '所属行业不能为空！';
						reg_tip = '这个行业太奇怪了！';
						break;
					case 'job':
						reg = /^[\u4e00-\u9fa5|a-z|A-Z|\s]{1,20}$/;
						empty_tip = '请您填个职位';
						reg_tip = '这个职位太奇怪了！';
						break;
					case 'Prop1':
						empty_tip = '请填写美团团购号';
						reg_tip = '';
						break;
					case 'address':
						empty_tip = '请填写收货地址';
						reg_tip = '这个地址太奇怪了！';
						break;
					case 'date':
						empty_tip = '给个日期吧！';
						reg_tip = '';
						break;
					case 'weixin':
						empty_tip = '必须填写微信号哦！';
						reg_tip = '';
						break;
					case 'time':
						empty_tip = '填下具体时间更好哦！' ;
						reg_tip = '' ;
						break;
					case 'age':
						reg = /^([3-9])|([1-9][0-9])|([1][0-3][0-9])$/;
						empty_tip = '有个年龄就更好了！';
						reg_tip = '这年龄可不对哦！' ;
						break;
					case 'yingye':
						empty_tip = '';
						reg_tip = '' ;
						break;
					case 'uploadImg':
						empty_tip = '请上传图片';
						break;
				}
				return {
					empty_tip	:empty_tip,
					reg_tip		:reg_tip,
					reg 		:reg
				}
			},

			// ajax异步提交表单数据
			signUpCheck_submit	: function (form){
				var that = this;
				 that.loadingPageShow();
				 var shareID = $("#shareID").val();
				 var formID = form.find("input[name='comID']").val();
				 var url = '/uwp/newServlet?serviceName=ShareMag&medthodName=addShareInfoNew&shareID='+shareID;
				// // ajax提交数据
				 $.ajax({
				 	url: url,
				 	cache: false,
				 	dataType: 'json',
				 	async: true,
				 	type:'POST',
				 	contentType: "application/x-www-form-urlencoded; charset=utf-8",
				 	data: form.serialize(),
				 	success: function(msg){
				 		that.loadingPageHide();
				 		 if(msg.code==200){
								// 提示成功
				 		that.showCheckMessage('提交成功！',true);
				 		that.hasSubmitInfoForms.push(formID);

				 		if(typeof(car2)!="undefined"){
				 			car2.page_start();
				 		}
				 		
			 			// 关闭窗口
				 		setTimeout(function(){
				 			$('.u-arrow').removeClass('f-hide');
				 			$('.u-audio').removeClass('f-hide');
				 			$('.book-form').removeClass('z-show');
				 			$('.book-bg').removeClass('z-show');
				 			setTimeout(function(){
				 				$(document.body).css('height','100%');
								$('.book-bg').addClass('f-hide');
				 				$('.book-form').addClass('f-hide');
				 			},500)
				 		},1000)

				 		// 按钮变色
				 		$('.book-bd .bd-form .btn').addClass("z-stop");
				 		$('.book-bd .bd-form .btn').attr("data-submit",'true');
						
						}else if(msg.code=='400'){
							that.hasSubmitInfo = false;
							that.showCheckMessage('提交失败',false);
				 		 }
						
						
				 	},
				 	error : function (XMLHttpRequest, textStatus, errorThrown) {
				 		that.showCheckMessage(errorThrown,true);
				 		setTimeout(function(){
				 			that.loadingPageHide();
				 		},500)
				 	}
				 })
			},

			// 显示验证信息
			showCheckMessage	: function (msg, error) {
				if (error) {
					$('.u-note-error').html(msg);
					$(".u-note-error").addClass("on");
					$(".u-note-sucess").removeClass("on");

					setTimeout(function(){
						$(".u-note").removeClass("on");
					},2000);
				} else {
					$(".u-note-sucess").addClass("on");
					$(".u-note-error").removeClass("on");

					setTimeout(function(){
						$(".u-note").removeClass("on");
					},2000);
				}
			},
			// loading显示
			loadingPageShow : function(){
				$('.u-pageLoading').show();
			},
			
			// loading隐藏
			loadingPageHide : function (){
				$('.u-pageLoading').hide();	
			},
	}
	window.uniFormNew = uniFormNew;
})(window);
