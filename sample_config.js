/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";

  module.exports = {
    processName: "node-datasource",
    debugging: true,
    allowMultipleVersions: true,
    requireDatabase: true,
    requireServer: true,
    requireCache: true,
    functorsDirectory: "./lib/functors",
    routesDirectory: "./lib/routes",
    routersDirectory: "./lib/routers",
    proxy: {
      hostname: "localhost",
      port: 9000
    },
    datasource: {
      sessionTimeout: 15,
      bindAddress: "",
      port: 443,
      keyFile: "",
      certFile: "",
      caFile: "",
      saltFile: "",
      
      // make sure to supply the information necessary
      // for this service to register itself with router
      name: "[DATASOURCE INSTANCE NAME]",
      description: "[DATASOURCE DESCRIPTION TEXT]",
      hostname: "[DATASOURCE HOSTNAME/IP]",
      location: "[DATASOURCE LOCATION TEXT SPECIFIER]"
    },
    cache: {
      session: {
        hostname: "localhost",
        port: 27017,
        schemaDirectory: "./mongo_schemas/session",
        database: "xtdb"
      },
      users: {
        hostname: "localhost",
        port: 27017,
        schemaDirectory: "./mongo_schemas/users",
        database: "xtusers"
      }
    }
  };
}());
