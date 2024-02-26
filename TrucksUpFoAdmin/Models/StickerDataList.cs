using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrucksUpFoAdmin.Models
{
    public class StickerDataList
    {
        public int id { get; set; }
        public string fullname { get; set; }
        public string drivernumber { get; set; }
        public string operatornumber { get; set; }
        public string stickerimage { get; set; }
        public string stickersize { get; set; }
        public string lanefrom { get; set; }
        public string laneto { get; set; }
        public string vehicletype { get; set; }
        public string vehiclesize { get; set; }
        public string vehiclecapacity { get; set; }
        public string vechilenumber { get; set; }
        public string verifiedstatus { get; set; }
        public string verifiedby { get; set; }
        public string activeflag { get; set; }
        public string createdby { get; set; }
        public string createddate { get; set; }
        public string modifiedby { get; set; }
        public string modifieddate { get; set; }
        public string doneby { get; set; }
        public string downloads { get; set; }
    }
}