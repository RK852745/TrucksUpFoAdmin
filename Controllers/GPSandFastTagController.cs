using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrucksUpFoAdmin.Services;

namespace TrucksUpFoAdmin.Controllers
{
    public class GPSandFastTagController : Controller
    {
        // GET: GPSandFastTag
        private void CheckSession()
        {
            try
            {
                if (!UtilityModule.AdminSessionCheck())
                {
                    Response.Redirect(UtilityModule.getLoginPageUrl());
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
                Response.Redirect(UtilityModule.getLoginPageUrl());
            }
        }
        public ActionResult GPSandFastTag()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GPSandFastTag(string startdate,string enddate)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())

                {
                    string UserId = UtilityModule.getParamFromUrl("userid");
                    string ProcedureName = "[dbo].[ManageProductDetailsGPS]";
                    string Parameters = "@mode='GetDataDashboardGPS',@startdate='" + startdate + "',@enddate='" + enddate + "'";
                    new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        result = LowercaseJsonSerializer.SerializeObject(ds);
                    }
                     
                }

            }
            catch (Exception ex)
            {
                result = ex.Message;
                new ExceptionLogging(ex);
            }
            return Json(result, JsonRequestBehavior.AllowGet);

        }
    }
}