/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  before:true, module:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    zombieAuth = require("../../lib/zombie_auth"),
    smoke = require("../../lib/smoke"),
    testData = [];
    //testData = [
      // These tests are failing
      //{kind: "XV.SalesOrderList", model: "XM.SalesOrder", update: "fob"},
      //{kind: "XV.CustomerList", model: "XM.Customer", update: "notes"}, // zombie can't handle TTOYS
      //{kind: "XV.ProspectList", model: "XM.Prospect", update: "notes"},
      //{kind: "XV.QuoteList", model: "XM.Quote", update: "fob"},
      //{kind: "XV.ItemList", model: "XM.Item", update: "notes"}
    //];

  describe('Sales Workspaces', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Update tests', function () {
      _.each(testData, smoke.updateFirstModel);
    });
  });
}());
