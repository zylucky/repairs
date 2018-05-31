//弹出系统按钮选择框
var page=null; 
page={ 
    imgUp:function(){ 
        var m=this; 
       /* console.log(m);*/
        plus.nativeUI.actionSheet({cancel:"取消",buttons:[ 
            {title:"拍照"}, 
            {title:"从相册中选择"} 
        ]}, function(e){//1 是拍照  2 从相册中选择 
            switch(e.index){ 
                case 1:appendByCamera();break; 
                case 2:appendByGallery();break; 
            } 
        }); 
    } 
}

$('#add_img').click(function(){
	page.imgUp();
});
function appendByCamera(){
	cameraimages();//拍照添加图片
}
function appendByGallery(){
	galleryImgs();//从相册选择照片
}
//图片上传
mui.init();
mui.plusReady(function() {})
       //上传单张图片
function galleryImg() {
    //每次拍摄或选择图片前清空数组对象
    f1.splice(0, f1.length);
//          document.getElementsByClassName("showimg")[0].innerHTML = null;
    // 从相册中选择图片
    mui.toast("请从相册中选择图片");
    plus.gallery.pick(function(path) {
        showImg(path);
    }, function(e) {
        mui.toast("取消选择图片");
    }, {
        filter: "image",
        multiple: false
    });
}

function galleryImgs() {
    //每次拍摄或选择图片前清空数组对象
    f1.splice(0, f1.length);
	//document.getElementsByClassName("showimg")[0].innerHTML = null;
    // 从相册中选择图片
    mui.toast("请从相册中选择图片");
    plus.gallery.pick(function(e) {
    	
		//  if (e.files.length != 20) {
		//     mui.toast('请选择身份证正面和背面照片共两张');
		//     return false;
		//  }
        for (var i in e.files) {
            showImg(e.files[i]);
        }
    }, function(e) {
        mui.toast("取消选择图片");
    }, {
        filter: "image",
        multiple: true
    });
}
        
// 拍照添加文件
function cameraimages() {
    //每次拍摄或选择图片前清空数组对象
    f1.splice(0, f1.length);
//  document.getElementsByClassName("showimg")[0].innerHTML = null;
    var cmr = plus.camera.getCamera();
    cmr.captureImage(function(p) {
        plus.io.resolveLocalFileSystemURL(p, function(entry) {
            var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径
            showImg(localurl);
        });
    }, function(e) {
        mui.toast("很抱歉，获取失败 ",e);
    });
}
        
// 全局数组对象，添加文件,用于压缩上传使用
var f1 = new Array();
var arr_src = [];
function showImg(url) {
    // 兼容以“file:”开头的情况
    if (0 != url.toString().indexOf("file://")) {
        url = "file://" + url;
    }
    var _div_ = document.getElementsByClassName("showimg")[0];
    var _img_ = new Image();
    _img_.className = 'pic_img';
    _img_.src = url; // 传过来的图片路径在这里用。
        _img_.onclick = function() {
                plus.runtime.openFile(url);
            };
    _img_.onload = function() {
        var tmph = _img_.height;
        var tmpw = _img_.width;
        var isHengTu = tmpw > tmph;
        var max = Math.max(tmpw, tmph);
        var min = Math.min(tmpw, tmph);
        var bili = min / max;
        if (max > 1200) {
            max = 1200;
            min = Math.floor(bili * max);
        }
        tmph = isHengTu ? min : max;
        tmpw = isHengTu ? max : min;
        _img_.style.border = "1px solid rgb(200,199,204)";
        _img_.style.margin = "0.133333rem 0.133333rem 0 0";
        _img_.style.width = "2.053333rem";
        _img_.style.height = "2.053333rem";
        _img_.onload = null;
        plus.io.resolveLocalFileSystemURL(url, function(entry) {
                entry.file(function(file) {
                    console.log(file.size + '--' + file.name);
                    canvasResize(file, {
                        width: tmpw,
                        height: tmph,
                        crop: false,
                        quality: 50, //压缩质量
                        rotate: 0,
                        callback: function(data, width, height) {
                            f1.push(data);
                            _img_.src = data;
                            var oDiv = document.createElement('div');//新建元素
                            var oSpan = document.createElement('span');
                            oDiv.className = 'del_pic';//添加删除框样式
                            oSpan.className = 'del_pic_btn';//添加删除按钮样式
                            oSpan.innerText = '+';
                            oSpan.addEventListener("click",fun1,false); 
                            _div_.before(oDiv);//添加外层地v
                            oDiv.appendChild(_img_);//图片显示到页面
                            oDiv.appendChild(oSpan);//添加删除按钮
                            plus.nativeUI.closeWaiting();
                        }
                    });
                });
            },
            function(e) {
                plus.nativeUI.closeWaiting();
                console.log(e.message);
            });
    };
};

function imgupgrade() {
    var wt = plus.nativeUI.showWaiting();
    for(var i in f1){
    	var  imgArray=[];//通过逗号分割到新的编码
    	var newImgbase = f1[i].split(",")[1];
        imgArray.push(newImgbase);//放到imgArray数组里面
        picupload(imgArray,i);
    }
}

function picupload(imgArray,num){
	mui.ajax(Interface_url + "/yhcms/web/jcsj/uploadPic.do",{
		data:{
			"parameters":{
				"smallPic":JSON.stringify(imgArray),
				"suffix":".jpeg"
			},
			"foreEndType":2,
			"code":"300000084"
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			if(data.success){
				arr_src.push(data.data);
				if(num == f1.length-1){//图片上传完毕后关闭加载图标			
					plus.nativeUI.closeWaiting();
//							alert("上传成功");
				}
			}else{
				mui.alert("提示信息："+data.message, '提示', function(){});
			}
		   
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			console.log(type);
		}
	});
}

function fun1(){
	var img_src = $(this).parent().find('.pic_img').attr('src');//查找当前删除按钮下的图片地址
	for (var i=0; i<f1.length; i++) {//与数组图片地址进行对比删除
		if(f1[i] == img_src){
			f1.splice(i,1);
		}
	}
	$(this).parent().css('display','none');
}