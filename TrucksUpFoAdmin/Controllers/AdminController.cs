using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using System.Web.Services;
using System.Web.UI.WebControls;
using System.Xml.Linq;
using TrucksUpFoAdmin.DbContext;
using TrucksUpFoAdmin.Models;
using TrucksUpFoAdmin.Services;

namespace TrucksUpFoAdmin.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Dashboard()
        {
            if (!string.IsNullOrEmpty(Request.QueryString.ToString()))
            {
                HttpCookie checkCookie = new HttpCookie("checkCookie");
                checkCookie.Value = "Y";  // Case sensitivity
                checkCookie.Expires = DateTime.Now.AddDays(365);
                Response.Cookies.Add(checkCookie);
                CreateSession();
            }
            else
            {
                CheckSession();
            }
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

        private void CreateSession()
        {
            try
            {
                string Qstring = Request.QueryString["q"].ToString();
                string QueryString = PasswordEncryptDecrypt.DecryptString(HttpUtility.UrlDecode(Qstring));
                string UserId = HttpUtility.ParseQueryString(QueryString).Get("userid").Trim();
                string token = HttpUtility.ParseQueryString(QueryString).Get("token").Trim();
                string username = HttpUtility.ParseQueryString(QueryString).Get("username").Trim();
                string password = HttpUtility.ParseQueryString(QueryString).Get("password").Trim();
                using (FieldOfficerEntities db = new FieldOfficerEntities())
                {
                    var data = db.getAdminDetails(token, Convert.ToInt32(UserId)).FirstOrDefault();
                    if (data != null)
                    {
                        string UserDetails = HttpUtility.UrlEncode(PasswordEncryptDecrypt.EncryptString(
                        "userid=" + data.Userid +
                        "&username=" + data.username +
                        "&password=" + data.password +
                        "&usertype=" + data.UserType +
                        "&isadmin=" + data.IsAdmin +
                        "&name=" + data.Name +
                        "&token=" + data.Token));
                        if (Request.Cookies["checkCookie"] == null)
                        {
                            Session["usersdata"] = UserDetails;
                            Session["name"] = data.Name;

                        }
                        else
                        {
                            HttpCookie UserD = new HttpCookie("usersdata");
                            UserD.Value = UserDetails;
                            UserD.Expires = DateTime.Now.AddDays(365);
                            Response.Cookies.Add(UserD);
                            Session["name"] = data.Name;
                        }
                    }
                    else
                    {
                        Response.Redirect(UtilityModule.getLoginPageUrl());
                    }
                }


            }
            catch (Exception ex)
            {
                new Exception(ex.Message);
                Response.Redirect(UtilityModule.getLoginPageUrl());
            }

        }

        [HttpPost]
        public ActionResult DashboardData(string startdate, string enddate, string foid, string tvisit, string owntype, string Status, int start, int length, string searchValue, int draw)
        {
            string result = "";
            List<Cl_datalistModel> DataList = new List<Cl_datalistModel>();
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    { 
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[AdminDasboardMaster]";
                        string Parameters = "@mode='AdminDasboardDatatesting',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate
                            + "',@fomid='" + foid + "',@totalvisit='" + tvisit + "',@owntype='" + owntype + "',@Status='" + Status + "',@start='"+ start + "',@length='"+ length + "',@searchValue='"+ searchValue + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        { 
                            DataList = (from rows in ds.Tables[0].AsEnumerable()
                                        select new Cl_datalistModel
                                        {
                                            FovmId = Convert.ToInt64(rows["FovmId"]),
                                            Name = Convert.ToString(rows["Name"]),
                                            Mobile = Convert.ToString(rows["Mobile"]),
                                            EmailId = Convert.ToString(rows["EmailId"]),
                                            Address = Convert.ToString(rows["Address"]),
                                            OwnType = Convert.ToString(rows["OwnType"]),
                                            VisitDate = Convert.ToString(rows["VisitDate"]),
                                            VisitTime = Convert.ToString(rows["VisitTime"]),
                                            StickeringStatus = Convert.ToString(rows["StickeringStatus"]),
                                            Company = Convert.ToString(rows["Company"]),
                                            ImageCounts = Convert.ToInt32(rows["ImageCounts"]),
                                            VehicleCount = Convert.ToInt32(rows["VehicleCount"]),
                                            createdbyname = Convert.ToString(rows["createdbyname"]),
                                            IsMobileVerified = Convert.ToString(rows["IsMobileVerified"]),
                                            Status = Convert.ToString(rows["Status"]),
                                            Remarks = Convert.ToString(rows["Remarks"]),
                                            downloadapp = Convert.ToString(rows["downloadapp"]),
                                        }).ToList();

                            var resultss = new
                            {
                                draw = draw,
                                recordsTotal = ds.Tables[1].Rows[0]["Counts"].ToString(),
                                recordsFiltered = ds.Tables[1].Rows[0]["Counts"].ToString(),
                                data = DataList
                            };

                            return Json(resultss);
                        }


                    }
                }

            }
            catch (Exception ex)
            {
                result = ex.Message;
                new ExceptionLogging(ex);
            }
            return Json(DataList);
        }


        [HttpPost]

        public ActionResult MethodGetcounts(string startdate, string enddate)
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
                        string Parameters = "@mode='GetTotalsCounts',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = LowercaseJsonSerializer.SerializeObject(ds);
                            return Json(result, JsonRequestBehavior.AllowGet);
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
        public ActionResult MethodGetDataforAdminbyuserid(string startdate, string enddate, List<Useridlist> Useridlist)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string XML = UtilityModule.getXmlFromList("Insertuseridlist", Useridlist);
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[AdminDasboardMaster]";
                        string Parameters = "@mode='getdatabyuserid',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate
                            + "',@xmluseridlist='" + XML + "'";
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
        public ActionResult MethodGetVehicleInfo(string fovmid)
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
                        string Parameters = "@mode='GetVehicleInfodata',@UserId='" + UserId + "',@fovmid='" + fovmid + "'";
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
        public ActionResult MethodGetPrefLocationData(string fovmid)
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
                        string Parameters = "@mode='GetPrefLocationInfodata',@UserId='" + UserId + "',@fovmid='" + fovmid + "'";
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
        public ActionResult MethodGetAllimages(string fovmid)
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
                        string Parameters = "@mode='GetAllImages',@UserId='" + UserId + "',@fovmid='" + fovmid + "'";
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
        public ActionResult MethodGetFieldofficers()
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
                        string Parameters = "@mode='GetFieldOfficerData',@UserId='" + UserId + "'";
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

        public ActionResult MethodUpdateDownloadedby(string userid, string fovmid, string remarks)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string updatedby = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[AdminDasboardMaster]";
                        string Parameters = "@mode='updatedownloadedby',@userid='" + userid 
                            + "',@fovmid='" + fovmid+ "',@createdby='" + updatedby
                            + "',@Remarks='"+ remarks + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = ds.Tables[0].Rows[0]["result"].ToString();
                            return Json(result, JsonRequestBehavior.AllowGet);
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
public class Useridlist
{
    public string userid { get; set; }
}