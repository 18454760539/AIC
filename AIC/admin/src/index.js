
/**
删除
审核
取消审核
禁用
取消禁用
 @Name：layuiAdmin 主入口
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */
//decodeURIComponent();//函数解决参数中文乱码问题
var ordernumber_quanjubianliang = "";

var Toothglobalvariable = "";//牙色全局变量

var loginuserpermissionarray;

var orderentry_hospitalajaxcs = 0;//医院是否有本地缓存数据判断

var $; var form; var layer; var element; var laydate; var table; var admin; var setter; var laytpl; var limitnum; var layim; var t; var upload; var Motherboard_number;

var eleTree; var cityPicker; var timePicker; var tableMerge;

var normalorderreview_mxlx = "";//正常订单评审模型全局变量
var trialreview_mxlx = "";//正常订单评审模型全局变量

var operator_name;

var desc = function (a, b) { return b - a };//排序降序
var asc = function (a, b) { return a - b };//排序升序

//渲染所有导航内容
var nav_pop_left_ul_str = '';
var firstindex_html = true;//导航第一个索引
var nav_pop_right_content_html = '';
var permissionsinterfacecontrol_list = [];
var LODOP;


layui.extend({
    setter: 'config' //配置文件
    , admin: 'lib/admin' //核心模块
    , view: 'lib/view' //核心模块
}).define(['setter', 'layer', 'jquery', 'form', 'element', 'laydate', 'table', 'admin', 'laytpl', 'layim', 'upload'], function (exports) {
    setter = layui.setter
    admin = layui.admin;
    tabsPage = admin.tabsPage
    view = layui.view;
    layer = layui.layer;
    element = layui.element;
    form = layui.form;
    laydate = layui.laydate;
    table = layui.table;
    laytpl = layui.laytpl;
    layim = layui.layim;
    $ = layui.jquery;
    upload = layui.upload;

    limitnum = Math.floor(($(window).height() - 340) / 41) + 1;//全局变量 设置table显示个数

    //监听tab切换
    element.on('tab(layadmin-layout-tabs)', function () {
        var hrefdata = layui.router().path;
        if (hrefdata.length == 0) {
            return;
        }
        var hrefname = hrefdata[hrefdata.length - 1];//html页面名称      
        switch (hrefname) {
            
        }
    });

    table.set({
        headers: { //通过 request 头传递
            access_token: layui.data('layuiAdmin').access_token
        }
    });

    if (layui.router().href != "/user/login" && layui.router().href != "/user/reg") {
        try {
            loginuserpermissionarray = layui.data('permissions').permission.split('');//登录用户权限
            select_navigationall();
        } catch (e) {
            admin.exit();
        }
    }

    //根据路由渲染页面
    renderPage = function () {
        var router = layui.router()
            , path = router.path
            , pathURL = admin.correctRouter(router.path.join('/'))
        //默认读取主页
        if (!path.length) path = [''];
        //如果最后一项为空字符，则读取默认文件
        if (path[path.length - 1] === '') {
            path[path.length - 1] = setter.entry;
        }
        /*
        layui.config({
          base: setter.base + 'controller/'
        });
        */
        //重置状态
        var reset = function (type) {
            //renderPage.haveInit && layer.closeAll();
            if (renderPage.haveInit) {
                $('.layui-layer').each(function () {
                    var othis = $(this),
                        index = othis.attr('times');
                    if (!othis.hasClass('layui-layim')) {
                        layer.close(index);
                    }
                });
            }
            renderPage.haveInit = true;
            $(APP_BODY).scrollTop(0);
            delete tabsPage.type; //重置页面标签的来源类型
        };
        //如果路由来自于 tab 切换，则不重新请求视图
        if (tabsPage.type === 'tab') {
            //切换到非主页、或者切换到主页且主页必须有内容。方可阻止请求
            if (pathURL !== '/' || (pathURL === '/' && admin.tabsBody().html())) {
                admin.tabsBodyChange(tabsPage.index);
                return reset(tabsPage.type);
            }
        }
        //请求视图渲染
        view().render(path.join('/')).then(function (res) {
            //遍历页签选项卡
            var matchTo
                , tabs = $('#LAY_app_tabsheader>li');
            tabs.each(function (index) {
                var li = $(this)
                    , layid = li.attr('lay-id');
                if (layid === pathURL) {
                    matchTo = true;
                    tabsPage.index = index;
                }
            });
            //如果未在选项卡中匹配到，则追加选项卡
            if (setter.pageTabs && pathURL !== '/') {
                if (!matchTo) {
                    $(APP_BODY).append('<div class="layadmin-tabsbody-item layui-show"></div>');
                    tabsPage.index = tabs.length;
                    element.tabAdd(FILTER_TAB_TBAS, {
                        title: '<span>' + (res.title || '新标签页') + '</span>'
                        , id: pathURL
                        , attr: router.href
                    });
                }
            }
            this.container = admin.tabsBody(tabsPage.index);
            setter.pageTabs || this.container.scrollTop(0); //如果不开启标签页，则跳转时重置滚动条

            //定位当前tabs
            element.tabChange(FILTER_TAB_TBAS, pathURL);
            admin.tabsBodyChange(tabsPage.index);

        }).done(function () {
            layui.use('common', layui.cache.callback.common);
            $win.on('resize', layui.data.resize);

            element.render('breadcrumb', 'breadcrumb');

            //容器 scroll 事件，剔除吸附层
            admin.tabsBody(tabsPage.index).on('scroll', function () {
                var othis = $(this)
                    , elemDate = $('.layui-laydate')
                    , layerOpen = $('.layui-layer')[0];

                //关闭 layDate
                if (elemDate[0]) {
                    elemDate.each(function () {
                        var thisElemDate = $(this);
                        thisElemDate.hasClass('layui-laydate-static') || thisElemDate.remove();
                    });
                    othis.find('input').blur();
                }
                //关闭 Tips 层
                layerOpen && layer.closeAll('tips');
            });
        });
        reset();
    }
        //入口页面
        , entryPage = function (fn) {
            var router = layui.router()
                , container = view(setter.container)
                , pathURL = admin.correctRouter(router.path.join('/'))
                , isIndPage;
            //检查是否属于独立页面
            layui.each(setter.indPage, function (index, item) {
                if (pathURL === item) {
                    return isIndPage = true;
                }
            });
            //将模块根路径设置为 controller 目录
            layui.config({
                base: setter.base + 'controller/'
            });
            //独立页面
            if (isIndPage || pathURL === '/user/login') { //此处单独判断登入页，是为了兼容旧版（即未在 config.js 配置 indPage 的情况）
                container.render(router.path.join('/')).done(function () {
                    admin.pageType = 'alone';
                });
            } else { //后台框架页面
                //强制拦截未登入
                if (setter.interceptor) {
                    var local = layui.data(setter.tableName);
                    if (!local[setter.request.tokenName]) {
                        return location.hash = '/user/login/redirect=' + encodeURIComponent(pathURL); //跳转到登入页
                    }
                }
                //渲染后台结构
                if (admin.pageType === 'console') { //后台主体页
                    renderPage();
                } else { //初始控制台结构
                    container.render('layout').done(function () {
                        renderPage();
                        layui.element.render();
                        if (admin.screen() < 2) {
                            admin.sideFlexible();
                        }
                        admin.pageType = 'console';

                    });
                }
            }
        }
        , APP_BODY = '#LAY_app_body', FILTER_TAB_TBAS = 'layadmin-layout-tabs'
        , $ = layui.$, $win = $(window);
    //初始主体结构
    layui.link(
        setter.base + 'style/admin.css?v=' + (admin.v + '-1')
        , function () {
            entryPage()
        }
        , 'layuiAdmin'
    );
    //监听Hash改变
    window.onhashchange = function () {
        entryPage();
        //执行 {setter.MOD_NAME}.hash 下的事件
        layui.event.call(this, setter.MOD_NAME, 'hash({*})', layui.router());
    };

    //扩展 lib 目录下的其它模块
    layui.each(setter.extend, function (index, item) {
        var mods = {};
        mods[item] = '{/}' + setter.base + 'lib/extend/' + item;
        layui.extend(mods);
    });

    //对外输出
    exports('index', {
        render: renderPage
    });


});

