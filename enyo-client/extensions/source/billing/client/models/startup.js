(function () {
  "use strict";

  XT.extensions.billing.initStartup = function () {
    XT.cacheCollection("XM.bankAccountRelations", "XM.BankAccountRelationCollection");
    XT.cacheCollection("XM.customerEmailProfiles", "XM.CustomerEmailProfileCollection");
    XT.cacheCollection("XM.incidentCategories", "XM.IncidentCategoryCollection");
  };

}());
