/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, after:true */

var buildAll = require('../../scripts/lib/build_all'),
  assert = require('chai').assert,
  datasource = require('../../node-datasource/lib/ext/datasource').dataSource,
  path = require('path');

(function () {
  "use strict";
  describe('The database build tool', function () {
    this.timeout(100 * 60 * 1000);

    var loginData = require(path.join(__dirname, "../lib/login_data.js")).data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../node-datasource/config.js")),
      creds = config.databaseServer,
      databaseName = loginData.org;

    it('should build without error on a brand-new database', function (done) {
      buildAll.build({
        database: databaseName,
        initialize: true,
        populateData: true,
        source: path.join(__dirname, "../../foundation-database/postbooks_demo_data.sql")
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });
  });
}());

