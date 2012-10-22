/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";

  module.exports = {
    processName: "node-datasource",
    debugging: true,
    allowMultipleInstances: true,
    requireDatabase: true,
    requireServer: true,
    requireCache: true,
    functorsDirectory: "./lib/functors",
    routesDirectory: "./lib/routes",
    routersDirectory: "./lib/routers",
    datasource: {
      sessionTimeout: 15,
      bindAddress: "",
      port: 20100,
      keyFile: "",
      certFile: "",
      caFile: null,
      saltFile: "",
      
      // these properties are dynamically registered with the
      // node discovery service
      
      // the unique identifer registered for this service/instance
      name: "",
      
      // human-friendly description of this service
      description: "",
      
      // REQUIRED - the ip address or hostname for this instance
      hostname: "",
      
      // human-friendly location identifier for various cloud, physical
      // servers, etc. 
      location: ""
    },
    administratorInterface: {
      port: 9090
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
    },
    required: [
      "lib/ext/session",
      "lib/ext/database",
      "lib/servers",
      "lib/ext/caches"
    ]
  };
}());
