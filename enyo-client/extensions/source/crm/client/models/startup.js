/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initStartup = function () {
    XT.cacheCollection("XM.incidentCategories", "XM.IncidentCategoryCollection");
    XT.cacheCollection("XM.incidentEmailProfiles", "XM.IncidentEmailProfileCollection");
    XT.cacheCollection("XM.incidentResolutions", "XM.IncidentResolutionCollection");
    XT.cacheCollection("XM.incidentSeverities", "XM.IncidentSeverityCollection");
    XT.cacheCollection("XM.opportunitySources", "XM.OpportunitySourceCollection");
    XT.cacheCollection("XM.opportunityStages", "XM.OpportunityStageCollection");
    XT.cacheCollection("XM.opportunityTypes", "XM.OpportunityTypeCollection");
    XT.cacheCollection("XM.classCodes", "XM.ClassCodeCollection", "code");
    XT.cacheCollection("XM.freightClasses", "XM.FreightClassCollection", "code");
    XT.cacheCollection("XM.productCategories", "XM.ProductCategoryCollection");
  };

}());
