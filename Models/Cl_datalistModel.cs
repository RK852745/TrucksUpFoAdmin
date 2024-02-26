using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrucksUpFoAdmin.Models
{
    public class Cl_datalistModel
    {
        public int Sno { get; set; }
        public long FovmId { get; set; }
        public string Name { get; set; }
        public string Mobile { get; set; }
        public string EmailId { get; set; }
        public string Address { get; set; }
        public string OwnType { get; set; }
        public string VisitDate { get; set; }
        public string VisitTime { get; set; }
        public string StickeringStatus { get; set; }
        public string Company { get; set; }
        public int ImageCounts { get; set; }
        public int VehicleCount { get; set; }
        public string createdbyname { get; set; }
        public string IsMobileVerified { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public string downloadapp { get; set; }
        public string entrydatetime { get; set; }
        public string approvedate { get; set; }
        
    }
    public class Cl_datalistModell
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string DriverNumber { get; set; }
        public string OperatorNumber { get; set; }
        public string Downloads { get; set; }
        public string StickerImage { get; set; }
        public string StickerSize { get; set; }
        public string LaneFrom { get; set; }
        public string LaneTo { get; set; }
        public string VehicleType { get; set; }
        public string VehicleSize { get; set; }
        public string VehicleCapacity { get; set; }
        public string VehicleNumber { get; set; }
        public string VerifiedStatus { get; set; }
        public string StickerDimension { get; set; }
        public string VerifiedBy { get; set; }
        public string ActiveFlag { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string DoneBy { get; set; }
        public string entrydatetime { get; set; }
    }

}