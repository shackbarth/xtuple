/*jshint node:true, bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true, issue:true */

(function () {
  "use strict";

  /**
    xt-datasource specific implementation of X.Database. Handles communication with postgres.

    @class
    @extends X.Database
   */
  X.database = X.Database.create(/** @lends X.database */{
    query: function (organization, dbQuery, done) {
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
        XT.dataSource.query(dbQuery, options, done);
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
    }
  });
}());
