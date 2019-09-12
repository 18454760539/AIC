using denturebll.db;
using denturebll.diymodels;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AIC.control
{
    /// <summary>
    /// logincontrol 的摘要说明
    /// </summary>
    public class logincontrol : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string functiontype = context.Request.Params["functiontype"];
            switch (functiontype)
            {
                case "registered": registered(context); break;//注册
                // case "fsyzm": fsyzm(context); break;
                case "login": logins(context); break;
            }
        }
        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="context"></param>
        public void registered(HttpContext context)
        {
            string email = context.Request.Params["email"];
            string tj_email = context.Request.Params["tj_email"];
            string password = context.Request.Params["password"];
            string towpassword = context.Request.Params["towpassword"];
            var db = sugar.GetInstance("mydb");

            var get = db.Queryable<userstable>().Where(it => it.email == email).ToList();
            if (get.Count > 0)
            {
                context.Response.Write(new responsejson(1, "当前邮箱已注册"));
            }
            var lisget = db.Queryable<userstable>().Where(it => it.email == tj_email).ToList();

            if (lisget.Count == 0)
            {
                context.Response.Write(new responsejson(1, "推荐人邮箱不正确"));
                return;
            }
            else
            {
                var tjlist = db.Queryable<userstable>().Where(it => it.tj_email == tj_email)
                .Where("convert(varchar(10),addtime,120) = convert(varchar(10),getdate(),120)")
                .Select(it => new
                {
                    it.email
                }).ToList();
                if (tjlist.Count >= 100)
                {
                    context.Response.Write(new responsejson(1, "推荐人邮箱今日可用次数为0"));
                    return;
                }
                foreach (var item in lisget)
                {
                    item.number += Convert.ToDecimal(0.1);
                }
                var t3 = db.Updateable(lisget).UpdateColumns(it => new { it.number }).ExecuteCommand();
            }

            List<userstable> list = new List<userstable>();
            userstable im = new userstable();
            im.ID = Convert.ToString(DateTime.Now.ToString("HHmmssMMfffyydd"));
            im.password = password;
            im.tj_email = tj_email;
            im.towpassword = towpassword;
            im.email = email;
            im.number = 0;
            im.type = 0;
            im.zztype = 1;
            im.addtime = DateTime.Now;
            list.Add(im);
            int t2 = db.Insertable(list).ExecuteCommand();

            if (t2 > 0)
            {
                context.Response.Write(new responsejson(0, "注册成功"));
            }
            else
            {
                context.Response.Write(new responsejson(1, "注册失败"));
            }

        }
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="context"></param>
        public void logins(HttpContext context)
        {
            string email = context.Request.Params["email"];
            string password = context.Request.Params["password"];
            var db = sugar.GetInstance("mydb");

            var get = db.Queryable<userstable>().Where(it => it.email == email).Select(it => new {
                it.password,
                it.ID,
                it.type,
                it.email
            }).ToList();
            if (get.Count == 0)
            {
                context.Response.Write(new responsejson(1, "当前邮箱不存在"));
            }
            else
            {
                if (get.Select(it => it.type).Take(1).First() == 1)
                {
                    context.Response.Write(new responsejson(1, "账号异常，请联系客服"));
                    return;
                }
                if (password != get.Select(it => it.password).Take(1).First())
                {
                    context.Response.Write(new responsejson(1, "账号或密码不正确!"));
                }
                else
                {
                    cookiecreate(context, get[0].ID);//生成cookie
                    context.Response.Write(new responsejson(0, 0, "登录成功", get.Select(it => new { ID = it.ID }).ToList(), ""));
                }
            }

        }

        /// <summary>
        /// 生成cookie
        /// </summary>
        /// <param name="context"></param>
        private void cookiecreate(HttpContext context, string ID)
        {

            string landingCertificate = Guid.NewGuid().ToString("N");


            HttpCookie cookies = new HttpCookie("LandingOne");

            cookies.Values.Add("ID", ID);//单点登陆鉴权信息

            context.Response.Cookies.Add(cookies);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}