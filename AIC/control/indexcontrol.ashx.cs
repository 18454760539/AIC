using denturebll.db;
using denturebll.diymodels;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace AIC.control
{
    /// <summary>
    /// indexcontrol 的摘要说明
    /// </summary>
    public class indexcontrol : IHttpHandler
    {

        userstable st;
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            st = getcookieinfo(context);
            if (st == null)
            {
                context.Response.Write(new responsejson(1, "鉴权失败"));
                return;
            }
            string functiontype = context.Request.Params["functiontype"];
            switch (functiontype)
            {
                case "fsyzm": fsyzm(context); break;
               // case "registered": registered(context); break;//注册
                                                              // case "login": login(context); break;
                case "transfer": transfer(context); break;
                case "all": all(context); break;
                case "td": td(context); break;
            }
        }
        /// <summary>
        /// 获取我的团队
        /// </summary>
        /// <param name="context"></param>
        public void td(HttpContext context)
        {
            string tj_email = context.Request.Params["tj_email"];
            var db = sugar.GetInstance("mydb");

            var get = db.Queryable<userstable>().Where(it => it.tj_email == st.email).Select(it => new {
                it.email,
                it.addtime
            }).ToList();

            context.Response.Write(new denturebll.diymodels.responsejson(0, get));

        }
        /// <summary>
        /// 获取信息
        /// </summary>
        /// <param name="context"></param>
        public void all(HttpContext context)
        {
            string em = context.Request.Params["email"];
            var db = sugar.GetInstance("mydb");

            var get = db.Queryable<userstable>().Where(it => it.ID == st.ID).Select(it => new {
                it.email,
                it.ID,
                it.number
            }).ToList();

            context.Response.Write(new responsejson(0, get));

        }
        /// <summary>
        /// 转账
        /// </summary>
        /// <param name="context"></param>
        public void transfer(HttpContext context)
        {
            string ID = context.Request.Params["ID"];
            string number = context.Request.Params["number"];
            var db = sugar.GetInstance("mydb");

            var get = db.Queryable<userstable>().Where(it => it.ID == st.ID).Select(it => new {
                ID = it.ID,
                number = (it.number == null ? 0 : it.number) - Convert.ToDecimal(number),
                it.zztype
            }).ToList();


            if (get.Select(it => it.number).Take(1).First() < 0)
            {
                context.Response.Write(new responsejson(1, "余额不足"));
                return;
            }
            if (get.Select(it => it.zztype).Take(1).First() == 1)
            {
                context.Response.Write(new responsejson(1, "请联系客服QQ2855919898进行人工实名认证，通过后可进行此操作。"));
                return;
            }
            userstable im = new userstable();
            im.ID = get.Select(it => it.ID).Take(1).First();
            im.number = get.Select(it => it.number).Take(1).First();

            var get1 = db.Queryable<userstable>().Where(it => it.ID == ID).Select(it => new {
                ID = it.ID,
                number = it.number + Convert.ToDecimal(number)
            }).ToList();
            userstable imone = new userstable();
            if (get1.Count > 0)
            {
                imone.ID = get1.Select(it => it.ID).Take(1).First();
                imone.number = get1.Select(it => it.number).Take(1).First();
            }
            else
            {
                context.Response.Write(new responsejson(1, "对方ID不存在"));
                return;
            }



            int t3 = db.Updateable(im).UpdateColumns(it => new { it.number }).ExecuteCommand();
            int t4 = db.Updateable(imone).UpdateColumns(it => new { it.number }).ExecuteCommand();

            if (t3 > 0 && t4 > 0)
            {
                context.Response.Write(new responsejson(0, "转账成功"));
            }
            else
            {
                context.Response.Write(new responsejson(1, "转账失败"));
            }

        }
        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="context"></param>
        //public void registered(HttpContext context)
        //{
        //    string email = context.Request.Params["email"];
        //    string tj_email = context.Request.Params["tj_email"];
        //    string password = context.Request.Params["password"];
        //    string towpassword = context.Request.Params["towpassword"];
        //    var db = sugar.GetInstance("mydb");

        //    var get = db.Queryable<userstable>().Where(it => it.email == email).ToList();
        //    if (get.Count > 0)
        //    {
        //        context.Response.Write(new responsejson(1, "当前邮箱已注册"));
        //    }
        //    var lisget = db.Queryable<userstable>().Where(it => it.email == tj_email).ToList();

        //    if (lisget.Count == 0)
        //    {
        //        context.Response.Write(new responsejson(1, "推荐人邮箱不正确"));
        //        return;
        //    }
        //    else
        //    {
        //        var tjlist = db.Queryable<userstable>().Where(it => it.tj_email == tj_email)
        //        .Where("convert(varchar(10),addtime,120) = convert(varchar(10),getdate(),120)")
        //        .Select(it => new
        //        {
        //            it.email
        //        }).ToList();
        //        if (tjlist.Count >= 100)
        //        {
        //            context.Response.Write(new responsejson(1, "推荐人邮箱今日可用次数为0"));
        //            return;
        //        }
        //        foreach (var item in lisget)
        //        {
        //            item.number += Convert.ToDecimal(0.1);
        //        }
        //        var t3 = db.Updateable(lisget).UpdateColumns(it => new { it.number }).ExecuteCommand();
        //    }

        //    List<userstable> list = new List<userstable>();
        //    userstable im = new userstable();
        //    im.ID = Convert.ToString(DateTime.Now.ToString("HHmmssMMfffyydd"));
        //    im.password = password;
        //    im.tj_email = tj_email;
        //    im.towpassword = towpassword;
        //    im.email = email;
        //    im.number = 0;
        //    im.type = 0;
        //    im.zztype = 1;
        //    im.addtime = DateTime.Now;
        //    list.Add(im);
        //    int t2 = db.Insertable(list).ExecuteCommand();

        //    if (t2 > 0)
        //    {
        //        context.Response.Write(new responsejson(0, "注册成功"));
        //    }
        //    else
        //    {
        //        context.Response.Write(new responsejson(1, "注册失败"));
        //    }

        //}
        /// <summary>
        /// 发送验证码
        /// </summary>
        /// <param name="context"></param>
        public void fsyzm(HttpContext context)
        {
            string emil = context.Request.Params["emil"];

            //var db = sugar.GetInstance("mydb");
            //var list = db.Queryable<userstable>()
            //    .ToList();
            //实例化一个发送邮件类。
            MailMessage mailMessage = new MailMessage();
            //发件人邮箱地址，方法重载不同，可以根据需求自行选择。
            mailMessage.From = new MailAddress("1037838286@qq.com");
            //收件人邮箱地址。
            mailMessage.To.Add(new MailAddress(emil));
            //邮件标题。
            mailMessage.Subject = "标题";
            string verificationcode = createrandom(6);
            //邮件内容。
            mailMessage.Body = "你的验证码是" + verificationcode;
            //实例化一个SmtpClient类。
            SmtpClient client = new SmtpClient();
            //在这里我使用的是qq邮箱，所以是smtp.qq.com，如果你使用的是126邮箱，那么就是smtp.126.com。
            client.Host = "smtp.qq.com";
            //使用安全加密连接。
            client.EnableSsl = true;
            //不和请求一块发送。
            client.UseDefaultCredentials = false;
            //验证发件人身份(发件人的邮箱，邮箱里的生成授权码);
            client.Credentials = new NetworkCredential("1037838286@qq.com", "mxmigdxolipsbcca");
            //发送
            client.Send(mailMessage);

            context.Response.Write(new responsejson(0, "发送成功"));
        }
        //生成6位数字和大写字母的验证码
        private string createrandom(int codelengh)
        {
            int rep = 0;
            string str = string.Empty;
            long num2 = DateTime.Now.Ticks + rep;
            rep++;
            Random random = new Random(((int)(((ulong)num2) & 0xffffffffL)) | ((int)(num2 >> rep)));
            for (int i = 0; i < codelengh; i++)
            {
                char ch;
                int num = random.Next();
                if ((num % 2) == 0)
                {
                    ch = (char)(0x30 + ((ushort)(num % 10)));
                }
                else
                {
                    ch = (char)(0x41 + ((ushort)(num % 0x1a)));
                }
                str = str + ch.ToString();
            }
            return str;

        }
        /// <summary>
        /// pc端获取登录信息验证
        /// </summary>
        /// <param name="context">context对象</param>
        /// <returns>返回loginusercookie类</returns>
        public static userstable getcookieinfo(HttpContext context)
        {
            //读取coolie
            if (context.Request.Cookies["LandingOne"] != null)
            {
                string ID = context.Request.Cookies["LandingOne"]["ID"];

                //检查用户是否是正常状态或者是否能找到此用户
                var db = sugar.GetInstance("mydb");

                userstable st = db.Queryable<userstable>()
                    .Where(it => it.ID == ID && it.type == 0)
                    .First();

                return st;

            }
            else
            {
                return null;
            }
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