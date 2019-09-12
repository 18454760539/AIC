using System;
using System.Linq;
using System.Text;

namespace Models
{
    ///<summary>
    ///用户表
    ///</summary>
    public partial class userstable
    {
        public userstable()
        {

        }
        /// <summary>
        /// Desc:
        /// Default:
        /// Nullable:False
        /// </summary>           
        public string ID { get; set; }

        /// <summary>
        /// Desc:邮箱
        /// Default:0
        /// Nullable:True
        /// </summary>           
        public string email { get; set; }

        /// <summary>
        /// Desc:推荐人邮箱
        /// Default:0
        /// Nullable:True
        /// </summary>           
        public string tj_email { get; set; }

        /// <summary>
        /// Desc:密码
        /// Default:0
        /// Nullable:True
        /// </summary>           
        public string password { get; set; }

        /// <summary>
        /// Desc:二级密码
        /// Default:0
        /// Nullable:True
        /// </summary>           
        public string towpassword { get; set; }

        /// <summary>
        /// Desc:账户数量
        /// Default:0
        /// Nullable:True
        /// </summary>    
        public decimal? number { get; set; }

        /// <summary>
        /// Desc:注册时间
        /// Default:0
        /// Nullable:True
        /// </summary>    
        public DateTime addtime { get; set; }

        /// <summary>
        /// Desc:账号状态（0：正常，1：封禁）
        /// Default:0
        /// Nullable:True
        /// </summary>    
        public int? type { get; set; }

        /// <summary>
        /// Desc:转账状态（0：正常，1：不能转账）
        /// Default:0
        /// Nullable:True
        /// </summary>    
        public int? zztype { get; set; }
    }
}