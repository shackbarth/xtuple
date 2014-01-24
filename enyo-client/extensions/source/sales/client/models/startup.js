/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initStartup = function () {
    XT.cacheCollection("XM.classCodes", "XM.ClassCodeCollection", "code");
    XT.cacheCollection("XM.costCategories", "XM.CostCategoryCollection", "code");
    XT.cacheCollection("XM.customerEmailProfiles", "XM.CustomerEmailProfileCollection");
    XT.cacheCollection("XM.customerTypes", "XM.CustomerTypeCollection");
    XT.cacheCollection("XM.freightClasses", "XM.FreightClassCollection", "code");
    XT.cacheCollection("XM.plannerCodes", "XM.PlannerCodeCollection", "code");
    XT.cacheCollection("XM.productCategories", "XM.ProductCategoryCollection");
    XT.cacheCollection("XM.salesEmailProfiles", "XM.SalesEmailProfileCollection");
    XT.cacheCollection("XM.salesReps", "XM.SalesRepCollection");
    XT.cacheCollection("XM.saleTypes", "XM.SaleTypeCollection", "code");
    XT.cacheCollection("XM.shipCharges", "XM.ShipChargeCollection");
    XT.cacheCollection("XM.shipVias", "XM.ShipViaCollection", "code");
    XT.cacheCollection("XM.shipZones", "XM.ShipZoneCollection");
    XT.cacheCollection("XM.siteTypes", "XM.SiteTypeCollection", "name");
    XT.cacheCollection("XM.terms", "XM.TermsCollection");
    XT.cacheCollection("XM.bankAccountRelations", "XM.BankAccountRelationCollection");
  };

}());
