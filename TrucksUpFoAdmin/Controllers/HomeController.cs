using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TrucksUpFoAdmin.Services;
using TrucksUpFoAdmin.Models;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.Drawing.Printing;
using System.IO;
using OfficeOpenXml;
using Excel = Microsoft.Office.Interop.Excel;
using IronXL;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNetCore.Http;

namespace TrucksUpFoAdmin.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        public ActionResult jqGrid()
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

        public ActionResult GetProducts(string sidx, string sord, int page, int rows, string startdate, string enddate)
        {
            sord = "desc";
            List<StickerDataList> DataList = new List<StickerDataList>();
            string result = "";
            try
            {
                if (UtilityModule.getUserTokenCheck())
                {
                    if (UtilityModule.getParamFromUrl("isadmin").ToUpper() == "Y")
                    {
                        string UserId = UtilityModule.getParamFromUrl("userid");
                        string ProcedureName = "[dbo].[SP_StickerVisits]";
                        string Parameters = "@mode='GetVistsdatabydaterangetesting',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DataList = (from rowss in ds.Tables[0].AsEnumerable()
                                        select new StickerDataList
                                        {
                                            id = Convert.ToInt32(rowss["Id"]),
                                            fullname = Convert.ToString(rowss["FullName"]),
                                            drivernumber = Convert.ToString(rowss["DriverNumber"]),
                                            operatornumber = Convert.ToString(rowss["OperatorNumber"]),
                                            downloads = Convert.ToString(rowss["Downloads"]),
                                            stickerimage = Convert.ToString(rowss["StickerImage"]),
                                            stickersize = Convert.ToString(rowss["StickerSize"]),
                                            lanefrom = Convert.ToString(rowss["LaneFrom"]),
                                            laneto = Convert.ToString(rowss["LaneTo"]),
                                            vehicletype = Convert.ToString(rowss["VehicleType"]),
                                            vehiclesize = Convert.ToString(rowss["VehicleSize"]),
                                            vehiclecapacity = Convert.ToString(rowss["VehicleCapacity"]),
                                            vechilenumber = Convert.ToString(rowss["VechileNumber"]),
                                            verifiedstatus = Convert.ToString(rowss["VerifiedStatus"]),
                                            verifiedby = Convert.ToString(rowss["VerifiedBy"]),
                                            activeflag = Convert.ToString(rowss["ActiveFlag"]),
                                            createdby = Convert.ToString(rowss["CreatedBy"]),
                                            createddate = Convert.ToString(rowss["CreatedDate"]),
                                            modifiedby = Convert.ToString(rowss["ModifiedBy"]),
                                            modifieddate = Convert.ToString(rowss["ModifiedDate"]),
                                            doneby = Convert.ToString(rowss["DoneBy"]),
                                        }).ToList();

                            var products = DataList;
                            int pageIndex = Convert.ToInt32(page) - 1;
                            int pageSize = rows;
                            int totalRecords = products.Count();
                            int totalPages = (int)Math.Ceiling((float)totalRecords / (float)pageSize);

                            var data = products.OrderBy(x => x.createddate)
                                          .Skip(pageSize * (page - 1))
                                          .Take(pageSize).ToList();

                            var jsonData = new
                            {
                                total = totalPages,
                                page = page,
                                records = totalRecords,
                                rows = data
                            };

                            return Json(jsonData, JsonRequestBehavior.AllowGet);



                        }
                    }
                }

            }
            catch (Exception ex)
            {
                result = ex.Message;
                new ExceptionLogging(ex);
            }
            return Json("", JsonRequestBehavior.AllowGet);
        }

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


        public ActionResult CoonvertDataTableintoexcel(string startdate, string enddate)
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
                        string Parameters = "@mode='GetVistsdatabydaterange',@UserId='" + UserId
                            + "',@startdate='" + startdate + "',@enddate='" + enddate + "'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            DataTable dataTable = new DataTable();

                            // Assuming the dataset contains only one table
                            DataTable sourceTable = ds.Tables[0];

                            // Clone the structure of the source table
                            dataTable = sourceTable.Clone();

                            // Load data into the new DataTable using DataReader
                            using (var reader = ds.CreateDataReader())
                            {
                                dataTable.Load(reader);
                            }

                            using (ExcelPackage package = new ExcelPackage())
                            {
                                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Sheet1");
                                worksheet.Cells["A1"].LoadFromDataTable(dataTable, true);

                                // Generate a unique file name
                                string fileName = "ExcelFile_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xlsx";


                                var response = System.Web.HttpContext.Current.Response;
                                response.Clear();
                                response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                                response.AddHeader("content-disposition", "attachment; filename=" + fileName);

                                using (MemoryStream memoryStream = new MemoryStream())
                                {
                                    package.SaveAs(memoryStream);
                                    memoryStream.WriteTo(response.OutputStream); 
                                    response.Flush();
                                    response.End();
                                }
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
            return Json(result, JsonRequestBehavior.DenyGet);
        }

        private static void DownloadFile(byte[] data, string fileName)
        {
            // Set the response headers
            System.Web.HttpContext.Current.Response.Clear();
            System.Web.HttpContext.Current.Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", $"attachment; filename={fileName}");
            System.Web.HttpContext.Current.Response.AddHeader("Content-Length", data.Length.ToString());

            // Write the file content to the response stream
            System.Web.HttpContext.Current.Response.BinaryWrite(data);

            // End the response
            System.Web.HttpContext.Current.Response.End();
        }


        private void ExportDataSetToExcel(DataSet ds)
        {
            //Creae an Excel application instance
            Excel.Application excelApp = new Excel.Application();

            //Create an Excel workbook instance and open it from the predefined location
            Excel.Workbook excelWorkBook = excelApp.Workbooks.Open(@"D:\Orgs.xlsx");

            foreach (DataTable table in ds.Tables)
            {
                //Add a new worksheet to workbook with the Datatable name
                Excel.Worksheet excelWorkSheet = excelWorkBook.Sheets.Add();
                excelWorkSheet.Name = table.TableName;

                for (int i = 1; i < table.Columns.Count + 1; i++)
                {
                    excelWorkSheet.Cells[1, i] = table.Columns[i - 1].ColumnName;
                }

                for (int j = 0; j < table.Rows.Count; j++)
                {
                    for (int k = 0; k < table.Columns.Count; k++)
                    {
                        excelWorkSheet.Cells[j + 2, k + 1] = table.Rows[j].ItemArray[k].ToString();
                    }
                }
            }

            excelWorkBook.Save();
            excelWorkBook.Close();
            excelApp.Quit();

        }


        protected void DownloadExcelFile(DataSet dataset)
        {

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (ExcelPackage package = new ExcelPackage())
            {
                foreach (DataTable table in dataset.Tables)
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(table.TableName);
                    worksheet.Cells["A1"].LoadFromDataTable(table, true);
                }

                var response = System.Web.HttpContext.Current.Response;
                response.Clear();
                response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                response.AddHeader("content-disposition", "attachment;  filename=MyWorkbook.xlsx");

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    package.SaveAs(memoryStream);
                    memoryStream.WriteTo(response.OutputStream);
                    response.Flush();
                    response.End();
                }
            }
        }
    }
}