// 在发送请求之前执行
// options  请求参数对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax之前  统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})