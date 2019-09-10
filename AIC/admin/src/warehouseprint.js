var LODOP;
var table_lieshu_direct_ck;//要打印的表内容元素的长度
var template_dome;//要打印的表内容元素
var template_dome_html = ''//要打印的html
var definition_width_all_direct_ck;//表格总宽度
var order_zhizhang_width_zhijie_ck;//打印纸张宽度
var order_zhizhang_hegint_zhijie_ck;//打印纸张高度
var order_zhizhang_fangxiang_zhijie_ck;//打印纸张方向
var order_zhizhang_type_zhijie_ck
var serialnumber_ck;//进货序号
var tablecontentheight;//表内容高度
var headheight;//表头高度
function warehousereportprinting(warehousetemplate, factoryjson, ordersobjects, printer, type) {
    order_zhizhang_type_zhijie_ck = type;
    template_dome_html = "";
    LODOP = getLodop();
    LODOP.PRINT_INIT("");
    LODOP.SET_PRINTER_INDEX(printer); //预览中可以更改打印机
    order_template_infoobjec = warehousetemplate.printtemplate_templatejson;//传值模板对象
    order_zhizhang_fangxiang_zhijie_ck = warehousetemplate.printtemplate_paperdirection;//打印方向
    switch (order_zhizhang_fangxiang_zhijie_ck) {
        case "横向":
            order_zhizhang_width_zhijie_ck = warehousetemplate.printtemplate_templatepaper.split("*")[1];//宽度
            order_zhizhang_hegint_zhijie_ck = warehousetemplate.printtemplate_templatepaper.split("*")[0];//长度
            break;
        case "纵向":
            order_zhizhang_width_zhijie_ck = warehousetemplate.printtemplate_templatepaper.split("*")[0];//宽度
            order_zhizhang_hegint_zhijie_ck = warehousetemplate.printtemplate_templatepaper.split("*")[1];//长度
            break;
    }
 

    $("#order_print_baocun_mobanhtml_zhijiedayin").html(unescape(warehousetemplate.printtemplate_templatejson));
    // alert('已更新')
    table_lieshu_direct_ck = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").length;
    template_dome = $("#order_print_baocun_mobanhtml_zhijiedayin").find('#order_print_select_table_ul_ck').find('li');
    tablecontentheight = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").attr("height_nr_list");
    if (!tablecontentheight) {
        tablecontentheight=30
    }
    headheight = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").attr("height_list");
    var headerheight = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").height();//获取页眉的高
    var footerheight = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").height();//获取页尾的高
    //计算每列宽度的百分比
    definition_width_all_direct_ck = 0;
    for (j = 0; j < table_lieshu_direct_ck; j++) {
        var row_height_width_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.name_neirong').attr("width_list");//单元格的宽度
        definition_width_all_direct_ck = Number(definition_width_all_direct_ck) + Number(row_height_width_direct);
    }
    console.log(ordersobjects)
    for (var i = 0; i < ordersobjects.length; i++) {
        serialnumber_ck = 1;
        //拼接头部
        template_dome_html += '<table class="order_table_center_zhijiedayin" style="border-collapse:collapse;border:0;margin:0;padding:0;border-spacing: 0;"><tr><td colspan=' + table_lieshu_direct_ck + ' style="border:0px solid #000;"><div style="width:100%;overfloe:hidden;position: relative;height:' + headerheight + 'px">' + processingheader(ordersobjects[i]) + '</div></td></tr>'
        template_dome_html = template_dome_html + '' + lietoustr_direct_ck();//渲染头部
        //拼接表内容
        if (order_zhizhang_type_zhijie_ck != 2) {
            for (var m = 0; m < ordersobjects[i].mxdata.length; m++) {
                serialnumber_ck++;
                template_dome_html += '<tr>'
                for (var j = 0; j < template_dome.length; j++) {
                    var list_div_date_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("list");//list
                    var row_hebing_header_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("merge");//是否合并
                    var value_content_row_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').text();//表头的内容
                    var row_height_width_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.name_neirong').attr("width_list");//单元格的宽度
                    var row_family_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("family_in");   //列中属性
                    var row_size_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("size_in");
                    var row_bold_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("bold_in");
                    var definition_no_width_all_direct = row_height_width_direct / definition_width_all_direct_ck;//该单元格在总宽度的百分比
                    var thead_percentage_direct = parseInt(definition_no_width_all_direct * parseInt(order_zhizhang_width_zhijie_ck * 3.78 - 70));
                    var template_dome_text = $("#order_print_baocun_mobanhtml_zhijiedayin").find('#order_print_select_table_ul_ck').find('li').eq(j).find('.table_neorng').text();
                    var template_dome_json = parsingjson(template_dome_text, ordersobjects[i], m, list_div_date_direct);
                    template_dome_html += '<td style="min-height:' + tablecontentheight + 'px;width:' + parseInt(thead_percentage_direct) + 'px;border: 1px solid #000;"><div style="min-height:' + tablecontentheight + 'px;width:' + parseInt(thead_percentage_direct) + 'px;font-family:' + row_family_in_direct + '; font-size:' + row_size_in_direct + '; font-weight:' + row_bold_in_direct + ';word-wrap: break-word;padding:0;margin: 0;">' + template_dome_json + '</div></td>';
                }
                template_dome_html += '</tr>'
            }
        }
        //入库质检
        if (order_zhizhang_type_zhijie_ck == 2) {
            for (var m = 0; m < ordersobjects[i].zjmx.length; m++) {
                serialnumber_ck++;
                template_dome_html += '<tr>'
                for (var j = 0; j < template_dome.length; j++) {
                    var list_div_date_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("list");//list
                    var row_hebing_header_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("merge");//是否合并
                    var value_content_row_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').text();//表头的内容
                    var row_height_width_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.name_neirong').attr("width_list");//单元格的宽度
                    var row_family_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("family_in");   //列中属性
                    var row_size_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("size_in");
                    var row_bold_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("bold_in");
                    var definition_no_width_all_direct = row_height_width_direct / definition_width_all_direct_ck;//该单元格在总宽度的百分比
                    var thead_percentage_direct = parseInt(definition_no_width_all_direct * parseInt(order_zhizhang_width_zhijie_ck * 3.78 - 70));
                    var template_dome_text = $("#order_print_baocun_mobanhtml_zhijiedayin").find('#order_print_select_table_ul_ck').find('li').eq(j).find('.table_neorng').text();
                    var template_dome_json = parsingjsonrk(template_dome_text, ordersobjects[i], m, list_div_date_direct);
                    template_dome_html += '<td style="min-height:' + tablecontentheight + 'px;width:' + parseInt(thead_percentage_direct) + 'px;border: 1px solid #000;"><div style="min-height:' + tablecontentheight + 'px;width:' + parseInt(thead_percentage_direct) + 'px;font-family:' + row_family_in_direct + '; font-size:' + row_size_in_direct + '; font-weight:' + row_bold_in_direct + ';word-wrap: break-word;padding:0;margin: 0;">' + template_dome_json + '</div></td>';
                }
                template_dome_html += '</tr>'
            }
        }
       
        //拼接表尾
        template_dome_html += '<tr><td colspan=' + table_lieshu_direct_ck + ' style="border:0px solid #000;"><div style="width:100%;overfloe:hidden;position: relative;height:' + footerheight + 'px">' + processingfooter(ordersobjects[i]) + '</div></td></tr></table>'
        var template_dome_html_style = '<style>.order_table_center_zhijiedayin td{text-align: center;}</style>'
        LODOP.ADD_PRINT_TABLE(0, 5, parseInt(order_zhizhang_width_zhijie_ck * 3.78 - 70), '100%', template_dome_html_style + template_dome_html);//打印表格
        LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 28);//粒度
        LODOP.NewPage();
    }
    LODOP.PREVIEW();
    $("#order_print_baocun_mobanhtml_zhijiedayin").html('');
    switch (order_zhizhang_fangxiang_zhijie_ck) {
        case "横向":
            LODOP.SET_PRINT_PAGESIZE(2, order_zhizhang_width_zhijie_ck * 10, order_zhizhang_hegint_zhijie_ck * 10, "CreateCustomPageorder");
            break;
        case "纵向":
            LODOP.SET_PRINT_PAGESIZE(1, order_zhizhang_width_zhijie_ck * 10, order_zhizhang_hegint_zhijie_ck * 10, "CreateCustomPageorder");
            break;
    }
}


