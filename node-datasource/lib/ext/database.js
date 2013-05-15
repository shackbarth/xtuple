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
      var options = {
        user: X.options.databaseServer.adminUser,
        hostname: X.options.databaseServer.hostname,
        port: X.options.databaseServer.port,
        database: organization,
        password: X.options.databaseServer.password
      };
      XT.dataSource.query(dbQuery, options, done);
    }
  });
}());
