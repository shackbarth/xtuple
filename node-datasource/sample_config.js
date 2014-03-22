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
      encryptionKeyFile: "./lib/private/encryption_key.txt",
      keyFile: "./lib/private/key.pem",
      certFile: "./lib/private/server.crt",
      caFile: null, // needs to be an array of strings
      saltFile: "./lib/private/salt.txt",
      xTupleDbDir: "/usr/local/xtuple/databases",
      psqlPath: "psql",
      nodePath: "node",

      // These fields need to be filled in for the datasource
      // to be able to email
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      printer: "",

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
      restkeyfile: "/etc/xtuple/lib/rest-keys"
    }
  };
}());
