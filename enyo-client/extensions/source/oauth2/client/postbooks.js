/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, enyo:true, console:true */

(function () {
  "use strict";

  XT.extensions.oauth2.initPostbooks = function () {

    var module = {
      name: "oauth2",
      label: "_oauth2".loc(),
      panels: [
        {name: "oauth2ClientList", kind: "XV.Oauth2clientList"}
      ]
    };
    XT.app.$.postbooks.insertModule(module, 2);

    var relevantPrivileges = [
      "MaintainOauth2clients"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

  };

}());

