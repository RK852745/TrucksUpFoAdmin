using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TrucksUpFoAdmin.Models
{
    public class Cl_UserLogin
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Please enter user name.")]
        [StringLength(30)]
        public string UserName { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Please enter password.")]
        [StringLength(10)]
        public string Password { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Please enter captcha code.")]
        [StringLength(4)]
        public string Captchacode { get; set; }

    }
}