using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using TrucksUpFoAdmin.DbContext;
using TrucksUpFoAdmin.Models;
using TrucksUpFoAdmin.Services;

namespace TrucksUpFoAdmin.Controllers
{
    public class AccountController : Controller
    {

        public ActionResult Login()
        { 
             
            return View();
        }
        public bool CheckConnection()
        {
            string conString = ConfigurationManager.ConnectionStrings["ConnStringFO"].ConnectionString;
            bool isValid = false;
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(conString);
                con.Open();
                isValid = true;
                Response.Write("Connection is open");
            }
            catch (SqlException ex)
            {
                isValid = false;
                Response.Write(ex.Message);

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                    Response.Write("Connection is closed");
                }
            }

            return isValid;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Cl_UserLogin _userloginrequest)
        {
            string response = "";
            try
            {
                string captcha = Session["captcha"].ToString();
                //if (captcha == captcha)
                //{ 
                        if (_userloginrequest.UserName.Length != 10)
                        {
                            response = "Please enter 10 digits Mobile Number";
                            ViewBag.Message = response;
                            return View();

                        }
                        else if (_userloginrequest.Password == "")
                        {
                            response = "Please enter your password";
                            ViewBag.Message = response;
                            return View();
                        }
                        string ProcedureName = "Pro_UserLogin";
                        string Parameters = @"@password='" + _userloginrequest.Password + "',@UserName='" + _userloginrequest.UserName + "',@Mode='CheckUserLogin'";
                        new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
                        if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {

                            foreach (DataRow DR in ds.Tables[0].Rows)
                            {
                                if (DR["IsAdmin"].ToString().ToUpper() == "Y")
                                {
                                    string urlPram = "username=" + DR["username"].ToString()
                                       + "&password=" + DR["password"].ToString()
                                       + "&userid=" + DR["Userid"].ToString()
                                       + "&token=" + DR["Token"].ToString();
                                    urlPram = HttpUtility.UrlEncode(PasswordEncryptDecrypt.EncryptString(urlPram));
                                    response = "Login Success";
                                    ViewBag.Message = response;
                                    return this.RedirectToAction("Dashboard", "Admin", new { q = urlPram });
                                }
                                else if (DR["IsAdmin"].ToString().ToUpper() == "V")
                                {
                                    string urlPram = "username=" + DR["username"].ToString()
                                       + "&password=" + DR["password"].ToString()
                                       + "&userid=" + DR["Userid"].ToString()
                                       + "&token=" + DR["Token"].ToString();
                                    urlPram = HttpUtility.UrlEncode(PasswordEncryptDecrypt.EncryptString(urlPram));
                                    response = "Login Success";
                                    ViewBag.Message = response;
                                    return this.RedirectToAction("Index", "Verification", new { q = urlPram });

                                }
                            }

                            
                        }
 
                    return View();
                //}
                //else
                //{
                //    //response = CheckConnection().ToString();
                //    //ViewBag.Message = response;
                //    return View();

                //}
            }
            catch
            {
                throw;
            }

        }

        [HttpPost]
        public JsonResult generateCaptchacode()
        {
            int _min = 1000;
            int _max = 9999;
            Random _rdm = new Random();
            int num = _rdm.Next(_min, _max);
            Session["captcha"] = num;
            return Json(num, JsonRequestBehavior.AllowGet);
        }

        public static bool CheckUserExistance(string password, string username)
        {
            try
            {
                using (FieldOfficerEntities db = new FieldOfficerEntities())
                {
                    var result = db.UserLogins.Where(x => x.Username == username && x.Password == password && x.Activeflag == true).FirstOrDefault();
                    if (result != null)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }


                }

            }
            catch
            {
                return false;
            }
        }

        public ActionResult ForegetPassword()
        {
            return View();
        }
    }
}