//处理表头html
function lietoustr_direct_ck() {
    var lietou_direct = '<tr style="">';
    for (j = 0; j < table_lieshu_direct_ck; j++) {
        var row_hebing_header_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("merge");//是否合并
        var row_height_width_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.name_neirong').attr("width_list");//单元格的宽度
        var row_name_header_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.name_neirong').text();//表头内容
        var row_family_header_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("family_first");//表头的字体类型
        var row_size_header_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("size_first");//表头的字体大小
        var row_bold_header_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').attr("bold_first");//表头加粗
        var value_content_row_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_print_select_table_ul_ck").find("li").eq(j).find('.table_neorng').text();
        var definition_no_width_all_direct = row_height_width_direct / definition_width_all_direct_ck;//该单元格在总宽度的百分比
        var thead_percentage_direct = parseInt(definition_no_width_all_direct * parseInt(order_zhizhang_width_zhijie_ck * 3.78 - 70));
        //overflow:hidden;
        lietou_direct += '<td style="width:' + thead_percentage_direct + 'px;height:' + headheight + 'px;border: 1px solid #000;"><div style="word-wrap:word-break:break-all;width:' + parseInt(thead_percentage_direct) + 'px;font-family:' + row_family_header_direct + '; font-size:' + row_size_header_direct + '; font-weight:' + row_bold_header_direct + ';">' + row_name_header_direct + '</td>';
    }
    lietou_direct += '</tr>';
    return lietou_direct
}

