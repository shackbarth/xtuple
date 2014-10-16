/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, describe:true, it:true, require:true, __dirname:true, before:true */

var _ = require("underscore"),
  assert = require('chai').assert,
  path = require('path');

(function () {
  "use strict";

  describe('The financialReport function', function () {

    var loginData = require("../lib/login_data.js").data,
      datasource = require('../../../xtuple/node-datasource/lib/ext/datasource').dataSource,
      config = require(path.join(__dirname, "../../node-datasource/config.js")),
      creds = _.extend({}, config.databaseServer, {database: loginData.org}),
      oldval    = -98.76,       // makes it easy to spot in test failures
      changeval = 123.45,
      freSql = "select financialreport(flhead_id, period_id, 'M', -1) as fr"
             + "  from flhead, period"
             + " where flhead_name = 'Basic Balance Sheet'"
             + "   and current_date between period_start and period_end;",
      valueSql = " select cast(sum(flrpt_ending) as text) as value"
               + "   from flrpt"
               + "   join accnt on flrpt_accnt_id = accnt_id"
               + " where accnt_descrip = 'Cash at eBank'"
               + ";";
      ;
    this.timeout(10*1000);      // the fre ain't speedy

    it("should generate financial report data", function (done) {
      datasource.query(freSql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].fr);
        done();
      });
    });

    it("should get the starting net asset value", function (done) {
      datasource.query(valueSql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        oldval = Number(res.rows[0].value);
        done();
      });
    });

    it("should insert a gl transaction", function (done) {
      var sql = "select insertgltransaction('G/L', 'ST', 'FREtest',"
              + "  'testing financialreport()', cr.accnt_id, dr.accnt_id,"
              + "  -1, " + changeval + ", period_end) AS result"
              + "  from accnt cr, accnt dr, period"
              + " where cr.accnt_descrip = 'Cash at eBank'"
              + "   and dr.accnt_descrip = 'Deferred Revenue'"
              + "   and current_date between period_start and period_end;"
              + valueSql;
      datasource.query(sql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].result > 0);
        done();
      });
    });

    it("should regenerate financial report data", function (done) {
      datasource.query(freSql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        assert.isTrue(res.rows[0].fr);
        done();
      });
    });

    it("should show a net asset value change", function (done) {
      datasource.query(valueSql, creds, function (err, res) {
        assert.equal(res.rowCount, 1);
        var newval = Number(res.rows[0].value);
        assert.closeTo(oldval - newval, changeval, 0.001);
        done();
      });
    });

  });
}());



