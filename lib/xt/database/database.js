/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";
  
  XT.database = XT.Object.create({
  
    conString: function (options) {
      return "tcp://{user}:{password}@{host}:{port}/{database}".f(options);
    },

    // TODO: replace
    defaults: function (organization) {
      var ret = {};
  
      // NOTE: SINCE THE KEY-MAP ISN'T SET UP THIS
      // IS PURELY ARBITRARY!!!
      // THESE HAVE TO BE SUPPLIED SOMEHOW - WHEN USED
      // IN CONJUNCTION WITH XT AS A WHOLE IT IS SUPPLIED
      // AUTOMATICALLY FROM THE CONFIGURATION OPTIONS
      ret.user = XT.database.user;
      ret.password = XT.database.password;
      ret.port = XT.database.port;
      ret.host = XT.database.hostname;
      ret.database = organization || XT.database.organization;
      return ret;
    },
  
    // TODO: remove
    defaultString: function (organization) {
      return this.conString(this.defaults(organization));
    },
  
    // TODO: replace
    query: function (organization, query, callback) {
      var str = this.defaultString(organization);

      XT.pg.connect(str, function (err, client) {

        if (err) {
          issue(XT.warning("Failed to connect to database", err));
          return callback(err);
        }
        
        if (!client.hasRunInit) {
          client.query("set plv8.start_proc = \"xt.js_init\";");
          client.hasRunInit = true;
        }

        client.query(query, callback);
      });
    },
  
    className: "XT.database"
  });
  
  XT.db = XT.database;
  
  XT.run(function () {
    XT.pg.defaults.poolSize = 12;
  });
  
  require('./cache');
  require("./ext/mongoose_schema");
}());