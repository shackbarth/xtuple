/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true */

var buildAll = require('../../../../scripts/lib/build_all'),
  assert = require('chai').assert,
  pg = require('pg'),
  path = require('path'),
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth');

(function () {
  "use strict";
  describe.skip('The database build tool', function () {
    this.timeout(10 * 60 * 1000);

    var config = require(path.join(__dirname, "../../../node-datasource/config.js"));
    var creds = config.databaseServer;
    creds.host = creds.hostname; // adapt our lingo to node-postgres lingo

    it('should build without error on a brand-new database', function (done) {
      buildAll.build({
        database: "build_db_test_10",
        initialize: true,
        // TODO: use path.join and __dirname
        backup: "../../../../../../usr/local/xtuple/databases/demo-current.backup"
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have core extensions built', function (done) {
      var pgClient = new pg.Client(creds),
        sql = "select * from xm.contact_project;";

      pgClient.connect();
      pgClient.query(sql, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should not have non-core extensions built', function (done) {
      done(); // TODO
    });

    it('should rebuild without error on an existing database', function (done) {
      buildAll.build({
        database: "build_db_test_10"
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have core extensions built', function (done) {
      done(); // TODO
    });

    it('should not have non-core extensions built', function (done) {
      done(); // TODO
    });

    it('should be able to build an extension', function (done) {
      buildAll.build({
        database: "build_db_test_10",
        extension: '../private-extensions/source/incident_plus'
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have core extensions built', function (done) {
      done(); // TODO
    });

    it('should have the new extension built', function (done) {
      done(); // TODO
    });

  });
}());

