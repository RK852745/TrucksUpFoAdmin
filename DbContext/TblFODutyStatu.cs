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
    
    public partial class TblFODutyStatu
    {
        public int DID { get; set; }
        public Nullable<int> FOID { get; set; }
        public Nullable<bool> Status { get; set; }
        public string OffDutyDate { get; set; }
        public string OffDutyTime { get; set; }
        public Nullable<bool> Active { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
