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
    
    public partial class SharedLinkAudit
    {
        public long Id { get; set; }
        public string SharedSMS { get; set; }
        public Nullable<long> SharedBy { get; set; }
        public Nullable<System.DateTime> SharedDateTime { get; set; }
        public string SharedTo { get; set; }
        public string SMSDelivered { get; set; }
        public Nullable<bool> ActiveFlag { get; set; }
        public Nullable<long> CreatedBy { get; set; }
        public Nullable<System.DateTime> createdDate { get; set; }
        public Nullable<long> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
    }
}