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
    
    public partial class UserLogin
    {
        public long Userid { get; set; }
        public Nullable<long> ExecutiveId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string LoginPin { get; set; }
        public Nullable<int> UserType { get; set; }
        public string Source { get; set; }
        public string DeviceId { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string DeviceType { get; set; }
        public Nullable<bool> Activeflag { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<long> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string IsAdmin { get; set; }
        public string Name { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string IsSuperAdmin { get; set; }
    }
}