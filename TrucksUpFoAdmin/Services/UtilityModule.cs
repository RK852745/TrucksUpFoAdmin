using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Imaging;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using TrucksUpFoAdmin.Models;
using FastMember;
using TrucksUpFoAdmin.DbContext;

namespace TrucksUpFoAdmin.Services
{
    public class UtilityModule
    {
        public static string getLoginPageUrl()
        {
            string url = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
            if (HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority).ToLower().Contains("localhost"))
            {
                url = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) + HttpContext.Current.Request.ApplicationPath + "Login";
            }
            return url;
        }

        public static bool CheckExcelFileMimeType(string MimeType)
        {
            bool result = false;
            switch (MimeType)
            {
                case "2253204e":
                case "504b34":
                case "d0cf11e0":
                case "53724e6f":
                case "5372204e":
                case "4d6f6269":
                    result = true;
                    break;
                default:
                    break;
            }
            return result;
        }

        public static string getExcelMimeName(string MimeType)
        {
            string FileType = "";
            switch (MimeType)
            {
                case "5372204e":
                case "2253204e":
                case "53724e6f":
                case "4d6f6269":
                    FileType = "csv";
                    break;
                case "504b34":
                    FileType = "xlsx";
                    break;
                case "d0cf11e0":
                    FileType = "xls";
                    break;

                default:
                    break;
            }
            return FileType;
        }
        public static string getXmlFromList<T>(string XmlName, IEnumerable<T> list)
        {
            string xml = "";
            try
            {
                DataTable dt = new DataTable(XmlName);
                using (var reader = ObjectReader.Create(list))
                {
                    dt.Load(reader);
                }
                //ToDataTable(dt, list);
                using (StringWriter str = new StringWriter())
                {
                    dt.WriteXml(str);
                    xml = str.ToString();
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return xml;
        }

        public static DataTable ConvertCSVtoDataTable(string strFilePath)
        {
            DataTable dt = new DataTable();
            using (StreamReader sr = new StreamReader(strFilePath))
            {
                string[] headers = sr.ReadLine().Split(',');
                foreach (string header in headers)
                {
                    dt.Columns.Add(header);
                }
                while (!sr.EndOfStream)
                {
                    string[] rows = sr.ReadLine().Split(',');
                    DataRow dr = dt.NewRow();
                    for (int i = 0; i < headers.Length; i++)
                    {
                        dr[i] = rows[i];
                    }
                    dt.Rows.Add(dr);
                }

            }
            return dt;
        }

        public static void SaveByteArrayAsImage(string fullOutputPath, string base64String, string fileType)
        {
            try
            {
                byte[] bytes = Convert.FromBase64String(base64String);
                Image image;
                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    image = Image.FromStream(ms);
                }
                if (fileType == "png")
                {
                    image.Save(fullOutputPath, System.Drawing.Imaging.ImageFormat.Png);
                }
                else if (fileType == "jpeg")
                {
                    image.Save(fullOutputPath, System.Drawing.Imaging.ImageFormat.Jpeg);
                }
                else if (fileType == "gif")
                {
                    image.Save(fullOutputPath, System.Drawing.Imaging.ImageFormat.Gif);
                }
                image.Dispose();
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
        }

        public static void VaryQualityLevel(string TempFilePath, string PerFilePath)
        {
            try
            {
                Bitmap bmp = new Bitmap(TempFilePath);
                ImageCodecInfo jgpEncoder = GetEncoder(ImageFormat.Jpeg);
                System.Drawing.Imaging.Encoder myEncoder = System.Drawing.Imaging.Encoder.Quality;
                EncoderParameters myEncoderParameters = new EncoderParameters(1);
                EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, 50L);
                myEncoderParameters.Param[0] = myEncoderParameter;
                bmp.Save(PerFilePath, jgpEncoder, myEncoderParameters);
                bmp.Dispose();
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
        }
        public static ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();

            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }

        public static string getAllMimeName(string MimeType)
        {
            string FileType = "";
            switch (MimeType)
            {
                case "89504e47":
                    FileType = "png";
                    break;
                case "47494638":
                    FileType = "gif";
                    break;
                case "ffd8ffe0":
                    FileType = "jpeg";
                    break;
                case "3026b275":
                    FileType = "mp4";
                    break;
                case "25504446":
                    FileType = "pdf";
                    break;
                case "00018":
                    FileType = "mp4";
                    break;
                case "1a45dfa3":
                    FileType = "mp4";
                    break;
                case "4f676753":
                    FileType = "mp4";
                    break;
                case "464c561":
                    FileType = "mp4";
                    break;
                case "38425053":
                    FileType = "psd";
                    break;
                case "504b34":
                    FileType = "xlsx";
                    break;
                default:
                    break;
            }
            return FileType;
        }

        public static string getFileRandomName()
        {
            Random random = new Random();
            int ran = random.Next(100, 999);
            string x = DateTime.Now.ToString("yyyyMMddhhmmtt-", CultureInfo.InvariantCulture);
            return x + ran;
        }

        public static bool CheckAllFileMimeType(string MimeType)
        {
            bool result = false;
            switch (MimeType)
            {
                case "89504e47":
                case "47494638":
                case "ffd8ffe0":
                case "3026b275":
                case "25504446":
                case "00018":
                case "1a45dfa3":
                case "4f676753":
                case "464c561":
                case "38425053":
                case "504b34":
                    result = true;
                    break;
                default:
                    break;
            }
            return result;
        }

        public static string getSitePageUrl()
        {
            string url = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
            if (HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority).ToLower().Contains("localhost"))
            {
                url = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) + HttpContext.Current.Request.ApplicationPath + "Login";
            }
            return url;
        }
        public static string getCurrentPageUrl()
        {
            return HttpContext.Current.Request.Url.AbsoluteUri;
        }
        public static bool AdminSessionCheck()
        {
            bool exists = false;
            if (HttpContext.Current.Session["usersdata"] != null || HttpContext.Current.Request.Cookies["usersdata"] != null)
            {
                exists = true;
            }
            return exists;
        }
        public static string getAdminSession(string Param)
        {
            string ParamResult = "";
            string QueryString = "";
            try
            {
                if (HttpContext.Current.Session["usersdata"] != null)
                {
                    QueryString = HttpContext.Current.Session["usersdata"].ToString();
                }
                else if (HttpContext.Current.Request.Cookies["usersdata"] != null)
                {
                    QueryString = HttpContext.Current.Request.Cookies["usersdata"].Value.ToString();
                }
                if (QueryString != "")
                {
                    string Qstring = PasswordEncryptDecrypt.DecryptString(HttpUtility.UrlDecode(QueryString));
                    ParamResult = HttpUtility.ParseQueryString(Qstring).Get(Param).Trim();
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return ParamResult;
        }

        public static string SaveNotification(string Name, string Mobile, string Email, string isWhatsApp,
            string isSMS, string isEmail, string Message, string ImageUrl, string UserId)
        {
            string Result = "";
            try
            {
                string ProcedureName = "Pro_Messaging";
                string Parameters = @"@UserId='" + UserId + "',@Name='" + Name + "',@Mobile='" + Mobile
                    + "',@Email='" + Email + "',@isWhatsApp='" + isWhatsApp + "',@isSMS='" + isSMS
                    + "',@isEmail='" + isEmail + "',@Message='" + Message + "',@ImageUrl='" + ImageUrl
                    + "',@Mode='InsertNotification'";
                new cl_DataSetClass(out DataSet ds, ProcedureName, Parameters);
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return Result;
        }

        public static bool getUserTokenCheck()
        {
            bool resullt = false;
            try
            {
                string QueryString = "";
                if (HttpContext.Current.Session["usersdata"] != null)
                {
                    QueryString = HttpContext.Current.Session["usersdata"].ToString();
                }
                else if (HttpContext.Current.Request.Cookies["usersdata"] != null)
                {
                    QueryString = HttpContext.Current.Request.Cookies["usersdata"].Value.ToString();
                }
                if (QueryString == "")
                {
                    return resullt;
                }
                else
                {
                    string Qstring = PasswordEncryptDecrypt.DecryptString(HttpUtility.UrlDecode(QueryString));
                    if (Qstring != "")
                    {
                        string UserName = HttpUtility.ParseQueryString(Qstring).Get("username").Trim();
                        string Password = HttpUtility.ParseQueryString(Qstring).Get("password").Trim();
                        string Token = HttpUtility.ParseQueryString(Qstring).Get("token").Trim();
                        resullt = checkUserAuth(UserName, Password, Token);
                        return resullt;
                    }
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return resullt;
        }

        public static string getParamFromUrl(string Param)
        {
            string ParamResult = "";
            string QueryString = "";
            if (HttpContext.Current.Session["usersdata"] != null)
            {
                QueryString = HttpContext.Current.Session["usersdata"].ToString();
            }
            else if (HttpContext.Current.Request.Cookies["usersdata"] != null)
            {
                QueryString = HttpContext.Current.Request.Cookies["usersdata"].Value.ToString();
            }
            if (QueryString != "")
            {
                string Qstring = PasswordEncryptDecrypt.DecryptString(HttpUtility.UrlDecode(QueryString));
                if (Qstring == "")
                {
                    return ParamResult;
                }
                ParamResult = HttpUtility.ParseQueryString(Qstring).Get(Param).Trim();
            }
            return ParamResult;
        }


        public static bool checkUserAuth(string UserName, string Password, string Token)
        {
            bool result = false;
            try
            {
                cl_login_user cl = new cl_login_user();
                DataSet ds = new DataSet();
                cl.username = UserName;
                cl.password = Password;
                cl.Token = Token;
                cl.Mode = "VerifyToken";
                ds = cl.verifyToken();
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    result = true;
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return result;
        }



        public static string OtpGenerate()
        {
            string otp = "";

            int min = 1000;
            int max = 9999;
            Random rdm = new Random();
            otp = Convert.ToString(rdm.Next(min, max));

            HttpContext.Current.Session["OTP"] = null;
            HttpContext.Current.Session["OTP"] = otp;

            return otp;
        }

    }
}