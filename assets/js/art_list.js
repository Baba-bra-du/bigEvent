$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  template.defaults.imports.dataForm = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  // 定义一个查询的参数对象  将来请求数据的时候
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页码值 默认氢气第一页的数据
    pagesize: 2, //每页显示几条数据  默认每页显示2条数据
    cate_id: '', //文正分类 id
    state: '' //文章的发布状态
  }
  initTable()
  initCate()

  // 获取文章列表
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败');
        }
        // 使用模板引擎渲染页面
        console.log(res);

        var htmlStr = template('tpl-table', res)
        console.log(htmlStr);

        $('tbody').html(htmlStr)
        // 得到当前网页的数据条数
        renderPage(res.total)
      }
    })
  }

  // 获取文章分类
  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据获取失败');
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-select', res)
        $('[name="cate_id"]').html(htmlStr)

        // 通过layui重新渲染表单区域的ui结构
        form.render();
      }
    })
  }

  // 为筛选表单绑定 提交  事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name="cate_id"]').val()
    var state = $('[name="state"]').val()

    // 为查询参数对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件  重新渲染表格的数据
    initTable();
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox', //分页容器的id  这个容器放在HTML页面中
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认备选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5],
      // 分页发生切换时  触发jump回调
      jump: function (obj, first) {
        // first 为undefined 表示手动触发
        // first 为true 表示程序触发

        console.log('jump触发的方式' + first);
        // 把最新的页码值  复制到q这个查询参数对象中
        q.pagenum = obj.curr

        // 将最新条目数 复制到q这个查询参数对象的pagesize中
        q.pagesize = obj.limit
        if (!first) {
          initTable()
        }
      }
    });

  }

  // 事件委托  删除文章  (提交表单的时候需要阻止默认的提交行为)

  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    var len=$('.btn-delete`').length
    layer.confirm('确认删除?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功');
          initTable();
        }
      })
      layer.close(index);
    });


  })
  // 事件委托  编辑文章


})