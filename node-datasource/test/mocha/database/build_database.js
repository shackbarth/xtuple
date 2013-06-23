/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, after:true */

var buildAll = require('../../../../scripts/lib/build_all'),
  assert = require('chai').assert,
  datasource = require('../../../lib/ext/datasource').dataSource,
  path = require('path'),
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth');

(function () {
  "use strict";
  describe('The database build tool', function () {
    this.timeout(10 * 60 * 1000);

    var config = require(path.join(__dirname, "../../../config.js")),
      creds = config.databaseServer,
      databaseName = "dev";//"build_db_test"; TODO: don't use dev

    creds.host = creds.hostname; // adapt our lingo to node-postgres lingo
    creds.username = creds.user; // adapt our lingo to orm installer lingo
    creds.databaseName = databaseName;

    // TODO: uncomment this for a more thorough but slower test
    /*
    after(function (done) {
      uhoh:
      <<ERROR 2013-06-23T19:40:34.211Z>> Database Error! cannot drop the currently open database Please fix this!!!
      <<ERROR 2013-06-23T19:40:34.211Z>> Database Error! Last query was: drop database build_db_test;
      <<ERROR 2013-06-23T19:40:34.211Z>> Database Error! DB name = build_db_test
      // delete the test database
      var sql = "drop database " + databaseName + ";";

      datasource.query(sql, creds, function (err, res) {
        done();
      });
    });

    it('should build without error on a brand-new database', function (done) {
      buildAll.build({
        database: databaseName,
        initialize: true,
        // TODO: use postbooks backup
        backup: path.join(__dirname, "../lib/demo-test.backup")
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have core extensions built', function (done) {
      var sql = "select * from pg_class where relname = 'contact_project';";

      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        done();
      });
    });

    it('should not have non-core extensions built', function (done) {
      var sql = "select * from pg_class where relname = 'oauth2client';";

      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1); // SYS only
        done();
      });
    });
    */
    it('should rebuild without error on an existing database', function (done) {
      buildAll.build({
        database: databaseName
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have core extensions built', function (done) {
      var sql = "select * from pg_class where relname = 'contact_project';";

      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        done();
      });
    });

    it('should not have non-core extensions built', function (done) {
      var sql = "select * from pg_class where relname = 'oauth2client';";

      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1); // SYS only
        done();
      });
    });

    it('should be able to build an extension', function (done) {
      buildAll.build({
        database: databaseName,
        extension: path.join(__dirname + '../../../../../../xtuple-extensions/source/oauth2')
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have core extensions built', function (done) {
      var sql = "select * from pg_class where relname = 'contact_project';";

      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        done();
      });
    });

    it('should have the new extension built', function (done) {
      var sql = "select * from pg_class where relname = 'oauth2client';";

      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2); // SYS and XM
        done();
      });
    });
  });
}());

