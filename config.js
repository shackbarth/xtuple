/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";
  
  module.exports = {
    debugging: true,
    version: "beta1",
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
      securePort: 443,
      secureKeyFile: "./lib/private/key.pem",
      secureCertFile: "./lib/private/cert.crt",
      secureSaltFile: "./lib/private/salt.txt"
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
