using Microsoft.Office.Interop.Excel;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrucksUpFoAdmin.DbContext;
using TrucksUpFoAdmin.Models;
using TrucksUpFoAdmin.Services;
using OfficeOpenXml;
using System.IO;
using OfficeOpenXml.Style;
using System.Configuration;




namespace TrucksUpFoAdmin.Controllers
{
    public class VerificationController : Controller
    {
        // GET: Verification
        public ActionResult Index()
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
        public ActionResult MethodGetDataforverification(string startdate, string enddate, string doneby, string status, int start, int length, string searchValue, int draw)
        {
            string result = "";
            List<DataResult> DataList = new List<DataResult>();
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "V")
                    {
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[SP_VerificationData]";
                        string Parameters = "@startdate='" + startdate + "',@enddate='" + enddate
                            + "',@status='" + status + "',@doneby='" + doneby + "',@Start='" + start + "',@Length='" + length + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DataList = (from rows in ds.Tables[0].AsEnumerable()
                                        select new DataResult
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
                                            stickerdimension = Convert.ToString(rows["StickerDimension"]),
                                            verifiedby = Convert.ToString(rows["VerifiedBy"]),
                                            activeflag = Convert.ToString(rows["ActiveFlag"]), 
                                            createdby = Convert.ToString(rows["CreatedBy"]),
                                            createddate = Convert.ToString(rows["CreatedDate"]),
                                            modifiedby = Convert.ToString(rows["ModifiedBy"]),
                                            modifieddate = Convert.ToString(rows["ModifiedDate"]),
                                            doneby = Convert.ToString(rows["DoneBy"]),
                                            
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
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]

        public DataSet GetVerificationData(string startdate, string enddate, string doneby, string status, int start, int length)
        {
            string ProcedureName = "[dbo].[SP_VerificationData]";
            string Parameters = "@startdate='" + startdate + "',@enddate='" + enddate + "',@status='" + status + "',@doneby='" + doneby + "',@Start='" + start + "',@Length='" + length + "'";
            cl_DataSetClass datasetClass = new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);

            return ds;
        }

        public byte[] CreateExcelFromDataset(DataSet dataset)
        {
            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Verification Data");

            DataTable dataTable = dataset.Tables[0]; // Assuming the data is in the first table

            // Add headers
            for (int col = 0; col < dataTable.Columns.Count; col++)
            {
                worksheet.Cell(1, col + 1).Value = dataTable.Columns[col].ColumnName;
            }

            // Add data rows
            for (int row = 0; row < dataTable.Rows.Count; row++)
            {
                for (int col = 0; col < dataTable.Columns.Count; col++)
                {
                    worksheet.Cell(row + 2, col + 1).Value = dataTable.Rows[row][col];
                }
            }

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
        }




        [HttpPost]
        public ActionResult MethodGetFieldofficers()
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "V")
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
        public ActionResult Methodupdatestatus(string id, string status, string comments)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "V")
                    {
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[SP_StickerVisits]";
                        string Parameters = "@mode='updatestatusbyid2',@UserId='" + UserId
                            + "',@id='" + id + "',@VerifiedStatus='" + status + "',@VerificationComment='" + comments + "'";
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

        public ActionResult MethodUpdateverificationData(string modifiedby,string fullname,string drivernumber,string status,
         string operatornumber,string size,string vechilenumber, string id)
        {
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "V")
                    { 

                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string VerifiedBy = UserId;
                        if (modifiedby == "0")
                        {
                            VerifiedBy = "";
                        }
                        else if (modifiedby == "2")
                        {
                            VerifiedBy = "";
                        }
                         
                        string ProcedureName = "[dbo].[SP_StickerVisits]";
                        string Parameters = "@mode='updateverificationdata',@UserId='" + UserId
                            + "',@id='" + id + "',@Fullname='" + fullname + "',@DriverNumber='" + drivernumber 
                            + "',@OperatorNumber='"+ operatornumber + "',@StickerSize='"+ size + "',@VechileNumber='"+ vechilenumber 
                            + "',@VerifiedStatus='"+ status + "',@VerifiedBy='"+ VerifiedBy + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            result = ds.Tables[0].Rows[0]["result"].ToString();
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

public class DataResult
{
    public int id { get; set; }
    public  string fullname{ get; set; }
    public string drivernumber{ get; set; }
    public string operatornumber { get; set; }
    public string downloads { get; set; }
    public string stickerimage { get; set; }
    public string stickersize { get; set; }
    public string lanefrom { get; set; }
    public string laneto { get; set; }
    public string vehicletype { get; set; }
    public string vehiclesize { get; set; }
    public string vehiclecapacity { get; set; }
    public string vechilenumber { get; set; }
    public string verifiedstatus { get; set; }
    public string stickerdimension { get; set; }
    public string verifiedby { get; set; }
    public string activeflag { get; set; }
    public string createdby { get; set; }
    public string createddate { get; set; }
    public string modifiedby { get; set; }
    public string modifieddate { get; set; }
    public string doneby { get; set; }
}