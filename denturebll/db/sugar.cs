using denturebll.diymodels;
using SqlSugar;
using System;
using System.Web;
using System.Linq;
using System.Collections.Generic;

namespace denturebll.db
{
    public class sugar
    {

        /// <summary>
        /// 数据库连接
        /// </summary>
        /// <returns></returns>
        public static SqlSugarClient GetInstance(string mydb)
        {
            string haibinconnstr = System.Configuration.ConfigurationManager.ConnectionStrings[mydb].ConnectionString;
            SqlSugarClient db = new SqlSugarClient(new ConnectionConfig()
            {
                ConnectionString = haibinconnstr,
                DbType = DbType.SqlServer,
                IsAutoCloseConnection = true,
                //InitKeyType = InitKeyType.Attribute,//根据实体类生成表必要字段
            });
            db.Ado.IsEnableLogEvent = true;
            db.Ado.LogEventStarting = (sql, pars) =>
            {
                Console.WriteLine(sql + "\r\n" + db.Utilities.SerializeObject(pars));
                Console.WriteLine();
            };
            return db;
        }
    }
}