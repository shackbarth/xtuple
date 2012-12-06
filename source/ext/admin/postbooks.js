/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.admin.initPostbooks = function () {

    // ..........................................................
    // APPLICATION
    //
    var module = {
      name: "admin",
      label: "_admin".loc(),
      panels: [
        {name: "userList", kind: "XV.UserList"},
        {name: "databaseServerList", kind: "XV.DatabaseServerList"},
        {name: "organizationList", kind: "XV.OrganizationList"},
        {name: "extensionList", kind: "XV.ExtensionList"}
      ]
    };

    // TODO: the index should be the one above setup.
    XT.app.$.postbooks.insertModule(module, 2);
  };

}());
