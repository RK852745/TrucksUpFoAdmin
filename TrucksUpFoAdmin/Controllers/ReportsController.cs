using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using TrucksUpFoAdmin.Models;
using TrucksUpFoAdmin.Services;

namespace TrucksUpFoAdmin.Controllers
{
    public class ReportsController : Controller
    {
        // GET: Reports
        public ActionResult Reports()
        {
            CheckSession();
            return View();
        }

        public ActionResult StickerReports()
        {
            CheckSession();
            return View();
        }

        public ActionResult StickersVisitReports()
        {
            CheckSession();
            return View();
        }

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
         
        [HttpPost]
        public ActionResult MethodGetFieldofficersReports(string startdate, string enddate, string type)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[AdminDasboardMaster]";
                        string Parameters = "@mode='GetFieldOfficerReports',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate
                            + "',@EmployeeType='" + type + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = LowercaseJsonSerializer.SerializeObject(ds);
                        }
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



        [HttpPost]
        public ActionResult MethodGetFieldofficersStickerReports(string startdate, string enddate, string type)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[SP_GetStickerVisitReports]";
                        string Parameters = "@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate
                            + "',@EmployeeType='" + type + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = LowercaseJsonSerializer.SerializeObject(ds);
                        }
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


        [HttpPost]
        public ActionResult LogOut()
        {
            string userid = UtilityModule.getAdminSession("userid");
            string token = UtilityModule.getAdminSession("token");
            string ProcedureName = "Pro_UserLogin";
            string Parameters = @"@userid='" + userid + "',@token='" + token + "',@Mode='updateTokenExpire'";
            new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);

            HttpContext.Session.Abandon();
            HttpContext.Session.Clear();
            if (HttpContext != null)
            {
                int cookieCount = HttpContext.Request.Cookies.Count;
                for (var i = 0; i < cookieCount; i++)
                {
                    var cookie = HttpContext.Request.Cookies[i];
                    if (cookie != null)
                    {
                        var expiredCookie = new HttpCookie(cookie.Name)
                        {
                            Expires = DateTime.Now.AddDays(-1),
                            Domain = cookie.Domain
                        };
                        HttpContext.Response.Cookies.Add(expiredCookie); // overwrite it
                    }
                }
                HttpContext.Request.Cookies.Clear();
            }

            return Json("Login", JsonRequestBehavior.AllowGet);

        }


        [HttpPost]
        public ActionResult MethodGetStickerData(string startdate, string enddate, int start, int length, string searchValue, int draw)
        {
            List<StickerDataList> DataList = new List<StickerDataList>();
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {

                        searchValue = "";

                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[SP_StickerVisits]";
                        string Parameters = "@mode='GetVistsdatabydaterangetesting',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate
                            + "',@start='"+ start + "',@length='"+ length + "',@searchValue='"+ searchValue + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DataList = (from rows in ds.Tables[0].AsEnumerable()
                                        select new StickerDataList
                                        {
                                            id = Convert.ToInt32(rows["Id"]),
                                            fullname = Convert.ToString(rows["FullName"]),
                                            drivernumber = Convert.ToString(rows["DriverNumber"]),
                                            operatornumber = Convert.ToString(rows["OperatorNumber"]),
                                            downloads = Convert.ToString(rows["Downloads"]),
                                            stickerimage = Convert.ToString(rows["StickerImage"]),
                                            stickersize = Convert.ToString(rows["StickerSize"]),
                                            lanefrom = Convert.ToString(rows["LaneFrom"]),
                                            laneto = Convert.ToString(rows["LaneTo"]),
                                            vehicletype = Convert.ToString(rows["VehicleType"]),
                                            vehiclesize = Convert.ToString(rows["VehicleSize"]),
                                            vehiclecapacity = Convert.ToString(rows["VehicleCapacity"]),
                                            vechilenumber = Convert.ToString(rows["VechileNumber"]),
                                            verifiedstatus = Convert.ToString(rows["VerifiedStatus"]),
                                            verifiedby = Convert.ToString(rows["VerifiedBy"]),
                                            activeflag = Convert.ToString(rows["ActiveFlag"]),
                                            createdby = Convert.ToString(rows["CreatedBy"]),
                                            createddate = Convert.ToString(rows["CreatedDate"]),
                                            modifiedby = Convert.ToString(rows["ModifiedBy"]),
                                            modifieddate = Convert.ToString(rows["ModifiedDate"]),
                                            doneby = Convert.ToString(rows["DoneBy"]),  
                                        }).ToList();


                            var results = new
                            {
                                draw = draw,
                                recordsTotal = ds.Tables[1].Rows[0]["Counts"].ToString(),
                                recordsFiltered = ds.Tables[1].Rows[0]["Counts"].ToString(),
                                data = DataList
                            };

                            return Json(results);
                            // result = LowercaseJsonSerializer.SerializeObject(ds);
                        }
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

        [HttpPost]
        public ActionResult Methodupdatestatus(string id)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[SP_StickerVisits]";
                        string Parameters = "@mode='updatestatusbyid',@UserId='" + UserId
                            + "',@id='" + id + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = LowercaseJsonSerializer.SerializeObject(ds);
                        }
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

        [HttpPost]
        public ActionResult GetCountsByDateRange(string startdate, string enddate)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[SP_StickerVisits]";
                        string Parameters = "@mode='GetVistsCountsbydaterange',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = ds.Tables[0].Rows[0]["Counts"].ToString();

                        }
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
 