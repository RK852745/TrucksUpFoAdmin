using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using TrucksUpFoAdmin.Services;

namespace TrucksUpFoAdmin.Models
{
    public class cl_login_user
    {
        public string username { get; set; }
        public string password { get; set; }
        public string usefor { get; set; }

        string m_sqlString;

        public string UserIP { get; set; }
        public string UserMacAddress { get; set; }
        public string DeviceName { get; set; }
        public string Platform { get; set; }
        public int Type { get; set; }
        public string Mode { get; set; }

        public string org { get; set; }
        public string Token { get; set; }
        public DataSet fnUsersLogin()
        {

            m_sqlString = "EXEC Pro_UserLogin @username='" + username + "',@password='" + password + "'," +
                "@for='" + usefor + "',@org='" + org + "'";
            dal d = dal.GetInstance();
            DataSet ds = d.GetDataSet(m_sqlString);
            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }

        public DataSet checkUserCredentials()
        {
            m_sqlString = "EXEC Pro_UserLogin @username='" + username + "',@password='" + password + "'," +
               "@Mode='" + Mode + "',@UserIP='" + UserIP + "',@UserMacAddress='" + UserMacAddress
               + "',@Platfrom='" + Platform + "',@DeviceName='" + DeviceName + "'";
            dal d = dal.GetInstance();
            DataSet ds = d.GetDataSet(m_sqlString);
            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }

        public DataSet verifyToken()
        {
            m_sqlString = "EXEC Pro_UserLogin @username='" + username + "',@password='" + password + "'," +
               "@Mode='" + Mode + "',@Token='" + Token + "'";
            dal d = dal.GetInstance();
            DataSet ds = d.GetDataSet(m_sqlString);
            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }

        public static string DataTableToJSONWithStringBuilder(DataTable table)
        {
            var JSONString = new StringBuilder();
            if (table.Rows.Count > 0)
            {
                JSONString.Append("[");
                for (int i = 0; i < table.Rows.Count; i++)
                {
                    JSONString.Append("{");
                    for (int j = 0; j < table.Columns.Count; j++)
                    {
                        if (j < table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\",");
                        }
                        else if (j == table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\"");
                        }
                    }
                    if (i == table.Rows.Count - 1)
                    {
                        JSONString.Append("}");
                    }
                    else
                    {
                        JSONString.Append("},");
                    }
                }
                JSONString.Append("]");
            }
            return JSONString.ToString();
        }
    }
}