using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace TrucksUpFoAdmin
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");


            routes.MapRoute(
                name: "Login",
                url: "Login",
                defaults: new { controller = "Account", action = "Login" }
            );
            routes.MapRoute(
               name: "Addfieldofficer",
               url: "Registration",
               defaults: new { controller = "Registration", action = "Addfieldofficer" }
           );
            routes.MapRoute(
              name: "Reports",
              url: "Reports",
              defaults: new { controller = "Reports", action = "Reports" }
          );
            routes.MapRoute(
              name: "StickersReports",
              url: "StickersReports",
              defaults: new { controller = "Reports", action = "StickersVisitReports" }
          );
             routes.MapRoute(
              name: "StickersReportsDhaba",
              url: "StickersReportsDhaba",
              defaults: new { controller = "Dhaba", action = "StickersReportsDhaba" }
          );
          //  routes.MapRoute(
          //    name: "StickerVisit",
          //    url: "StickerVisitReports",
          //    defaults: new { controller = "Reports", action = "StickerReports" }
          //);
            routes.MapRoute(
              name: "Dashboard",
              url: "Dashboard/{id}",
              defaults: new { controller = "Admin", action = "Dashboard", id = UrlParameter.Optional }
          );
            routes.MapRoute(
              name: "Verification",
              url: "Verification",
              defaults: new { controller = "Verification", action = "Index", id = UrlParameter.Optional }
          );
            routes.MapRoute(
              name: "StickerVisitsData",
              url: "StickerVisitsData",
              defaults: new { controller = "Reports", action = "StickerReports", id = UrlParameter.Optional }
          );
            routes.MapRoute(
              name: "BulkVerification",
              url: "BulkVerification",
              defaults: new { controller = "Home", action = "jqGrid", id = UrlParameter.Optional }
          );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional }
            );
        }
    }
}
