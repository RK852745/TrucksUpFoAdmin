using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrucksUpFoAdmin.Services;

namespace TrucksUpFoAdmin.Controllers
{
    public class RegistrationController : Controller
    {
        // GET: Registration
        public ActionResult Addfieldofficer()
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
        public ActionResult MethodAddNewFieldOfficer(string name, string mobile, string altmob, string email, string address, string empid, string usertype)
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
                        string Parameters = "@mode='createfieldofficer',@UserId='" + UserId
                            + "',@Name='" + name + "',@Mobile='" + mobile + "',@AltMobile='" + altmob
                            + "',@Email='" + email + "',@FullAddress='" + address + "',@EmployeeID='" + empid + "',@CreatedBy='" + UserId + "',@EmployeeType='" + usertype + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        result = "Y";

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
        public ActionResult MethodgetFieldOfficerdata()
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
                        string Parameters = "@mode='FetchFieldOfficerdata',@UserId='" + UserId + "'";
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
        public ActionResult MethodUpdateOfficerdata(string employeeid, string fullname, string mobile,
        string altmobile, string emailid, string address, string username, string password, string updateid)
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
                        string Parameters = "@mode='UpdateFieldOfficerdata',@UserId='" + UserId
                            + "',@Name='" + fullname + "',@Mobile='" + mobile + "',@AltMobile='" + altmobile
                            + "',@Email='" + emailid + "',@FullAddress='" + address + "',@EmployeeID='" + employeeid
                            + "',@CreatedBy='" + UserId + "',@EcecutiveId='" + updateid + "',@username='" + username
                            + "',@password='" + password + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        result = "Y";
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

        public ActionResult MethodDeleteOfficerdata(string deleteid)
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
                        string Parameters = "@mode='DeleteFieldOfficerdata',@UserId='" + UserId + "',@EcecutiveId='" + deleteid + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        result = "Y";
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

    }
}