//弹出层全屏
function FullScreen()
{
    let w = document.documentElement.clientWidth;
    let h = document.documentElement.clientHeight;
    return [w + 'px', h + 'px'];
}

///获取cpu序列号
function getSystemInfocpu() {
    var LODOP = getLodop();
    if (LODOP.CVERSION) CLODOP.On_Return = function (TaskID, Value) {
        Motherboard_number = Value;
    };
    var strResult = LODOP.GET_SYSTEM_INFO("BaseBoard.SerialNumber");
    if (!LODOP.CVERSION) return strResult; else return "";
}

//传select name  点击清空select 用于select 搜索 div item onclick="selectqingkouclick(name)"
function selectqingkouclick(name) {
    if ($('select[name="' + name + '"]').val()) {
        $('select[name="' + name + '"]').next().find('input').val("");
    }
}


//分页的每页条数下拉列表
function fenye(num) {
    var limits = new Array();
    limits.push(num)
    limits.push(50);
    limits.push(100);
    limits.push(300);
    limits.push(500);
    limits.push(1000);
    limits.push(2000);
    return limits;
}

//获取当前时间格式为yyyy-MM-dd HH:mm:SS
function getFormatDate(datetime) {
    let nowDate = new Date();
    if (datetime) {
        nowDate = new Date(datetime);
    }
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

//格式化时间日期
function getFormatDateTime(datetime) {
    let nowDate = new Date();
    if (datetime) {
        nowDate = new Date(datetime);
    }
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
    var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
    var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
    return year + "-" + month + "-" + date;
}

//根据出生日期获得年龄
function Age(status) {
    var aDate = new Date();

    var thisYear = aDate.getFullYear();
    var bDate = new Date(status);
    var brith = bDate.getFullYear();
    var age = (thisYear - brith);
    return age;
}

//获取guid
function getguid(objname, obj) {
    layerloadindex = layer.msg('数据获取中!', { icon: 16, time: 0, shade: 0.08 });
    admin.req({
        type: "get",
        url: "/control/tools/getguid.ashx",
        dataType: "json",
        success: function (data) {
            layer.close(layerloadindex);//关闭加载中提示
            $("input[name='" + objname + "']").val(data.data);
            if (obj != null) {
                obj();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(layerloadindex);//关闭加载中提示
            layer.msg('获取guid失败,错误原因:' + errorThrown, { icon: 6, time: 3000, shade: 0.08 });
        }
    });
}

//生成guid
function guidcreate() {
    return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
}

//下载导出文件
function downloadFile(url) {
    try {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {

    }
}

//下载导出文件2
function openDownloadDialog(url) {
    // for ie 10 and later
    if (window.navigator.msSaveBlob) {
        try {
            var blobObject = new Blob([self.output]);
            window.navigator.msSaveBlob(blobObject, downloadFileName);
        }
        catch (e) {

        }
    }
    // 谷歌浏览器 创建a标签 添加download属性下载
    else {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = "/control/tools/download.ashx?functiontype=geturl&pathname=" + url;
        aLink.target = "_blank";
        var event;
        if (window.MouseEvent) {
            event = new MouseEvent('click');
        }
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
}

//获取数组中重复最多的元素
function Maxarr(array) {
    var count = 1;
    var yuansu = new Array(); //存放数组array的不重复的元素 
    var sum = new Array(); //存放数组array中每个不同元素的出现的次数  
    for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
            if (array[i] == array[j]) {
                count++; //用来计算与当前这个元素相同的个数  
                array.splice(j, 1); //没找到一个相同的元素，就要把它移除掉，  
                j--;
            }
        }
        yuansu[i] = array[i]; //将当前的元素存入到yuansu数组中  
        sum[i] = count; //并且将有多少个当前这样的元素的个数存入sum数组中  
        count = 1; //再将count重新赋值，进入下一个元素的判断  
    }
    //算出array数组中出现次数最多的元素  
    var newsum = new Array(); //  sum;  
    for (var item in sum) {
        newsum[item] = sum[item];
    }
    newsum.sort();
    //document.write(sum.toString()+"<br/>");  
    //document.write(newsum.toString() + "<br/>");  
    var first = ''; //存放出现次数最多的元素，以及个数  
    var second = ''; //存放出现次数居第二位的元素，以及个数  
    var fcount = 1; //计算出现次数最多的元素总共有多少个  
    //算出出现次数最多的元素及个数  
    for (var i = 0; i < sum.length; i++) {
        if (sum[i] == newsum[newsum.length - 1]) {
            fcount++;
            return yuansu[0];
        }
    }
}

//渲染select下拉框(万能型)
function selectinitUniversal(selectname, data, diyoption, key, name, tablename) {
    let datalist = new Array();
    if (data.data) {
        datalist = data.data;
    } else {
        datalist = data;
    }
    $("select[name=" + selectname + "]").empty();
    var str = "";
    if (diyoption) str = "<option value=''>" + diyoption + "</option>";
    if (!diyoption) str = "<option value=''>请选择</option>";
    for (var i = 0; i < datalist.length; i++) {
        if (tablename) {
            key = tablename + "_guid"; name = tablename + "_name";
            str += '<option value="' + datalist[i][key] + '">' + datalist[i][name] + '</option>'; continue;
        }
        if (!key && !name) {
            if (i == 0) {
                let klist = Array();
                for (var k in datalist[i]) {
                    klist.push(k.split('_')[0]);
                }
                key = Maxarr(klist) + "_guid";
                name = Maxarr(klist) + "_name";
            }
        }
        if (!key) {
            str += '<option value="' + datalist[i]["value"] + '">' + datalist[i]["name"] + '</option>'; continue;
        }
        if (!name) {
            str += '<option value="' + datalist[i][key] + '">' + datalist[i][key] + '</option>'; continue;
        }
        str += '<option value="' + datalist[i][key] + '">' + datalist[i][name] + '</option>';
    }
    $("select[name='" + selectname + "']").append(str);
    form.render('select'); //刷新select选择框渲染
}

//渲染select下拉框(元素value,name型)
function selectinit(selectname, data, diyoption) {
    let datalist = new Array();
    try {
        if (data.data) {
            datalist = data.data;
        } else {
            datalist = data;
        }
    } catch (e) {
        datalist = data;
    }
    $("select[name=" + selectname + "]").empty();
    var str = "";
    if (diyoption) { str = "<option value=''>" + diyoption + "</option>"; }
    for (var i = 0; i < datalist.length; i++) {
        let selected = datalist[i].selected || false;
        if (selected == true) {
            str += '<option value="' + datalist[i].namevalue + '" selected>' + datalist[i].name + '</option>'; continue;
        }
        str += '<option value="' + datalist[i].namevalue + '">' + datalist[i].name + '</option>';
    }
    $("select[name='" + selectname + "']").append(str);
    form.render('select'); //刷新select选择框渲染
}

//渲染select下拉框通过ajax载入数据
function selectinitajax(url, selectname, diyoption, obj) {
    //读取大类
    admin.req({
        type: "get",
        url: url,
        dataType: "json",
        success: function (responsedata) {

            var data = responsedata.data;
            $("select[name=" + selectname + "]").empty();
            var str = "";
            if (diyoption) { str = "<option value=''>" + diyoption + "</option>"; }
            for (var i = 0; i < data.length; i++) {
                str += '<option value="' + data[i].namevalue + '">' + data[i].name + '</option>';
            }
            $("select[name='" + selectname + "']").append(str);
            form.render('select'); //刷新select选择框渲染
            if (obj != null) {
                obj();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('获取guid失败,错误原因:' + errorThrown, { icon: 6, time: 3000, shade: 0.08 });
        }
    });
}


//渲染分组select下拉框
function groupselectinit(selectjson, selectname) {

    var str = '';
    $("select[name='" + selectname + "'] option:not(:first)").remove();
    for (var i = 0; i < selectjson.length; i++) {
        str += '<optgroup label="' + selectjson[i].lablename + '">';
        var list = selectjson[i].list;
        for (var s = 0; s < list.length; s++) {
            str += '<option value="' + list[s].namevalue + '">' + list[s].name + '</option>'
        }
        str += '</optgroup>'
    }
    $("select[name='" + selectname + "']").append(str);
    form.render('select'); //刷新select选择框渲染
}


//渲染分组select下拉框ajax
function groupselectinitajax(url, selectname, objfunc) {
    layerloadindex = layer.msg('加载中', { icon: 16, time: 0, shade: 0.08 });
    admin.req({
        url: url,
        dataType: "json",
        success: function (responsedata) {
            layer.close(layerloadindex);//关闭加载中提示
            selectjson = responsedata.data
            var str = '';
            $("select[name='" + selectname + "'] option:not(:first)").remove();
            for (var i = 0; i < selectjson.length; i++) {
                str += '<optgroup label="' + selectjson[i].lablename + '">';
                var list = selectjson[i].list;
                for (var s = 0; s < list.length; s++) {
                    str += '<option value="' + list[s].namevalue + '">' + list[s].name + '</option>'
                }
                str += '</optgroup>'
            }
            $("select[name='" + selectname + "']").append(str);
            form.render('select'); //刷新select选择框渲染
            if (objfunc != null) { objfunc(); }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(layerloadindex);//关闭加载中提示
            layer.msg('获取guid失败,错误原因:' + errorThrown, { icon: 6, time: 3000, shade: 0.08 });
        }
    });
}

//表单提交监听新增和删除
function formon(formsubmitname, url, behavior, tableid, layerindex, objfunction) {
    form.on('submit(' + formsubmitname + ')', function (data) {
        admin.req({
            type: "POST",
            url: url,
            data: { "formjson": JSON.stringify(data.field) }, //当前容器的全部表单字段， data.field 名值对形式：{name: value}
            dataType: "json",
            beforeSend: function () {
                layerloadindex = layer.msg('加载中', { icon: 16, time: 0, shade: 0.08 }); //弹出添加中对话框
            },
            success: function (data) {
                if (data.code == 0) {
                    if (behavior == "add") {
                        $('button[lay-filter="' + formsubmitname + '"]').next().click();//调用清空 一般是查找当前按钮的上一个或者下一个按钮进行点击清空
                        $('button[lay-filter="' + formsubmitname + '"]').prev().click();//调用清空 一般是查找当前按钮的上一个或者下一个按钮进行点击清空
                    }
                    else {
                        layer.close(layerindex);//如果修改成功则关闭所有弹窗
                        table.reload(tableid);
                    }

                    try {
                        //处理自定义函数
                        if (objfunction != null) {
                            objfunction(data.msg);
                        }
                    } catch (e) {
                        return false;
                    }


                    layer.msg('操作成功!', { icon: 1, time: 2000 });

                    return false;
                }
                else {
                    layer.alert("操作失败：" + data.msg, { icon: 5, skin: 'layer-ext-moon' });
                    return false;
                }
            },
            complete: function () {
                layer.close(layerloadindex);//关闭加载中提示
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(layerloadindex);//关闭加载中提示
                layer.alert("发生错误，错误原因：" + errorThrown);
                return false;
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

}

//删除更新数据
function datadeleteupdates(url, tablename, behavior, objfunction) {
    var data = table.checkStatus(tablename).data; //test即为基础参数id对应的值
    if (data.length == 0) {
        layer.msg('对不起,请勾选要' + behavior + '的信息!'); return;
    }
    layer.confirm('确定要' + behavior + '您选中的' + data.length + '条数据吗?', { icon: 3, title: '提示' }, function (index) { //do something
        var layerloadindex = layer.msg('加载中', { icon: 16, time: 0, shade: 0.08 }); //弹出添加中对话框
        admin.req({
            type: "POST",
            url: url,
            data: { "formjson": JSON.stringify(data), "behaviortype": behavior }, //当前容器的全部表单字段， data.field 名值对形式：{name: value}
            dataType: "json",
            beforeSend: function () { },
            success: function (data) {
                if (data.code == 0) {
                    layer.msg('操作成功!', { icon: 1, time: 2000 });
                    if (tablename) { table.reload(tablename); }
                    //处理自定义函数
                    if (objfunction != null) { objfunction(); }
                } else {
                    layer.alert("操作失败：" + data.msg, { icon: 5, skin: 'layer-ext-moon' });
                }
            },
            complete: function () {
                layer.close(layerloadindex);//关闭加载中提示
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(layerloadindex);//关闭加载中提示
                layer.alert("发生错误，错误原因：" + errorThrown);
            }
        });
    });
}

//通用删除、审核、禁用更新数据
function Unitedatadeleteupdate(tablename, behavior, dbtableName) {
    var data = table.checkStatus(tablename).data; //test即为基础参数id对应的值
    if (data.length == 0) {
        layer.msg('对不起,请勾选要' + behavior + '的信息!'); return;
    }
    let url = "/control/tools/EntityObjectConversion.ashx?tableName=" + dbtableName + "&type=" + behavior;
    layer.confirm('确定要' + behavior + '您选中的' + data.length + '条数据吗?', { icon: 3, title: '提示' }, function (index) { //do something
        var layerloadindex = layer.msg('加载中', { icon: 16, time: 0, shade: 0.08 }); //弹出添加中对话框
        admin.req({
            type: "POST",
            url: url,
            data: { "formjson": JSON.stringify(data), "behaviortype": behavior }, //当前容器的全部表单字段， data.field 名值对形式：{name: value}
            dataType: "json",
            beforeSend: function () { },
            success: function (data) {
                if (data.code == 0) {
                    layer.msg('操作成功!', { icon: 1, time: 2000 });
                    table.reload(tablename);
                } else {
                    layer.alert("操作失败：" + data.msg, { icon: 5, skin: 'layer-ext-moon' });
                }
            },
            complete: function () {
                layer.close(layerloadindex);//关闭加载中提示
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(layerloadindex);//关闭加载中提示
                layer.alert("发生错误，错误原因：" + errorThrown);
            }
        });
    });

}

//集合字段汇总
function arrSum(list, name) {
    let sum = 0;
    for (var i in list) {
        if (isNaN(list[i][name])) {
            return 0;
        }
        sum += Number(list[i][name]);
    }
    return sum;
}

//数组去重复(根据传入的字段,arr为传入的数组,name为传入的字段元素),返回新数组
function arrayRemoveRepeat(arr, name) {
    let hash = {};
    arr = arr.reduce(function (item, next) {
        hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
        return item;
    }, []);
    return arr;
}

//根据字段field判断数组是否包含对象,如果包含,则返回下标,不包含,返回-1,包含多条返回第一条下标(单字段匹配)
function IndexOf(list, obj, listField, objField) {
    let index = -1;
    for (var i = 0; i < list.length; i++) {
        if (!listField) {
            return -1;
        }
        if (!objField) {
            if (list[i][listField] === obj[listField]) {
                index = i; break;
            }
        }
        if (objField) {
            if (list[i][listField] === obj[objField]) {
                index = i; break;
            }
        }
    }
    return index;
}

//根据字段数组fieldList判断数组是否包含对象,如果包含,则返回下标,不包含,返回-1,包含多条返回第一条下标(多字段匹配)
function IndexOfList(list, obj, fieldList) {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
        let presence = true;
        for (let k in fieldList) {
            if (fieldList.hasOwnProperty(k)) {
                if (list[i][k] !== obj[k]) {
                    presence = false;
                    break;
                }
            }
        }
        if (presence === true) {
            index = i; break;
        }
    }
    return index;
}

//将多个字符串变成数据,如:"123"变成["123"]
function GetArray(str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12) {
    let list = new Array();
    if (str1) list.push(str1);
    if (str2) list.push(str2);
    if (str3) list.push(str3);
    if (str4) list.push(str4);
    if (str5) list.push(str5);
    if (str6) list.push(str6);
    if (str7) list.push(str7);
    if (str8) list.push(str8);
    if (str9) list.push(str9);
    if (str10) list.push(str10);
    if (str11) list.push(str11);
    if (str12) list.push(str12);
    return list;
}

//查询数组
function InquireArray(list, filters) {
    //let filters = {
    //    "id": ['1'],
    //};

    let keys = Object.keys(filters);
    let array = list.filter(item => {
        return keys.every(key => filters[key].indexOf(item[key]) !== -1)
    });
    return array;
}

//根据字段查询数组对象(多条件),配合查询条件使用
function InquireList(list, obj) {
    let array = new Array();
    for (let i in list) {
        if (list.hasOwnProperty(i)) {
            let presence = true;
            for (let k in obj) {
                if (obj.hasOwnProperty(k)) {
                    if (list[i][obj[k].key] !== obj[k].condition) {
                        presence = false;
                        break;
                    }
                }
            }
            if (presence === true) {
                array.push(list[i]);
            }
        }
    }
    return array;
}

//查询条件
function InquireListCondition(key, condition) {
    return { key: key, condition: condition };
}

//根据条件查询数组
function InquireListOne(list, key, condition, symbol) {
    // console.log(list);
    let array = new Array();
    for (let i in list) {
        if (list.hasOwnProperty(i)) {
            if (!symbol || symbol === "==") {
                if (list[i][key] == condition) {
                    array.push(list[i]);
                }
            }
            if (symbol === "===") {
                if (list[i][key] === condition) {
                    array.push(list[i]);
                }
            }
            if (symbol === "!=") {
                if (Number(list[i][key]) != Number(condition)) {
                    array.push(list[i]);
                }
            }
            if (symbol === "!==") {
                if (Number(list[i][key]) !== Number(condition)) {
                    array.push(list[i]);
                }
            }
            if (symbol === ">") {
                if (Number(list[i][key]) > Number(condition)) {
                    array.push(list[i]);
                }
            }

            if (symbol === "<") {
                if (Number(list[i][key]) < Number(condition)) {
                    array.push(list[i]);
                }
            }
            if (symbol === ">=") {
                if (Number(list[i][key]) >= Number(condition)) {
                    array.push(list[i]);
                }
            }

            if (symbol === "<=") {
                if (Number(list[i][key]) <= Number(condition)) {
                    array.push(list[i]);
                }
            }
            if (symbol === "-1") {  //如果是-1则不对比条件
                array.push(list[i]);
            }
        }
    }
    //  console.log(array);
    return array;
}






//判断日期，时间大小  
function compareTime(startDate, endDate) {
    if (startDate.length > 0 && endDate.length > 0) {
        var startDateTemp = startDate.split(" ");
        var endDateTemp = endDate.split(" ");

        var arrStartDate = startDateTemp[0].split("-");
        var arrEndDate = endDateTemp[0].split("-");

        var arrStartTime = startDateTemp[1].split(":");
        var arrEndTime = endDateTemp[1].split(":");

        var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
        var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);

        if (allStartDate.getTime() >= allEndDate.getTime()) {
            return false;

        } else {
            return true;

        }

    } else {
        return false;

    }
}