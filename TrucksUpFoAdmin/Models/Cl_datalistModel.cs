﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TrucksUpFoAdmin.Models
{
    public class Cl_datalistModel
    {
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
    }
}