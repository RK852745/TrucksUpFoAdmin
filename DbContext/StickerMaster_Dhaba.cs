//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TrucksUpFoAdmin.DbContext
{
    using System;
    using System.Collections.Generic;
    
    public partial class StickerMaster_Dhaba
    {
        public int DhabaID { get; set; }
        public string DhabaName { get; set; }
        public string DhabaOwnerNumber { get; set; }
        public string Address { get; set; }
        public string OwnerName { get; set; }
        public string StickerImage { get; set; }
        public Nullable<int> ActiveFlag { get; set; }
        public Nullable<long> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<long> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<decimal> Latitude { get; set; }
        public Nullable<decimal> Longitude { get; set; }
    }
}