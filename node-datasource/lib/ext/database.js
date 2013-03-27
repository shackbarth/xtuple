/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, issue:true */

(function () {
  "use strict";

  var _ = X._;

  /**
    xt-datasource specific implementation of X.Database. Handles communication with postgres.

    @class
    @extends X.Database
   */
  X.database = X.Database.create(/** @lends X.database */{
    query: function (organization, dbQuery, done) {
      // TODO - Don't be stupid, it's not that hard.

      var that = this,
          orgColl = new XM.OrganizationCollection(),
          fetchOptions = {};

      fetchOptions.success = function (res) {
        // We should only get one record back matching the organization.
        if (res.models.length !== 1) {
          var message = "Error fetching organization.";
          X.log(message);

          // No match or multiple which is not allowed. Send nothing.
          return done(new Error(message));
        }

        // Get db connection string and make the query.
        var options = {
          user: res.models[0].get("databaseServer").user || "admin",
          hostname: res.models[0].get("databaseServer").hostname,
          port: res.models[0].get("databaseServer").port,
          database: organization,
          password: res.models[0].get("databaseServer").password
        };
        that._super.query.call(that, dbQuery, options, done);
      };

      fetchOptions.error = function (res, err) {
        if (err.code === 'xt1007') {
          // XXX should "result not found" really be an error?
          return done(null, null);
        } else {
          var message = "Error fetching organization.";
          X.log(message);
          return done(new Error(message));
        }
      };

      // Fetch the collection looking for a matching organization.
      fetchOptions.username = X.options.globalDatabase.nodeUsername;
      fetchOptions.query = {};
      fetchOptions.query.parameters = [{attribute: "name", value: organization}];
      orgColl.fetch(fetchOptions);



      // we have to do a doubly asynchronous lookup (for now)
      // before we can build the correct connection string
// TODO - Kill X.router.
      //X.router.lookup("organization", {name: organization}, _.bind(
        //this.didLookup, this, query, callback, {type: "organization", organization: organization}));
    },

    /**
      Lookup callback.
     */
    didLookup: function (query, callback, which, err, res) {
      var options;
      if (err || !res) return callback(err? err: "could not find %@".f(which.type));
      switch (which.type) {
        case "organization":
// TODO - Kill X.router.
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
