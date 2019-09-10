using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace denturebll.basemodels
{
    /// <summary>
    /// 不重复随机字符串类
    /// </summary>
    public class SerialNumberHelper
    {
        /** 自定义进制（选择你想要的进制数，不能重复且最好不要0、1这些容易混淆的字符） */
        private static readonly char[] r = new char[] { 'q', 'w', 'e', '8', 's', '2', 'd', 'z',
        'x', '9', 'c', '7', 'p', '5', 'k', '3', 'm', 'j', 'u', 'f', 'r', '4', 'v', 'y', 't', 'n', '6', 'b', 'g', 'h' };

        /** 定义一个字符用来补全邀请码长度（该字符前面是计算出来的邀请码，后面是用来补全用的） */
        private static readonly char b = 'a';

        /** 进制长度 */
        private static readonly int binLen = r.Length;

        /** 邀请码长度 */
        private static readonly int s = 6;

        /// <summary>
        /// 根据ID生成随机码
        /// </summary>
        /// <param name="id">ID</param>
        /// <returns></returns>
        public static String ToSerialCode(long id)
        {
            char[] buf = new char[32];
            int charPos = 32;

            while ((id / binLen) > 0)
            {
                int ind = (int)(id % binLen);
                buf[--charPos] = r[ind];
                id /= binLen;
            }
            buf[--charPos] = r[(int)(id % binLen)];
            String str = new String(buf, charPos, (32 - charPos));

            //不够长度的自动随机补全
            if (str.Length < s)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(b);
                Random rnd = new Random();
                for (int i = 1; i < s - str.Length; i++)
                {
                    sb.Append(r[rnd.Next(binLen)]);
                }
                str += sb.ToString();
            }
            return str;
        }

        /// <summary>
        /// 根据随机码生成ID
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public static long CodeToId(String code)
        {
            char[] chs = code.ToCharArray();
            long res = 0L;
            for (int i = 0; i < chs.Length; i++)
            {
                int ind = 0;
                for (int j = 0; j < binLen; j++)
                {
                    if (chs[i] == r[j])
                    {
                        ind = j;
                        break;
                    }
                }
                if (chs[i] == b)
                {
                    break;
                }
                if (i > 0)
                {
                    res = res * binLen + ind;
                }
                else
                {
                    res = ind;
                }
            }
            return res;
        }
    }
}