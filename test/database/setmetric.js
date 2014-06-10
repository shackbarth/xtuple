/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require("underscore"),
  assert = require('chai').assert,
  path = require('path');

(function () {
  "use strict";
  describe('The setMetric function', function () {

    var loginData = require(path.join(__dirname, "../lib/login_data.js")).data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../node-datasource/config.js")),
      creds = _.extend({}, config.databaseServer, {database: loginData.org});

    it("should verify that there is no staged data", function (done) {
      var sql = "select metric_value from public.metric where metric_name = 'Test999';";
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 0);
        done();
      });
    });

    it("should add a new metric", function (done) {
      var sql = "select setmetric('Test999', 'Value999');";
      datasource.query(sql, creds, done);
    });

    it("should verify that the metric was set", function (done) {
      var sql = "select metric_value from public.metric where metric_name = 'Test999';";
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].metric_value, "Value999");
        done();
      });
    });

    it("should update the metric", function (done) {
      var sql = "select setmetric('Test999', 'Value888');";
      datasource.query(sql, creds, done);
    });

    it("should verify that the metric was set", function (done) {
      var sql = "select metric_value from public.metric where metric_name = 'Test999';";
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.equal(res.rows[0].metric_value, "Value888");
        done();
      });
    });

    after(function (done) {
      // cleanup
      var sql = "delete from public.metric where metric_name = 'Test999';";
      datasource.query(sql, creds, done);
    });

  });
}());



