/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";

  module.exports = {
    processName: "node-datasource",
    allowMultipleInstances: true,
    requireDatabase: true,
    datasource: {
      debugging: false,
      debugDatabase: false,
      enhancedAuthKey: "xTuple",
      sessionTimeout: 60,
      requireCache: true,
      pgPoolSize: 15,
      pgWorker: false,
      bindAddress: "localhost",
      redirectPort: 80,
      maintenancePort: 442,
      port: 443,
      keyFile: "./lib/private/key.pem",
      certFile: "./lib/private/server.crt",
      caFile: null,
      saltFile: "./lib/private/salt.txt",
      xTupleDbDir: "/usr/local/xtuple/databases",
      psqlPath: "psql",
      nodePath: "node",

      // These fields need to be filled in for the datasource
      // to be able to email
      smtpHost: "mercury.xtuple.com",
      smtpPort: 587,
      smtpUser: "_smtp_user_",
      smtpPassword: "_smtp_password_",

      // URL of BI server
      biUrl: "http://xtuple.com", // "http://your.bi.solution/report.html?args=sample",

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
      location: "NA",
      // Add each database to the array.
      databases: ["dev"],
      testDatabase: "" // this must remain empty for production datasources
    },
    databaseServer: {
      hostname: "localhost",
      port: 5432,
      user: "admin",
      password: "admin"
    }
  };
}());
