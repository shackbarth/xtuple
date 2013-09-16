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
    testData = [
      //{kind: "XV.HonorificList", model: "XM.Honorific", update: "code"},
      {kind: "XV.AccountList", model: "XM.Account", update: "name"},
      {kind: "XV.OpportunityList", model: "XM.Opportunity", update: "name"},
      {kind: "XV.ContactList", model: "XM.Contact", update: "firstName"},
      {kind: "XV.ToDoList", model: "XM.ToDo", update: "notes"},
      {kind: "XV.IncidentList", model: "XM.Incident", update: "notes"}
    ];

  describe('CRM Workspaces', function () {

    before(function (done) {
      this.timeout(30 * 1000);
      zombieAuth.loadApp(done);
    });

    describe('Update tests', function () {
      _.each(testData, smoke.updateFirstModel);
    });
  });
}());
