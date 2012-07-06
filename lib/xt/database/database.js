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
      ret.userName = XT.database.user;
      ret.password = XT.database.password;
      ret.port = XT.database.port;
      ret.host = XT.database.hostname;
      ret.database = organization || XT.database.organization;
      return ret;
    },
  
    // TODO: replace
    query: function (organization, query, callback) {
      var defaults = this.defaults(organization);
      var conString = this.conString(defaults);
  
      // use the built-in pooling for this particular
      // connection
      XT.pg.connect(conString, function (err, client) {
        
        // if there was an error connecting to the database
        // we can't do much but report it
        if (err) {
          issue(XT.warning("Failed to connect to database", err));
          return callback(err);
        }
  
        // since we just connected, tell plv8 to init our session
        client.query("set plv8.start_proc = \"xt.js_init\";");
  
        // else we got a pooled client, now go ahead and query the
        // the sucker
        client.query(query, callback);
      });
    },
  
    className: 'XT.database'
  });
  
  XT.db = XT.database;
  
  XT.run(function () {
    XT.pg.defaults.poolSize = 12;
  });
  
  require('./cache');
  require("./ext/mongoose_schema");
}());