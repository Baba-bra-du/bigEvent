$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate();
    initEditor()
    // 定义加载文章分类的方法

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id" ]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 调用隐藏域的自动点击事件 
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            // 销毁接的裁剪区域
            .cropper('destroy')
            // 重新设置图片路径
            .attr('src', newImgURL)
            // 重新初始化裁剪区域
            .cropper(options)
    })

    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '存为草稿'
    })

    // 监听表单提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.值表单的默认提交行为
        e.precentDefault();
        // 2.基于form表单 快速床架一个formDat对象
        var fd = new FormData($(this)[0])
        // 3.将文章的发布状态 存到fd中
        // 将art_state的状态值存放到state中
        fd.append('state', art_state)

        // 4.将封面蔡建国后的推按 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
            })
    })

    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data:false,
            contentType:false,
            processData:false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功')
                location.href='/artical/art_list.html'
            }
        })
    }








})