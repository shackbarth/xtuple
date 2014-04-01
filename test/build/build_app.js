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
        source: path.join(__dirname, "../../foundation-database/postbooks_demo_data.sql")
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have the POC metric', function (done) {
      var sql = "select c.metric_id from metric c where c.metric_name = 'UnifiedBuild';";

      creds.database = databaseName;
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        done();
      });
    });

    it('should grant all privileges to the user', function (done) {
      var sql = "insert into usrpriv (usrpriv_username, usrpriv_priv_id) " +
        "select $1, priv_id " +
        "from priv " +
        "left join usrpriv on priv_id = usrpriv_priv_id and usrpriv_username = $1 " +
        "where usrpriv_id is null";

      creds.database = databaseName;
      creds.parameters = [loginData.username];
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        done();
      });
    });
  });
}());

