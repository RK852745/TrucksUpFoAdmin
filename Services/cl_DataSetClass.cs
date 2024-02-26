using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace TrucksUpFoAdmin.Services
{
    public class cl_DataSetClass
    {
        public cl_DataSetClass(out DataSet dt, string ProcedureName, string Parameters)
        {
            string m_sqlString = "EXEC " + ProcedureName + " " + Parameters;
            dal d = dal.GetInstance();
            dt = d.GetDataSet(m_sqlString);
        }
    }
}