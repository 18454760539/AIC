using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace denturebll.diymodels
{
    /// <summary>
    /// 全局返回json处理类
    /// </summary>
    public class responsejson
    {
        /// <summary>
        /// 全局返回json处理类
        /// </summary>
        /// <param name="code">状态码 0成功 1失败  2系统捕捉报错异常</param>
        /// <param name="count">返回数据条数</param>
        /// <param name="msg">返回消息</param>
        /// <param name="data">返回数据list</param>
        /// <param name="diy">返回自定义数据</param>
        public responsejson(int code, int count, string msg, object data, object diy)
        {
            this.code = code;
            this.count = count;
            this.msg = msg;
            this.data = data;
            this.diy = diy;
        }

        /// <summary>
        /// 返回成功(适用于查询)
        /// </summary>
        /// <param name="count">返回数据条数</param>
        /// <param name="data">返回数据list</param>
        public responsejson(int count, object data)
        {
            this.code = 0;
            this.count = count;
            this.msg = "ok";
            this.data = data;
            this.diy = "";
        }

        /// <summary>
        /// 返回成功(适用于查询,下拉列表,树形结构等)
        /// </summary>
        /// <param name="data">返回数据list</param>
        public responsejson(object data)
        {
            this.code = 0;
            this.count = 0;
            this.msg = "查询成功!";
            this.data = data;
            this.diy = "";
        }

        /// <summary>
        /// 操作通用(适用于操作失败和操作异常)
        /// </summary>
        /// <param name="msg">提示</param>
        /// <param name="code">状态码 0成功 1失败  2系统捕捉报错异常</param>
        public responsejson(int code, string msg)
        {
            this.code = code;
            this.count = 0;
            this.msg = msg == null ? msg : msg.Replace("\r", "").Replace("\n", "");
            this.data = "";
            this.diy = "";
        }

        /// <summary>
        /// 操作成功
        /// </summary>
        /// <param name="msg">提示</param>
        public responsejson(string msg)
        {
            this.code = 0;
            this.count = 0;
            this.msg = msg;
            this.data = "";
            this.diy = "";
        }

        /// <summary>
        /// 构造函数
        /// </summary>
        public responsejson()
        {
            this.code = 0;
            this.count = 0;
            this.msg = "";
            this.data = new List<string>();
            this.diy = "";
        }

        /// <summary>
        /// 调用该对象必须调用下tostring方法
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }

        /// <summary>
        /// 
        /// </summary>
        public int code { set; get; }
        public string msg { set; get; }

        public int count { set; get; }

        public object data { set; get; }

        public object diy { set; get; }
    }
}