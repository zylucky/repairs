var f3 = [];
$.weui = {};
$.weui.alert = function(options) {
    options = $.extend({
        title: '警告',
        text: '警告内容'
    }, options);
    var $alert = $('.weui_dialog_alert');
    $alert.find('.weui_dialog_title').text(options.title);
    $alert.find('.weui_dialog_bd').text(options.text);
    $alert.on('touchend click', '.weui_btn_dialog', function() {
        $alert.hide();
    });
    $alert.show();
};

// 删除图片方法
function removeImg(del){
    if(del){
        for(let j=0; j<f2.length; j++){//添加点击事件
            del[j].onclick = function(){
                f2.splice(j,1);
                $(this).parent().remove();
                removeImg(del);//重复调用添加点击事件
                console.log(f2);
            }
        }
    }else{

    }
    // $(obj).remove();
}

// 允许上传的图片类型  
var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
// 1024KB，也就是 1MB  
var maxSize = 1024 * 1024;
// 图片最大宽度  
var maxWidth = 300;
// 最大上传图片数量  
var maxCount = 6;
$('.js_file').on('change', function(event) {
    var files = event.target.files;

    // 如果没有选中文件，直接返回  
    if (files.length === 0) {
        return;
    }

    for (var i = 0, len = files.length; i < len; i++) {
        var file = files[i];
        var reader = new FileReader();

        // 如果类型不在允许的类型范围内  
        if (allowTypes.indexOf(file.type) === -1) {
            $.weui.alert({
                text: '该类型不允许上传'
            });
            continue;
        }

        // if (file.size > maxSize) {
        //     $.weui.alert({
        //         text: '图片太大，不允许上传'
        //     });
        //     continue;
        // }

        if ($('.weui_uploader_file').length >= maxCount) {
            // alert($('.weui_uploader_file').length);
            $.weui.alert({
                text: '最多只能上传' + maxCount + '张图片'
            });
            return;
        }
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                // 不要超出最大宽度  
                var w = Math.min(maxWidth, img.width);
                // 高度按比例计算  
                var h = img.height * (w / img.width);
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 设置 canvas 的宽度和高度  
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(img, 0, 0, w, h);
                var base64 = canvas.toDataURL('image/png');
                // 将base64编码添加到数组中
                f2.push(base64);
                console.log(f2);
                
                // 插入到预览区  
                var $preview = $('<li class="weui_uploader_file weui_uploader_status" style="background-image:url(' + base64 + ')"><span class="del_pic_btn"></span><div class="weui_uploader_status_content">0%</div></li>');
                // $('.weui_uploader_files').append($preview);
                $('.weui_uploader_input_wrp').before($preview);
                
                
                // alert(f2.length);
                // 删除图片
                if($('.weui_uploader_file').length){
                    var del = $('.del_pic_btn');//选择图片对象
                    removeImg(del);
                }

                // var num = $('.weui_uploader_file').length;
                // $('.js_counter').text(num + '/' + maxCount);

                // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  

                var progress = 0;

                function uploading() {
                    $preview.find('.weui_uploader_status_content').text(++progress + '%');
                    if (progress < 100) {
                        setTimeout(uploading, 2);
                    } else {
                        // 如果是失败，塞一个失败图标  
                        //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');  
                        $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();
                    }
                }
                setTimeout(uploading, 2);
            };

            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
// });


// 循环实现多图片上传
function imgupgrade() {
    console.log(f2);
    mui.showLoading("请稍后...","div");
    for(var i=0; i<f2.length; i++){
        var  imgArray=[];//通过逗号分割到新的编码
        var newImgbase = f2[i].split(",")[1];
        imgArray.push(newImgbase);//放到imgArray数组里面
        uploadImg(imgArray,i);
    }
}
// 上传图片
function uploadImg(imgArray,idx) {
    var xhr = new XMLHttpRequest();
    var datas = {
      "parameters":{
        "smallPic":JSON.stringify(imgArray),
        "suffix":".jpeg"
      },
      "foreEndType":2,
      "code":"300000084"
    }
    xhr.onreadystatechange = function (e) {
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                arr_src.push(img_url + JSON.parse(xhr.responseText).data);
                console.log(arr_src);
                if(idx == f2.length - 1){
                    // alert('上传完毕');
                    setTimeout(function(){
                        pic_tijiao();
                    },1500);
                }
            }else {
                options.onFailure(xhr.responseText);
            }
        }
    }
    xhr.open('POST', Interface_url + '/yhcms/web/jcsj/uploadPic.do' , true);
    xhr.send(JSON.stringify(datas));
}