/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initStartup = function () {
    XT.cacheCollection("XM.costCategories", "XM.CostCategoryCollection", "code");
    XT.cacheCollection("XM.plannerCodes", "XM.PlannerCodeCollection", "code");
    XT.cacheCollection("XM.saleTypes", "XM.SaleTypeCollection", "code");
    XT.cacheCollection("XM.siteTypes", "XM.SiteTypeCollection", "name");
  };

}());
