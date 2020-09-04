$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比  1:1 正方形
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)


    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var fileist = e.target.files
        if (fileist.length === 0) {
            return layui.layer.msg('请选择要上传的图片');
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 将文件  转化为路径
        var imgURL = URL.createObjectURL(file)
        // 重新初始化裁剪区域
        $image
            .cropper('destroy') //销毁原来的裁剪区域
            .attr('src', imgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })

    $('#btnconfirm').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('更换头像失败');
                }
                layer.msg('更换头像成功');
                window.parent.getUserInfo()
            }
        })
    })





})