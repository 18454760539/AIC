/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(function (exports) {
    var $ = layui.$
        , layer = layui.layer
        , laytpl = layui.laytpl
        , setter = layui.setter
        , view = layui.view
        , admin = layui.admin
    
    //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
    //……
    try {
        loginuserpermissionarray = layui.data('permissions').permission.split('');//登录用户权限
        select_navigationall();
    } catch (e) {
        admin.exit();
    }
    
    //退出
    admin.events.logout = function () {
        //执行退出接口
        admin.req({
            url: './json/user/logout.js'
            , type: 'get'
            , data: {}
            , done: function (res) { //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
                //清空本地记录的 token，并跳转到登入页
                admin.exit();
            }
        });
    };
    
    //对外暴露的接口
    exports('common', {});

    var hrefdatas = layui.router().path;
    if (hrefdatas.length == 0) {
        return;
    }
    var hrefnames = hrefdatas[hrefdatas.length - 1];//html页面名称   
    switch (hrefnames) {
        case "orderentry": $('input[name="orderassociation_ordernumber"]').focus();//订单编号定位焦点
        case "processqualityinspection": $('input[name="processqualityinspection_inquireordernumber"]').focus();//订单编号定位焦点
        case "factoryqualityinspection": $('input[name="factoryqualityinspection_inquireordernumber"]').focus();//订单编号定位焦点
        case "normalorderreview": $('input[name="normalorderreview_name_number"]').focus();//订单评审订单编号定位焦点
        case "internalreturnscanning": $('input[name="internalreturnscanning_order_ordernumber"]').focus();//内返订单编号定位焦点
        case "productionscanning": $('input[name="productionscanning_order_ordernumber"]').focus();//生产订单编号定位焦点
    }
});