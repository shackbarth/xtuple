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
      bindAddress: "localhost",
      port: 443,
      keyFile: "./lib/private/key.pem",
      certFile: "./lib/private/server.crt",
      caFile: null,
      saltFile: "./lib/private/salt.txt",
      psqlPath: "psql",

      // These fields need to be filled in for the datasource
      // to be able to email
      smtpHost: "mercury.xtuple.com",
      smtpPort: 587,
      smtpUser: "_smtp_user_",
      smtpPassword: "_smtp_password_",

      // these properties are dynamically registered with the
      // node discovery service

      // the unique identifer registered for this service/instance
      name: "dev-datasource",

      // human-friendly description of this service
      description: "NA",

      // REQUIRED - the ip address or hostname for this instance
      hostname: "localhost",

      // human-friendly location identifier for various cloud, physical
      // servers, etc.
      location: "NA"
    },
    administratorInterface: {
      port: 9090
    },
    globalDatabase: {
      hostname: "localhost",
      port: 5432,
      database: "global",
      user: "admin",
      password: "admin",
      nodeUsername: "node"
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
      },
      proxy: {
        hostname: "localhost",
        port: 27017,
        schemaDirectory: "./mongo_schemas/proxy",
        database: "xtproxy"
      }
    },
    required: [
      "lib/ext/session",
      "lib/ext/database",
      "lib/ext/router",
      "lib/servers",
      "lib/ext/caches",
      "lib/ext/datasource",
      "lib/ext/models"
    ]
  };
}());