function parsingjsonrk(template_dome_text, ordersobject, m,list) {
 var template_dome_json = '';

    switch (template_dome_text) {
        case '物品编码':
            if (ordersobject.zjmx[m].wlbm && ordersobject.zjmx[m].wlbm != "null") {
                template_dome_json = ordersobject.zjmx[m].wlbm
            }
            break
        case '物品名称':
            if (ordersobject.zjmx[m].wlmc && ordersobject.zjmx[m].wlmc != "null") {
                template_dome_json = ordersobject.zjmx[m].wlmc
            }
            break
        case '规格':
            if (ordersobject.zjmx[m].ggxh && ordersobject.zjmx[m].ggxh != "null") {
                template_dome_json = ordersobject.zjmx[m].ggxh
            }
            break
        case '型号':
            if (ordersobject.zjmx[m].xh && ordersobject.zjmx[m].xh != "null") {
                template_dome_json = ordersobject.zjmx[m].xh
            }
            break
        case '注册证号':
            if (ordersobject.zjmx[m].clzczh && ordersobject.zjmx[m].clzczh != "null") {
                template_dome_json = ordersobject.zjmx[m].clzczh
            }
            break
  
        case '生产批号':
            if (ordersobject.zjmx[m].ph && ordersobject.zjmx[m].ph != "null") {
                template_dome_json = ordersobject.zjmx[m].ph
            }
            break
        case '生产日期':
            if (list==" ") {
                list = 'yyyy-MM-dd'
            }
            if (ordersobject.zjmx[m].scrq && ordersobject.zjmx[m].scrq != "null") {
                template_dome_json = originally_time_direct_ck(list, ordersobject.zjmx[m].scrq)
            }
            break
        case '有效期':
            if (list==" ") {
                list = 'yyyy-MM-dd'
            }
            if (ordersobject.zjmx[m].yxq && ordersobject.zjmx[m].yxq != "null") {
                template_dome_json = originally_time_direct_ck(list, ordersobject.zjmx[m].yxq)
            }
            break
        case '生产厂家':
            if (ordersobject.zjmx[m].sccj && ordersobject.zjmx.sccj != "null") {
                template_dome_json = ordersobject.zjmx[m].sccj
            }
            break
        case '到货数量':
            if (ordersobject.zjmx[m].dhsl && ordersobject.zjmx[m].dhsl != "null") {
                template_dome_json = ordersobject.zjmx[m].dhsl
            }
            break
   
        case '检验数量':
            if (ordersobject.zjmx[m].hgslzj && ordersobject.zjmx[m].hgslzj != "null") {
                template_dome_json = ordersobject.zjmx[m].hgslzj
            }
            break
        case '供方检验结果':
            if (ordersobject.zjmx[m].gfjyjg && ordersobject.zjmx[m].gfjyjg != "null") {
                template_dome_json = ordersobject.zjmx[m].gfjyjg
            }
            break
        case '材质是否符合':
            if (ordersobject.zjmx[m].czsffh && ordersobject.zjmx[m].czsffh != "null") {
                template_dome_json = ordersobject.zjmx[m].czsffh
            }
            break
        case '中文标签及说明书':
            if (ordersobject.zjmx[m].zwbqjsms && ordersobject.zjmx[m].zwbqjsms != "null") {
                template_dome_json = ordersobject.zjmx[m].zwbqjsms
            }
            break
        case '其他指标':
            if (ordersobject.zjmx[m].qtzb && ordersobject.zjmx[m].qtzb != "null") {
                template_dome_json = ordersobject.zjmx[m].qtzb
            }
            break
        case '外观指标':
            if (ordersobject.zjmx[m].wgzb && ordersobject.zjmx[m].wgzb != "null") {
                template_dome_json = ordersobject.zjmx[m].wgzb
            }
            break
        case '检验结果':
            if (ordersobject.zjmx[m].jyjg && ordersobject.zjmx[m].jyjg != "null") {
                template_dome_json = ordersobject.zjmx[m].jyjg
            }
            break
        case '序号':
            template_dome_json = serialnumber_ck;
            break
    }
    return template_dome_json;
}
//解析json
function parsingjson(template_dome_text, ordersobject, m, list) {
    var template_dome_json = '';
    switch (template_dome_text) {
        case '物品编码':
            if (ordersobject.mxdata[m].wpbm && ordersobject.mxdata[m].wpbm != "null") {
                template_dome_json = ordersobject.mxdata[m].wpbm
            }
            break
        case '物品名称':
            if (ordersobject.mxdata[m].wpmc && ordersobject.mxdata[m].wpmc != "null") {
                template_dome_json = ordersobject.mxdata[m].wpmc
            }
            break
        case '规格':
            if (ordersobject.mxdata[m].ggxh && ordersobject.mxdata[m].ggxh != "null") {
                template_dome_json = ordersobject.mxdata[m].ggxh
            }
            break
        case '单价':
            if (ordersobject.mxdata[m].dj && ordersobject.mxdata[m].dj != "null") {
                template_dome_json = ordersobject.mxdata[m].dj
            }
            break
        case '型号':
            if (ordersobject.mxdata[m].xh && ordersobject.mxdata[m].xh != "null") {
                template_dome_json = ordersobject.mxdata[m].xh
            }
            break
        case '单位':
            if (ordersobject.mxdata[m].dw && ordersobject.mxdata[m].dw != "null") {
                template_dome_json = ordersobject.mxdata[m].dw
            }
            break
        case '金额':
            if (ordersobject.mxdata[m].xj && ordersobject.mxdata[m].xj != "null") {
                template_dome_json = ordersobject.mxdata[m].xj
            }
            break
        case '数量':
            if (ordersobject.mxdata[m].sl && ordersobject.mxdata[m].sl != "null") {
                template_dome_json = ordersobject.mxdata[m].sl
            }
            break
        case '批号':
            if (ordersobject.mxdata[m].ph && ordersobject.mxdata[m].ph != "null") {
                template_dome_json = ordersobject.mxdata[m].ph
            }
            break
        case '总计':
            if (ordersobject.zj && ordersobject.zj != "null") {
                template_dome_json = ordersobject.zj
            }
            break
            //进货
        case '注册证号':
            if (ordersobject.mxdata[m].zczh && ordersobject.mxdata[m].zczh != "null") {
                template_dome_json = ordersobject.mxdata[m].zczh
            }
            break
        case '生产批号':
            if (ordersobject.mxdata[m].scph && ordersobject.mxdata[m].scph != "null") {
                template_dome_json = ordersobject.mxdata[m].scph
            }
            break
        case '生产日期'://空
            if (list == " ") {
                list = 'yyyy-MM-dd'
            }
            if (ordersobject.mxdata[m].scrq && ordersobject.mxdata[m].scrq != "null") {
                template_dome_json = originally_time_direct_ck(list, ordersobject.mxdata[m].scrq)
            }
            break
        case '有效期':
            if (list==" ") {
                list = 'yyyy-MM-dd'
            }
            if (ordersobject.mxdata[m].yxq && ordersobject.mxdata[m].yxq != "null") {
                template_dome_json = originally_time_direct_ck(list, ordersobject.mxdata[m].yxq)
            }
            break
        case '生产厂家':
            if (ordersobject.mxdata[m].sccj && ordersobject.mxdata[m].sccj != "null") {
                template_dome_json = ordersobject.mxdata[m].sccj
            }
            break
        case '到货数量':
            if (ordersobject.mxdata[m].dhsl && ordersobject.mxda[m].dhsl != "null") {
                template_dome_json = ordersobject.mxdata[m].dhsl
            }
            break
        case '检验数量':
            if (ordersobject.mxdata[m].hgslzj && ordersobject.mxdata[m].hgslzj != "null") {
                template_dome_json = ordersobject.mxdata[m].hgslzj
            }
            break
        case '供方检验结果':
            if (ordersobject.mxdata[m].gfjyjg && ordersobject.mxdata[m].gfjyjg != "null") {
                template_dome_json = ordersobject.mxdata[m].gfjyjg
            }
            break
        case '材质是否符合':
            if (ordersobject.mxdata[m].czsffh && ordersobject.mxdata[m].czsffh != "null") {
                template_dome_json = ordersobject.mxdata[m].czsffh
            }
            break
        case '中文标签及说明书':
            if (ordersobject.mxdata[m].zwbqjsms && ordersobject.mxdata[m].zwbqjsms != "null") {
                template_dome_json = ordersobject.mxdata[m].zwbqjsms
            }
            break
        case '其他指标':
            if (ordersobject.mxdata[m].qtzb && ordersobject.mxdata[m].qtzb != "null") {
                template_dome_json = ordersobject.mxdata[m].qtzb
            }
            break
        case '外观指标':
            if (ordersobject.mxdata[m].wbzg && ordersobject.mxdata[m].wbzg != "null") {
                template_dome_json = ordersobject.mxdata[m].wbzg
            }
            break
        case '检验结果':
            if (ordersobject.mxdata[m].jyjg && ordersobject.mxdata[m].jyjg != "null") {
                template_dome_json = ordersobject.mxdata[m].jyjg
            }
            break
        case '序号':
            template_dome_json = serialnumber_ck;
            break


    }
    return template_dome_json;
}

    //处理页眉
    function processingheader(ordersobjects) {
        var total_amount_shijia_direct_html = '';
        var yemei_value_case_direct = '';
        for (k = 0; k < $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").length; k++) {
            //表尾内容
            var biaowei_concent_list_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).attr("list");//表尾list
            var list = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').attr("list");//表尾list
            var biaowei_concent_left_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).css("left");
            var biaowei_concent_top_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).css("top");
            var biaowei_concent_width_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).css("width");
            var biaowei_concent_height_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).css("height");
            var row_family_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').css("font-family");   //列中属性
            var row_size_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').css("font-size");
            var row_bold_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').css("font-weight");
            var biaowei_concent_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_Edit_area_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').text();//表尾内容
            if (biaowei_concent_list_direct != "zidingyi") {
                if (order_zhizhang_type_zhijie_ck != 2) {
                    switch (biaowei_concent_direct) {
                        case "供应商名称":
                            total_amount_shijia_direct = ordersobjects.gys
                            if (!ordersobjects.gys || ordersobjects.gys == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "供应商联系人":
                            total_amount_shijia_direct = ordersobjects.ghlxr
                            if (!ordersobjects.ghlxr || ordersobjects.ghlxr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "单号":
                            total_amount_shijia_direct = ordersobjects.dh
                            if (!ordersobjects.dh || ordersobjects.dh == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "入库类别":
                            total_amount_shijia_direct = ordersobjects.lb//空
                            if (!ordersobjects.lb || ordersobjects.lb == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "入库单号":
                            total_amount_shijia_direct = ordersobjects.dh
                            if (!ordersobjects.dh || ordersobjects.dh == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "仓库名称":
                            total_amount_shijia_direct = ordersobjects.ck
                            if (!ordersobjects.ck || ordersobjects.ck == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "发票号":
                            total_amount_shijia_direct = ordersobjects.fph
                            if (!ordersobjects.fph || ordersobjects.fph == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "检验日期":
                            total_amount_shijia_direct = ordersobjects.jyrq//空
                            if (!ordersobjects.jyrq || ordersobjects.jyrq == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "到货日期":
                            total_amount_shijia_direct = ordersobjects.dhrq
                            if (!ordersobjects.dhrq || ordersobjects.dhrq == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "领料部门":
                            total_amount_shijia_direct = ordersobjects.bm
                            if (!ordersobjects.bm || ordersobjects.bm == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "领料人":
                            total_amount_shijia_direct = ordersobjects.llr
                            if (!ordersobjects.llr || ordersobjects.llr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "联系人":
                            total_amount_shijia_direct = ordersobjects.lxr
                            if (!ordersobjects.lxr || ordersobjects.lxr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "出库单号":
                            total_amount_shijia_direct = ordersobjects.dh
                            if (!ordersobjects.dh || ordersobjects.dh == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;

                    }
                } else {
                    switch (biaowei_concent_direct) {
                        case "联系人":
                            total_amount_shijia_direct = ordersobjects.ghslxr
                            if (!ordersobjects.ghslxr || ordersobjects.ghslxr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "质检单号":
                            total_amount_shijia_direct = ordersobjects.zjdh
                            if (!ordersobjects.zjdh || ordersobjects.zjdh == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "供货商":
                            total_amount_shijia_direct = ordersobjects.ghs
                            if (!ordersobjects.ghs || ordersobjects.ghs == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "供货商联系人":
                            total_amount_shijia_direct = ordersobjects.ghslxr
                            if (!ordersobjects.ghslxr || ordersobjects.ghslxr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "检验日期":
                            total_amount_shijia_direct = ordersobjects.zjsj
                            if (!ordersobjects.zjsj || ordersobjects.zjsj == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "到货日期":
                            total_amount_shijia_direct = ordersobjects.zjsj
                            if (!ordersobjects.zjsj || ordersobjects.zjsj == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                   
                    }
                    
                }

            }
            else {
                total_amount_shijia_direct = biaowei_concent_direct
            }
            total_amount_shijia_direct_html += '<div style="height:' + biaowei_concent_height_direct + ';width:' + biaowei_concent_width_direct + ';top:' + biaowei_concent_top_direct + ';left:' + biaowei_concent_left_direct + ';margin:0;display:inline-block;position: absolute;font-family:' + row_family_in_direct + '; font-size:' + row_size_in_direct + '; font-weight:' + row_bold_in_direct + ';"><span>' + total_amount_shijia_direct + '</span></div>'

        }
        return total_amount_shijia_direct_html;
    }

    //报表尾部信息-通用
    function processingfooter(ordersobjects) {
        var total_amount_shijia_direct = '';
        var total_amount_shijia_direct_html = '';
        var bill_total_amount_shijia_direct = 38;
        //处理表尾数据
        for (k = 0; k < $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").length; k++) {
            total_amount_shijia_direct = "";
            //表尾内容
            var biaowei_concent_list_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).attr("list");//表尾list
            var list = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').attr("list");//表尾list
            var biaowei_concent_left_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).css("left");
            var biaowei_concent_top_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).css("top");
            var biaowei_concent_width_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).css("width");
            var biaowei_concent_height_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).css("height");
            var row_family_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').css("font-family");   //列中属性
            var row_size_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').css("font-size");
            var row_bold_in_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').css("font-weight");
            var biaowei_concent_direct = $("#order_print_baocun_mobanhtml_zhijiedayin").find("#order_end_page_cosp_ck").find(".currency_pop_attribute").eq(k).find('span').text();//表尾内容
            if (biaowei_concent_list_direct != "zidingyi") {
                if (order_zhizhang_type_zhijie_ck != 2) {
                    switch (biaowei_concent_direct) {
                        case "入库时间":
                            if (ordersobjects.rq || ordersobjects.rq != "null") {
                                total_amount_shijia_direct = originally_time_direct_ck(list, ordersobjects.rq)
                            } else {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "出库时间":
                            if (ordersobjects.cksj || ordersobjects.cksj != "null") {
                                total_amount_shijia_direct = originally_time_direct_ck(list, ordersobjects.cksj)
                            } else {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "库管员":
                            total_amount_shijia_direct = ordersobjects.kgy
                            if (!ordersobjects.kgy || ordersobjects.kgy == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "仓库管理员":
                            total_amount_shijia_direct = ordersobjects.ckgly
                            if (!ordersobjects.ckgly || ordersobjects.ckgly == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "审核人":
                            total_amount_shijia_direct = ordersobjects.czr
                            if (!ordersobjects.czr || ordersobjects.czr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "金额大写":
                            total_amount_shijia_direct = convertCurrency_direct_ck(parseInt(ordersobjects.zj))
                            if (!ordersobjects.zj || ordersobjects.zj == "null") {
                                total_amount_shijia_direct = '零'
                            }
                            break;
                        case "金额小写":
                            total_amount_shijia_direct = ordersobjects.zj;
                            if (!ordersobjects.zj || ordersobjects.zj == "null") {
                                total_amount_shijia_direct = '0'
                            }
                            break;
                        case "入库金额大写":
                            total_amount_shijia_direct = convertCurrency_direct_ck(parseInt(ordersobjects.zj))
                            if (!ordersobjects.zj || ordersobjects.zj == "null") {
                                total_amount_shijia_direct = '零'
                            }
                            break;
                        case "入库金额小写":
                            total_amount_shijia_direct = ordersobjects.zj;
                            if (!ordersobjects.zj || ordersobjects.zj == "null") {
                                total_amount_shijia_direct = '0'
                            }
                            break;
                        case "到货数量总计":
                            total_amount_shijia_direct = ordersobjects.dhslzj;
                            if (!ordersobjects.dhslzj || ordersobjects.dhslzj == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "合格数量总计":
                            total_amount_shijia_direct = ordersobjects.hgslzj;
                            if (!ordersobjects.hgslzj || ordersobjects.hgslzj == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "检验人":
                            total_amount_shijia_direct = ordersobjects.jyz;
                            if (!ordersobjects.jyz || ordersobjects.jyz == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "入库质检批准人":
                            total_amount_shijia_direct = ordersobjects.pzr;
                            if (!ordersobjects.pzr || ordersobjects.pzr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break
                        case "备注":
                            total_amount_shijia_direct = ordersobjects.bz
                            if (!ordersobjects.bz || ordersobjects.bz == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                    }
                }
                if (order_zhizhang_type_zhijie_ck == 2) {
                    switch (biaowei_concent_direct) {
                        case "到货数量总计":
                            total_amount_shijia_direct = ordersobjects.jhs
                            if (!ordersobjects.jhs|| ordersobjects.jhs == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "合格数量总计":
                            total_amount_shijia_direct = ordersobjects.zhgs
                            if (!ordersobjects.zhgs || ordersobjects.zhgs == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "检验人":
                            total_amount_shijia_direct = ordersobjects.zjr
                            if (!ordersobjects.zjr || ordersobjects.zjr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "入库质检批准人":
                            total_amount_shijia_direct = ordersobjects.pzr
                            if (!ordersobjects.pzr || ordersobjects.pzr == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                        case "备注":
                            total_amount_shijia_direct = ordersobjects.bz
                            if (!ordersobjects.bz || ordersobjects.bz == "null") {
                                total_amount_shijia_direct = ''
                            }
                            break;
                    }
                }
                }
            else {
                total_amount_shijia_direct = biaowei_concent_direct
            }
            total_amount_shijia_direct_html += '<div style="height:' + biaowei_concent_height_direct + ';width:' + biaowei_concent_width_direct + ';top:' + biaowei_concent_top_direct + ';left:' + biaowei_concent_left_direct + ';margin:0;display:inline-block;position: absolute;font-family:' + row_family_in_direct + '; font-size:' + row_size_in_direct + '; font-weight:' + row_bold_in_direct + ';"><span>' + total_amount_shijia_direct + '</span></div>'

        }
        return total_amount_shijia_direct_html;
    }

    // 根据选择的时间日期进行改变时间格式
    function originally_time_direct_ck(list_div_date_direct, originally_yuans_date) {
        var date = new Date(originally_yuans_date);
        switch (list_div_date_direct) {
            case "yyyyMMdd":
                var date = date.Format_date("yyyyMMdd");
                Originally_format = date.toLocaleString();
                break;
            case "yyyy-MM-dd":
                var date = date.Format_date("yyyy-MM-dd");
                Originally_format = date.toLocaleString();
                break;
            case "MM-dd":
                date = date.Format_date("MM-dd");
                Originally_format = date.toLocaleString();
                break;
            case "yyyy/MM/dd":
                var date = date.Format_date("yyyy/MM/dd");
                var Originally_format = date.toLocaleString();
                break;
            default:
                var date = date.Format_date("yyyy-MM-dd hh:mm:ss");
                var Originally_format = date.toLocaleString();
                break;
        }
        return Originally_format;
    }

    //金额转大写
    function convertCurrency_direct_ck(money) {
        //汉字的数字
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (money == '') { return ''; }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    }
