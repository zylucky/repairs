function tinyImgUpload(ele, options) {
    // 判断容器元素合理性并且添加基础元素
    var eleList = document.querySelectorAll(ele);
    if(eleList.length == 0){
        console.log('绑定的元素不存在');
        return;
    }else if(eleList.length>1){
        console.log('请绑定唯一元素');
        return;
    }else {
        eleList[0].innerHTML ='<div id="img-container" >'+
                '<div class="img-up-add  img-item"> <span class="img-add-icon"></span> </div>'+
                '<input type="file" name="files" id="img-file-input" multiple>'+
                '</div>';
        var ele = eleList[0].querySelector('#img-container');
        ele.files = [];   // 当前上传的文件数组
    }

    // 为添加按钮绑定点击事件，设置选择图片的功能
    var addBtn = document.querySelector('.img-up-add');
    addBtn.addEventListener('click',function () {
        document.querySelector('#img-file-input').value = null;
        document.querySelector('#img-file-input').click();
        return false;
    },false)

var f1 = [];

    // 预览图片
    //处理input选择的图片
    function handleFileSelect(evt) {
        var files = evt.target.files;
        console.log(files)

        for(var i=0, f; f=files[i];i++){
            // 过滤掉非图片类型文件
            if(!f.type.match('image.*')){
                continue;
            }
            // 过滤掉重复上传的图片
            var tip = false;
            for(var j=0; j<(ele.files).length; j++){
                if((ele.files)[j].name == f.name){
                    tip = true;
                    break;
                }
            }
            if(!tip){
                // 图片文件绑定到容器元素上
                ele.files.push(f);
                var reader = new FileReader();
                reader.onload = (function (theFile) {
                    return function (e) {
                        var oDiv = document.createElement('div');
                        f1.push(e.target.result);
                        // console.log(f1)
                        options.onSuccess(f1);
                        oDiv.className = 'img-thumb img-item';
                        // 向图片容器里添加元素
                        oDiv.innerHTML = '<img class="thumb-icon" src="'+e.target.result+'" />'+
                                        '<a href="javscript:;" class="img-remove">x</a>'

                        ele.insertBefore(oDiv, addBtn);
                    };
                })(f);

                reader.readAsDataURL(f);
            }
        }
    }
    document.querySelector('#img-file-input').addEventListener('change', handleFileSelect, false);

    // 删除图片
    function removeImg(evt) {
        if(evt.target.className.match(/img-remove/)){
            console.log('3',ele.files);
            // 获取删除的节点的索引
            function getIndex(ele){

                if(ele && ele.nodeType && ele.nodeType == 1) {
                    var oParent = ele.parentNode;
                    var oChilds = oParent.children;
                    for(var i = 0; i < oChilds.length; i++){
                        if(oChilds[i] == ele)
                            return i;
                    }
                }else {
                    return -1;
                }
            }
            // 根据索引删除指定的文件对象
            var index = getIndex(evt.target.parentNode);
            ele.removeChild(evt.target.parentNode);
            if(index < 0){
                return;
            }else {
                ele.files.splice(index, 1);
                f2.splice(index,1);
                console.log(f2);
            }
            console.log('4',ele.files);
        }
    }
    ele.addEventListener('click', removeImg, false);

    // return uploadImg;
}

// 循环调用
function imgupgrade() {
    mui.showLoading("提交中..","div");
    for(var i in f2){
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
    console.log(datas);
    xhr.onreadystatechange = function (e) {
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                arr_src.push(img_url + JSON.parse(xhr.responseText).data);
                console.log(arr_src);
                // alert(f2.length);
                if(idx == f2.length - 1){
                    // alert('上传完毕');
                    mui.hideLoading();
                    pic_tijiao();
                }
                // options.onSuccess(arr_src);
            }else {
                options.onFailure(xhr.responseText);
            }
        }
    }
    xhr.open('POST', options.path, true);
    xhr.send(JSON.stringify(datas));
// }
}

