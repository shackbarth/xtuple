/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  "use strict";

  var path = require('path'),
    dataSource = require('../../../node-datasource/lib/ext/datasource').dataSource,
    defaultExtensions = require("./default_extensions").extensions;

  var pathFromExtension = function (name, location) {
    if (location === '/core-extensions') {
      return path.join(__dirname, "../../../enyo-client/extensions/source/", name);
    } else if (location === '/xtuple-extensions') {
      return path.join(__dirname, "../../../../xtuple-extensions/source", name);
    } else if (location === '/private-extensions') {
      return path.join(__dirname, "../../../../private-extensions/source", name);
    } else if (location === 'npm') {
      return path.join(__dirname, "../../../node_modules", name);
    }
  };

  //
  // Looks in a database to see which extensions are registered, and
  // tacks onto that list the core directories.
  //
  var inspectMobilizedDatabase = function (creds, done) {
    var extSql = "SELECT * FROM xt.ext ORDER BY ext_load_order";
    dataSource.query(extSql, creds, function (err, res) {
      if (err) {
        return done(err);
      }

      var paths = _.map(_.compact(res.rows), function (row) {
        return pathFromExtension(row.ext_name, row.ext_location);
      });

      paths.unshift(path.join(__dirname, "../../../enyo-client")); // core path
      paths.unshift(path.join(__dirname, "../../../lib/orm")); // lib path
      paths.unshift(path.join(__dirname, "../../../foundation-database")); // foundation path
      done(null, _.compact(paths));
    });
  };

  var inspectUnmobilizedDatabase = function (creds, done) {
    var extSql = "select * from public.pkghead where pkghead_name in ('xtmfg', 'xwd');",
      editionMap = {
        xtmfg: ["inventory", "manufacturing"],
        xwd: ["inventory", "distribution"]
      };
    dataSource.query(extSql, creds, function (err, res) {
      if (err) {
        return done(err);
      }
      var extensions = _.unique(_.flatten(_.map(res.rows, function (row) {
        return _.map(editionMap[row.pkghead_name], function (ext) {
          return path.join(__dirname, "../../../../private-extensions/source", ext);
        });
      })));
      done(err, defaultExtensions.concat(extensions));
    });
  };

  var inspectDatabaseExtensions = function (creds, done) {
    var isMobilizedSql = "select * from information_schema.tables where table_schema = 'xt' and table_name = 'ext';";

    dataSource.query(isMobilizedSql, creds, function (err, res) {
      if (res.rowCount === 0) {
        inspectUnmobilizedDatabase(creds, done);
      } else {
        inspectMobilizedDatabase(creds, done);
      }
    });
  };

  exports.inspectDatabaseExtensions = inspectDatabaseExtensions;

}());
