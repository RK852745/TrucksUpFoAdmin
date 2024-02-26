using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace TrucksUpFoAdmin.Services
{
    public class dal
    {
        private SqlConnection con = null;
        private SqlDataAdapter adap = null;
        private string str = "";
        private dal()
        {
            str = ConfigurationManager.ConnectionStrings["ConnStringFO"].ConnectionString;
        }

        private static dal objdal;

        public static dal GetInstance()
        {
            if (objdal == null)
            {
                objdal = new dal();
            }
            return objdal;
        }
        public DataSet GetDataSet(string sSql)
        {
            try
            {
                con = new SqlConnection(str);
                con.Open();
                adap = new SqlDataAdapter(sSql, con);
                DataSet ds = new DataSet();
                adap.Fill(ds);
                if (ds.Tables.Count > 0)
                {
                    return ds;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
                return null;
            }
            finally
            {
                con.Close();
            }
        }
    }
}