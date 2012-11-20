/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.admin.initPostbooks = function () {

    // ..........................................................
    // APPLICATION
    //
    var panels = [
      {name: "userList", kind: "XV.UserList"},
      {name: "databaseServerList", kind: "XV.DatabaseServerList"},
      {name: "organizationList", kind: "XV.OrganizationList"}
    ];

    XT.app.$.postbooks.appendPanels("setup", panels);

  };

}());
