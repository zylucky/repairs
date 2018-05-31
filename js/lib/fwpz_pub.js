var user_name = '';//用户姓名
var telnumber = '';//手机号
var yzm = '';//验证码
var house_news = '';//房屋信息
var house_ms = '';//房屋描述
var fwpz_type = '';//房屋凭证类型
var arr = [];//全局数组
  var picker = new mui.PopPicker({
	layer: 1
  });
  //根据用户id查询当前登陆用户
  function cx_fwnews(id){
	  mui.ajax(url + '/yskjApp/webApp/dataInfo/getHouseCompanyById',{
			data:{
				'id': id
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	              
			success:function(data){
				//服务器返回响应，根据响应结果，分析是否登录成功；
				if(data.success){
					var alldata = data.data;//
					for (var i = 0; i < alldata.length; i++) {
						var obj = {};
						var str = '';
						var str1 = '';
						var str2 = '';
						var str3 = '';
						for(var j in alldata[i]){
							if(j == 'lpname'){//楼盘名字
								str1 = alldata[i][j];
							}
							if(j == 'zdname'){//座栋
								str2 = ' ' + alldata[i][j];
							}
							if(j == 'fyname'){//房间号
								str3 = '-' + alldata[i][j];
							}
						}
						str = str1 + str2 + str3;
						obj.text = str;
//							obj.value = i;
						arr.push(obj);
					}
				    picker.setData(arr);
					picker.pickers[0].setSelectedIndex(0);
					$('#house_news').val(str);
					house_news = str;
				}else{
//						mui.alert(data.message);
				}
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
			}
		});
  }
if(localStorage.getItem('user_id')){
	var user_id = localStorage.getItem('user_id');
  	cx_fwnews(user_id);
  }

//目标区域的弹出框选择
function fw_news(){
	picker.show(function(SelectedItem) {
		var sel_val = picker.getSelectedItems();
		$('#house_news').val(sel_val[0].text);
	});
}

//用户姓名输入
document.getElementById("user_name").addEventListener('input',function(){
	if(this.value != ''){
		user_name = this.value;
		btnzt();
	}else{
		user_name = '';
		btnzt();
	}
});
//房屋信息输入
document.getElementById("house_news").addEventListener('input',function(){
	if(this.value != ''){
		house_news = this.value;
		btnzt();
	}else{
		house_news = '';
		btnzt();
	}
});
//验证码登陆时判断及交互
//手机号输入
document.getElementById("tel").addEventListener('input',function(){
	if(this.value != ''){
		telnumber = this.value;
		$('.hqyzm').css({'color':'#2b70d8'});
		btnzt();
	}else{
		$('.hqyzm').css({'color':'#c8c8c8'});
		telnumber = '';
		btnzt();
	}
});
//验证码输入
document.getElementById("hqyzm").addEventListener('input',function(){
	if(this.value != ''){
		yzm = this.value;
		btnzt();
	}else{
		yzm = '';
		btnzt();
	}
});
//提交按钮样式变换
function btnzt(){
	if(telnumber != '' && yzm != '' && user_name != '' && house_news != ''){
		$('.btn').css({'background':'#2b70d8'});
	}else{
		$('.btn').css({'background':'#d2d2d2'});
	}
}
//手机号码验证
function checkPhone(id){
   var phone = document.getElementById(id).value;
   if(!(/^1[34578]\d{9}$/.test(phone))){
   		mui.alert('请确认填写手机号是否正确', '提示', function(){});
   		return false;
   }else{
   		return true;
   }
}
//获取验证密码倒计时
var tag = true;
var countdown=60; 
function settime(obj) {
    if (countdown == 0) { 
    	tag = true;
        obj.html("获取验证码");
        countdown = 60; 
        return;
    } else { 
    	tag = false;
        obj.html("重新发送(" + countdown + ")"); 
        countdown--;
    } 
	setTimeout(function() { 
    	settime(obj) 
	},1000)
}
var yzmobj = $('.hqyzm');//获取验证码对象
//点击获取验证码
$('.hqyzm').click(function(){
	telnumber = $('#tel').val();
	if(telnumber != ''){
		if(checkPhone('tel') == true){		
			if(tag){
				tag = false;
				settime(yzmobj);//验证码倒计时
				sendyzm();
			}
//			check_tel();//调取验证系统有无此用户方法
		}
	}else{
		mui.alert('请填写手机号码', '提示', function(){},'div');
	}
});
//生成cookie
function createcookie(){
	var cookyezhi = new Date;
	localStorage.setItem('cookyezhi', JSON.stringify(cookyezhi));
	return cookyezhi;
}
//发送验证码方法
function sendyzm(){
	mui.ajax(url + '/yskjApp/appYskj/V1/getServiceCode.do',{
		data:{
			"phone":telnumber,
			"cookie":createcookie()
		},
		dataType:'json',
		type:'post',
		timeout:10000,
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			if(data.success){
				console.log('验证码发送成功！')
			}else{
				mui.toast(data.message,{ duration:'3000', type:'div' }) 
			}
		},
		error:function(xhr,type,errorThrown){
			console.log(type);
		}
	});	
}
//委托房源提交
$('.wt_btn').click(function(){
	if(user_name=='' && telnumber=='' && yzm=='' && house_news==''){
		return;
	}else{
		if(user_name==''){
			mui.alert('姓名不能为空', '提示', function(){},'div');
			return;
		}
		if(telnumber==''){
			mui.alert('手机号不能为空', '提示', function(){},'div');
			return;
		}
		if(yzm==''){
			mui.alert('验证码不能为空', '提示', function(){},'div');
			return;
		}
		if(house_news==''){
			mui.alert('房屋信息不能为空', '提示', function(){},'div');
			return;
		}
	}
	yz_house_wt();
});
//验证并委托方法
function yz_house_wt(){
	var code = $('#hqyzm').val();
	house_ms = $('#house_ms').val();
	mui.ajax(url+'/yskjApp/appYskj/V1/compServiceCode.do',{
		data:{
			'code':code,
			'cookie': JSON.parse(localStorage.getItem('cookyezhi'))
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			if(data.success){
				mui.ajax(url + '/yskjApp/webApp/dataInfo/butlerService.do',{
					data:{
						'type': '3',
						'category': fwpz_type,
						'name': user_name,
						'phone': telnumber,
						'memo': house_ms,
						'repairHouse': house_news,
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					headers:{'Content-Type':'application/json'},	              
					success:function(data){
						//服务器返回响应，根据响应结果，分析是否登录成功；
						if(data.success){
							mui.toast('报修成功，我们将会与您联系',{ duration:2000, type:'div' });
							setTimeout(function(){
								mui.back();								
							},1000);
						}else{
							mui.alert(data.message);
						}
					},
					error:function(xhr,type,errorThrown){
						//异常处理；
						console.log(type);
					}
				});	
			}else{
				mui.alert(data.message);
			}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			console.log(type);
		}
	});
}
