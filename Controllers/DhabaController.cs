using DocumentFormat.OpenXml.Wordprocessing;
using OfficeOpenXml;
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
    public class DhabaController : Controller
    {
        // GET: Dhaba        
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

        public ActionResult StickersReportsDhaba()
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
                        string ProcedureName = "[dbo].[SP_StickerMasterDhaba]";
                        string Parameters = "@mode='GetCountOftheday',@startdate='" + startdate + "',@enddate='" + enddate + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = ds.Tables[0].Rows[0]["CountOfTheDay"].ToString();
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
        public ActionResult GetDhabaDetails(string startDate, string endDate)
        {       

      

            List<StickerDhabaList> DhabaDetailsList = new List<StickerDhabaList>();
            string result = "";

            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string ProcedureName = "[dbo].[SP_StickerMasterDhaba]";
                        string Parameters = "@mode='Getdatabydatetraneg',@StartDate='" + startDate + "', @EndDate='" + endDate + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);

                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DhabaDetailsList = (from rows in ds.Tables[0].AsEnumerable()
                                                select new StickerDhabaList
                                                {
                                                    //DhabaID = Convert.ToInt32(rows["DhabaID"]),
                                                    DhabaName = Convert.ToString(rows["DhabaName"]),
                                                    DhabaOwnerNumber = Convert.ToString(rows["DhabaOwnerNumber"]),
                                                    Address = Convert.ToString(rows["Address"]),
                                                    OwnerName = Convert.ToString(rows["OwnerName"]),
                                                    StickerImage = Convert.ToString(rows["StickerImage"]),
                                                   // ActiveFlag = Convert.ToInt32(rows["ActiveFlag"]),
                                                    //CreatedBy = Convert.ToInt64(rows["CreatedBy"]),
                                                    //CreatedDate = Convert.ToDateTime(rows["CreatedDate"]),
                                                    //ModifiedBy = Convert.ToInt64(rows["ModifiedBy"]),
                                                   // ModifiedDate = Convert.ToDateTime(rows["ModifiedDate"]),
                                                    Latitude = Convert.ToDecimal(rows["Latitude"]),
                                                    Longitude = Convert.ToDecimal(rows["Longitude"]),
                                                }).ToList();

                            return Json(DhabaDetailsList);
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
        public ActionResult GetDhabaDetailsAndExportToExcel(string startDate, string endDate)
        {
            List<StickerDhabaList> DhabaDetailsList = new List<StickerDhabaList>();
            string result = "";

            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string ProcedureName = "[dbo].[SP_StickerMasterDhaba]";
                        string Parameters = "@mode='Getdatabydatetraneg',@StartDate='" + startDate + "', @EndDate='" + endDate + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);

                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DhabaDetailsList = (from rows in ds.Tables[0].AsEnumerable()
                                                select new StickerDhabaList
                                                {
                                                    //DhabaID = Convert.ToInt32(rows["DhabaID"]),
                                                    DhabaName = Convert.ToString(rows["DhabaName"]),
                                                    DhabaOwnerNumber = Convert.ToString(rows["DhabaOwnerNumber"]),
                                                    Address = Convert.ToString(rows["Address"]),
                                                    OwnerName = Convert.ToString(rows["OwnerName"]),
                                                    StickerImage = Convert.ToString(rows["StickerImage"]),
                                                    // ActiveFlag = Convert.ToInt32(rows["ActiveFlag"]),
                                                    //CreatedBy = Convert.ToInt64(rows["CreatedBy"]),
                                                    //CreatedDate = Convert.ToDateTime(rows["CreatedDate"]),
                                                    //ModifiedBy = Convert.ToInt64(rows["ModifiedBy"]),
                                                    // ModifiedDate = Convert.ToDateTime(rows["ModifiedDate"]),
                                                    Latitude = Convert.ToDecimal(rows["Latitude"]),
                                                    Longitude = Convert.ToDecimal(rows["Longitude"]),
                                                }).ToList();

                            // Create an Excel package using EPPlus or another library
                            using (var excelPackage = new ExcelPackage())
                            {
                                var ws = excelPackage.Workbook.Worksheets.Add("Sheet1");

                                // Set the date range text value as header
                                ws.Cells["A1"].Value = "Date Range: " + startDate + " - " + endDate;

                                // Set headers for data columns
                                ws.Cells["A2"].LoadFromText("DhabaName,DhabaOwnerNumber,Address,OwnerName,StickerImage,Latitude,Longitude");

                                // Load data starting from the second row
                                ws.Cells["A3"].LoadFromCollection(DhabaDetailsList, false);

                                // Generate a unique filename
                                var fileName = "visits_data_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xlsx";
                                var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

                                // Convert the ExcelPackage to a byte array
                                var byteArray = excelPackage.GetAsByteArray();

                                // Return the generated Excel file as a FileResult
                                return File(byteArray, contentType, fileName);
                            }
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