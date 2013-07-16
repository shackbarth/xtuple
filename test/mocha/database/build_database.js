/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, after:true */

var buildAll = require('../../../scripts/lib/build_all'),
  assert = require('chai').assert,
  datasource = require('../../../node-datasource/lib/ext/datasource').dataSource,
  path = require('path'),
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth');

(function () {
  "use strict";
  describe('The database build tool', function () {
    this.timeout(10 * 60 * 1000);

    var config = require(path.join(__dirname, "../../../node-datasource/config.js")),
      creds = config.databaseServer,
      testInit = true, // false is faster, true is more thorough
      databaseName = config.datasource.testDatabase;

    creds.host = creds.hostname; // adapt our lingo to node-postgres lingo
    creds.username = creds.user; // adapt our lingo to orm installer lingo

    if (testInit) {
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

        creds.database = databaseName;
        datasource.query(sql, creds, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1);
          done();
        });
      });

      it('should not have non-core extensions built', function (done) {
        var sql = "select * from pg_class where relname = 'oauth2client';";

        creds.database = databaseName;
        datasource.query(sql, creds, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1); // SYS only
          done();
        });
      });
    }
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

      creds.database = databaseName;
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        done();
      });
    });

    if (testInit) {
      it('should not have non-core extensions built', function (done) {
        var sql = "select * from pg_class where relname = 'oauth2client';";

        creds.database = databaseName;
        datasource.query(sql, creds, function (err, res) {
          assert.isNull(err);
          assert.equal(res.rowCount, 1); // SYS only
          done();
        });
      });
    }

    it('should be able to build an extension', function (done) {
      buildAll.build({
        database: databaseName,
        extension: path.join(__dirname + '../../../../../xtuple-extensions/source/oauth2')
      }, function (err, res) {
        assert.isNull(err);
        done();
      });
    });

    it('should have core extensions built', function (done) {
      var sql = "select * from pg_class where relname = 'contact_project';";

      creds.database = databaseName;
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 1);
        done();
      });
    });

    it('should have the new extension built', function (done) {
      var sql = "select * from pg_class where relname = 'oauth2client';";

      creds.database = databaseName;
      datasource.query(sql, creds, function (err, res) {
        assert.isNull(err);
        assert.equal(res.rowCount, 2); // SYS and XM
        done();
      });
    });
  });
}());

