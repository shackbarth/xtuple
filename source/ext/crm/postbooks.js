/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.crm.initPostbooks = function () {
    var panels,
      module;

    // ..........................................................
    // APPLICATION
    //

    panels = [
      {name: "itemList", kind: "XV.ItemList"},
      {name: "currencyList", kind: "XV.CurrencyList"},
      {name: "stateList", kind: "XV.StateList"},
      {name: "countryList", kind: "XV.CountryList"},
      {name: "priorityList", kind: "XV.PriorityList"},
      {name: "honorificList", kind: "XV.HonorificList"},
      {name: "incidentCategoryList", kind: "XV.IncidentCategoryList"},
      {name: "incidentResoulutionList", kind: "XV.IncidentResolutionList"},
      {name: "incidentSeverityList", kind: "XV.IncidentSeverityList"},
      {name: "opportunitySourceList", kind: "XV.OpportunitySourceList"},
      {name: "opportunityStageList", kind: "XV.OpportunityStageList"},
      {name: "opportunityTypeList", kind: "XV.OpportunityTypeList"},
      {name: "classCodeList", kind: "XV.ClassCodeList"},
      {name: "unitList", kind: "XV.UnitList"},
      {name: "productCategoryList", kind: "XV.ProductCategoryList"},
      {name: "imageList", kind: "XV.ImageList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);

    module = {
      name: "crm",
      label: "_crm".loc(),
      panels: [
        {name: "accountList", kind: "XV.AccountList"},
        {name: "contactList", kind: "XV.ContactList"},
        {name: "toDoList", kind: "XV.ToDoList"},
        {name: "opportunityList", kind: "XV.OpportunityList"},
        {name: "incidentList", kind: "XV.IncidentList"}
      ],
      privileges: [
        "MergeContacts",
        "MaintainPartners"
      ]
    };

    XT.app.$.postbooks.insertModule(module, 1);
  };

}());
