/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, issue:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.database = XT.Database.create({
    query: function (organization, query, callback) {
      // we have to do a doubly asynchronous lookup (for now)
      // before we can build the correct connection string
      XT.proxy.lookup("organization", {name: organization}, _.bind(
        this.didLookup, this, query, callback, {type: "organization", organization: organization}));
    },
    didLookup: function (query, callback, which, err, res) {
      //XT.debug("XT.database.didLookup(): ", which, err, res, XT.typeOf(res));
      var options;
      if (err || !res) return callback(err? err: "could not find %@".f(which.type));
      switch (which.type) {
        case "organization":
          XT.proxy.lookup("database", {name: res.database}, _.bind(
            this.didLookup, this, query, callback, {type: "database", organization: which.organization}));
          break;
        case "database":
          options = {
            user: "admin",
            hostname: res.hostname,
            port: res.port,
            database: which.organization
          };
          this._super.query.call(this, query, options, callback);
          break;
      }
    }
  });
  
  // don't break any existing code...
  XT.db = XT.database;
}());