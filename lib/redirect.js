/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  XT.Server.create({
    name: "Redirector",
    autoStart: true,
    port: 80,
    router: XT.Router.create({
      routes: [XT.redirectRoute]
    })
  });
  
}());