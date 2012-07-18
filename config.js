/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";
  
  module.exports = {
    version: "beta1",
    requireDatabase: true,
    requireServer: true,
    requireCache: true,
    functorsDirectory: "./lib/functors",
    routesDirectory: "./lib/routes",
    routersDirectory: "./lib/routers",
    datasource: {
      sessionTimeout: 15,
      port: 9000
    },
    cache: {
      hostname: "localhost",
      port: 27017
    }
  };
}());