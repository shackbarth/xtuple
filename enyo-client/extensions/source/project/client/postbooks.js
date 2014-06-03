/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.project.initPostbooks = function () {
    var module, dashboardModule, panels, relevantPrivileges;

    // ..........................................................
    // APPLICATION
    //
    panels = [
      {name: "honorificList", kind: "XV.HonorificList"},
      {name: "itemList", kind: "XV.ItemList"},
      {name: "itemGroupList", kind: "XV.ItemGroupList"},
      {name: "classCodeList", kind: "XV.ClassCodeList"},
      {name: "unitList", kind: "XV.UnitList"},
      {name: "stateList", kind: "XV.StateList"},
      {name: "countryList", kind: "XV.CountryList"},
      {name: "projectEmailProfileList", kind: "XV.ProjectEmailProfileList"},
      {name: "projectTypeList", kind: "XV.ProjectTypeList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);

    dashboardModule = {
      name: "projectDashboard",
      hasSubmenu: false,
      label: "_dashboard".loc(),
      panels: [
        {name: "projectDashboard", kind: "XV.ProjectDashboard"}
      ]
    };
    // TODO: Refine dashboards. Refactor with Pentaho?
    //XT.app.$.postbooks.insertModule(dashboardModule, 0);

    module = {
      name: "project",
      label: "_project".loc(),
      panels: [
        {name: "projectList", kind: "XV.ProjectList"},
        {name: "project_activityList", kind: "XV.ActivityList"}
      ]
    };
    XT.app.$.postbooks.insertModule(module, 0);

    relevantPrivileges = [
      "MaintainAddresses",
      "MaintainAllContacts",
      "MaintainAllCRMAccounts",
      "MaintainAllIncidents",
      "MaintainAllProjects",
      "MaintainClassCodes",
      "MaintainPersonalContacts",
      "MaintainPersonalCRMAccounts",
      "MaintainPersonalIncidents",
      "MaintainPersonalProjects",
      "MaintainPersonalToDoItems",
      "MaintainProjectEmailProfiles",
      "MaintainProjectTypes",
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
      "MaintainItemGroups",
      "MaintainUOMs",
      "ViewClassCodes",
      "ViewItemMasters",
      "ConfigurePM",
      "EditOthersComments",
      "EditOwnComments",
      "MaintainCommentTypes",
      "MaintainCountries",
      "MaintainStates",
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

    XM.configurations.add(new XM.ConfigurationModel({
      model: "XM.projectManagement",
      name: "_project".loc(),
      description: "_projectManagement".loc(),
      workspace: "XV.ProjectManagementWorkspace"
    }));
  };
}());
