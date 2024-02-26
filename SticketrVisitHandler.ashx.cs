using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using TrucksUpFoAdmin.Services;
using TrucksUpFoAdmin.Models;
namespace TrucksUpFoAdmin
{
    /// <summary>
    /// Summary description for SticketrVisitHandler
    /// </summary>
    public class SticketrVisitHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            //string startdate = context.Request.Form["startdateLS"]; ;
            //string enddate = context.Request.Form["enddateLS"]; ;
            //string UserId = UtilityModule.getParamFromUrl("userid");

            int displaylength = int.Parse(context.Request["iDisplayLength"]);
            int DisplayStart = int.Parse(context.Request["iDisplayStart"]);
            int SortCol = int.Parse(context.Request["iSortCol_0"]);
            string SortDir = context.Request["sSortDir_0"];
            string Search = context.Request["sSearch"];
            int TotalCount = 0;

            List<StickerDataList> StickerDataList_list = new List<StickerDataList>();
            string cs = ConfigurationManager.ConnectionStrings["ConnStringFO"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("spGetStickerDataListhandler", con);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlParameter paramDisplaylength = new SqlParameter()
                {
                    ParameterName = "@DisplayLength",
                    Value = displaylength
                };
                cmd.Parameters.Add(paramDisplaylength);

                SqlParameter paramDisplayStart = new SqlParameter()
                {
                    ParameterName = "@DisplayStart",
                    Value = DisplayStart
                };
                cmd.Parameters.Add(paramDisplayStart);

                SqlParameter paramSortCol = new SqlParameter()
                {
                    ParameterName = "@SortCol",
                    Value = SortCol
                };
                cmd.Parameters.Add(paramSortCol);

                SqlParameter paramSortDir = new SqlParameter()
                {
                    ParameterName = "@SortDir",
                    Value = SortDir
                };
                cmd.Parameters.Add(paramSortDir);

                SqlParameter paramSearch = new SqlParameter()
                {
                    ParameterName = "@Search",
                    Value = string.IsNullOrEmpty(Search) ? null : Search
                };
                cmd.Parameters.Add(paramSearch);

                SqlParameter paramstartdate = new SqlParameter()
                {
                    ParameterName = "@startdate",
                    Value = ""
                };
                cmd.Parameters.Add(paramstartdate);

                SqlParameter paramEnddate = new SqlParameter()
                {
                    ParameterName = "@enddate",
                    Value = ""
                };
                cmd.Parameters.Add(paramEnddate);
                con.Open();
                SqlDataReader rows = cmd.ExecuteReader();
                while (rows.Read())
                {
                    StickerDataList Sd = new StickerDataList();
                    Sd.id = Convert.ToInt32(rows["Id"]);
                    Sd.fullname = Convert.ToString(rows["FullName"]);
                    Sd.drivernumber = Convert.ToString(rows["DriverNumber"]);
                    Sd.operatornumber = Convert.ToString(rows["OperatorNumber"]);
                    Sd.downloads = Convert.ToString(rows["Downloads"]);
                    Sd.stickerimage = Convert.ToString(rows["StickerImage"]);
                    Sd.stickersize = Convert.ToString(rows["StickerSize"]);
                    Sd.lanefrom = Convert.ToString(rows["LaneFrom"]);
                    Sd.laneto = Convert.ToString(rows["LaneTo"]);
                    Sd.vehicletype = Convert.ToString(rows["VehicleType"]);
                    Sd.vehiclesize = Convert.ToString(rows["VehicleSize"]);
                    Sd.vehiclecapacity = Convert.ToString(rows["VehicleCapacity"]);
                    Sd.vechilenumber = Convert.ToString(rows["VechileNumber"]);
                    Sd.verifiedstatus = Convert.ToString(rows["VerifiedStatus"]);
                    Sd.verifiedby = Convert.ToString(rows["VerifiedBy"]);
                    Sd.activeflag = Convert.ToString(rows["ActiveFlag"]);
                    Sd.createdby = Convert.ToString(rows["CreatedBy"]);
                    Sd.createddate = Convert.ToString(rows["CreatedDate"]);
                    Sd.modifiedby = Convert.ToString(rows["ModifiedBy"]);
                    Sd.modifieddate = Convert.ToString(rows["ModifiedDate"]);
                    Sd.doneby = Convert.ToString(rows["DoneBy"]);
                    StickerDataList_list.Add(Sd);
                }
            }
            var result = new
            {
                iTotalRecords = Gettotalcount(),
                iTotalDisplayRecords = TotalCount,
                aaData = StickerDataList_list
            };
            JavaScriptSerializer js = new JavaScriptSerializer();
            context.Response.Write(js.Serialize(result));
        }

        private int Gettotalcount()
        {
            string startdate = "";
            string enddate = "";
            string cs = ConfigurationManager.ConnectionStrings["ConnStringFO"].ConnectionString;
            int totalountbmus = 0;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("select COUNT(*) Counts from StickerVisitMaster where  ActiveFlag=1 and FORMAT(CreatedDate,'yyyy/MM/dd')between " + startdate + " and " + enddate + "", con);
                con.Open();
                totalountbmus = (int)cmd.ExecuteScalar();
            }

            return totalountbmus;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}