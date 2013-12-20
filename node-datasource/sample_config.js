/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global */

(function () {
  "use strict";

  module.exports = {
    processName: "node-datasource",
    allowMultipleInstances: true,
    client: {
      freeDemo: false,
      encoding: "rjson"
    },
    datasource: {
      debugging: false,
      debugDatabase: false,
      enhancedAuthKey: "xTuple",
      sessionTimeout: 60,
      requireCache: true,
      pgPoolSize: 15,
      pgWorker: false,
      bindAddress: "0.0.0.0",
      redirectPort: 8888,
      // proxyPort is the port the app will be redirected to
      // this is useful if there is a proxy in front of the app listening
      // on a different port
      proxyPort: null,
      port: 8443,
      keyFile: "./lib/private/key.pem",
      certFile: "./lib/private/server.crt",
      caFile: null,
      saltFile: "./lib/private/salt.txt",
      biKeyFile: "",
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
      // Leave this empty unless reports are installed
      // "http://yourserver.com:8080/pentaho/content/reporting/reportviewer/report.html?",
      biUrl: "",
      // "http://yourserver.com:8080/pentaho/"
      biServerUrl: "",
      // To support multitenant in Pentaho, it must have a unique database key
      uniqueTenantId: "default",

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
    integration: {
    },
    extensionRoutes: [],
    databaseServer: {
      hostname: "localhost",
      port: 5432,
      user: "admin",
      password: "admin"
    },
    biServer: {
      bihost: "localhost",
      port: 8080,
      httpsport: 8443,
      catalog: "xTuple",
      tenantname: "default",
      keyFile: "./lib/rest-keys/server.key"
    }, 
    printServer: {
      printhost: "localhost",
      port: 8080,
      httpsport: 8443,
      user: "reports",
      password: "password",
      format: "pageable/pdf"
    }
  };
}());
