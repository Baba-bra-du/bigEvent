$(function () {
    var form = layui.form
    var layer = layui.layer


    // 自定义验证规则
    form.verify({
        nickname(value) {
            if (value.length > 6 || value.length < 2) {
                return '昵称长度必须在1-6个字符'
            }
        }
    });

    initUserInfo();

    // 获取用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户失败')
                }
                console.log(res);
                // 获取表单值
                form.val('formUserInfo', res.data);

            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 获取用户最新的数据 重新渲染道页面
        initUserInfo();
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功')
                window.parent.getUserInfo()
            }
        })
    })
})