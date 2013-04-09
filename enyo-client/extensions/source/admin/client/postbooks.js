/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.admin.initPostbooks = function () {

    // ..........................................................
    // APPLICATION
    //
    var relevantPrivileges, module = {
      name: "admin",
      label: "_admin".loc(),
      panels: [
        {name: "userList", kind: "XV.UserList"},
        {name: "organizationList", kind: "XV.OrganizationList"},
        {name: "extensionList", kind: "XV.ExtensionList"},
        {name: "databaseServerList", kind: "XV.DatabaseServerList"},
        {name: "campaignList", kind: "XV.CampaignList"}
      ]
    };
    XT.app.$.postbooks.insertModule(module, 2);

    relevantPrivileges = [
      "AccessAdminExtension",
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);
  };

}());
