/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, issue:true */

(function () {
  "use strict";

  var _ = X._;

  /**
    xt-datasource specific implementation of X.Database. Handles communication with postgres.

    @class
    @extends X.Database
   */
  X.database = X.Database.create(/** @lends X.database */{
    query: function (organization, query, callback) {
      // we have to do a doubly asynchronous lookup (for now)
      // before we can build the correct connection string
      X.router.lookup("organization", {name: organization}, _.bind(
        this.didLookup, this, query, callback, {type: "organization", organization: organization}));
    },

    /**
      Lookup callback.
     */
    didLookup: function (query, callback, which, err, res) {
      var options;
      if (err || !res) return callback(err? err: "could not find %@".f(which.type));
      switch (which.type) {
        case "organization":
          X.router.lookup("database", {name: res.databaseServer}, _.bind(
            this.didLookup, this, query, callback, {type: "database", organization: which.organization}));
          break;
        case "database":
          options = {
            user: res.user || "admin",
            hostname: res.hostname,
            port: res.port,
            database: which.organization,
            password: res.password
          };
          this._super.query.call(this, query, options, callback);
          break;
      }
    }
  });

  // don't break any existing code...
  X.db = X.database;
}());
