// 发送请求获取用户基本信息
// 在获取用户信息之前 请先登录

$(function () {
    getUserInfo()

    var layer = layui.layer

    // 点击按钮 实现退出功能
    $('#btnOut').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确认退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 清空本地存储中的token
            localStorage.removeItem('token');
            // 重新跳转到登录界面
            location.href = '/login.html'
            // 关闭confirm 询问框
            layer.close(index);
        });
    })
})

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象  从本地存储中获取
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            } else {
                reanderAvatar(res.data)
            }

        }
    })
}

// 渲染用户头像
function reanderAvatar(user) {
    // 1.获取 昵称  或 用户名
    var name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像 并显示头像
        $('.layui-nav-img').attr('src', user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase();
        // 显示文字头像的显示内容  并显示
        $('.text-avatar').html(first).show()
    }
}