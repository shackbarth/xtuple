/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.sales.initPostbooks = function () {
    var module, panels, relevantPrivileges;

    // ..........................................................
    // APPLICATION
    //
    /*
    panels = [
      {name: "honorificList", kind: "XV.HonorificList"},
      {name: "accountList", kind: "XV.AccountList"},
      {name: "contactList", kind: "XV.ContactList"},
      {name: "itemList", kind: "XV.ItemList"},
      {name: "classCodeList", kind: "XV.ClassCodeList"},
      {name: "unitList", kind: "XV.UnitList"},
      {name: "stateList", kind: "XV.StateList"},
      {name: "countryList", kind: "XV.CountryList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);
    */
    module = {
      name: "sales",
      label: "_sales".loc(),
      panels: [
        {name: "customerList", kind: "XV.CustomerList"},
        {name: "prospectList", kind: "XV.ProspectList"}
      ]
    };
    XT.app.$.postbooks.insertModule(module, 2);

    relevantPrivileges = [
      "AccessSalesExtension" /*,
      "MaintainAddresses",
      "MaintainAllContacts",
      "MaintainAllCRMAccounts",
      "MaintainAllIncidents",
      "MaintainAllProjects",
      "MaintainPersonalContacts",
      "MaintainPersonalCRMAccounts",
      "MaintainPersonalIncidents",
      "MaintainPersonalProjects",
      "MaintainPersonalToDoItems",
      "MaintainTitles",
      "ViewAllContacts",
      "ViewAllCRMAccounts",
      "ViewAllIncidentHistory",
      "ViewAllIncidents",
      "ViewAllProjects",
      "ViewPersonalContacts",
      "ViewPersonalCRMAccounts",
      "ViewPersonalIncidents",
      "ViewPersonalProjects",
      "ViewTitles",
      "DeleteItemMasters",
      "MaintainItemMasters",
      "MaintainUOMs",
      "ViewClassCodes",
      "ViewItemMasters",
      "ViewUOMs",
      "ConfigurePM",
      "EditOthersComments",
      "EditOwnComments",
      "MaintainCommentTypes",
      "MaintainCountries",
      "MaintainStates",
      "MaintainUsers" */
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);
  };
}());
