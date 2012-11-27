/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";
  
  require("../ext/administrative_route");
  
  X.databaseRoute = X.AdministrativeRoute.create({
    clientModel: "database",
    model: function () {
      return XM.DatabaseServer;
    }.property()
  });
  
}());
