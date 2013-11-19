/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, enyo: true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert,
    zombieAuth = require("../lib/zombie_auth"),
    model, workspace,
    billingOptions = [
      "NextARMemoNumber",
      "NextCashRcptNumber",
      "HideApplyToBalance",
      "EnableCustomerDeposits",
      "CreditTaxDiscount",
      "remitto_name",
      "remitto_address1",
      "remitto_address2",
      "remitto_address3",
      "remitto_city",
      "remitto_state",
      "remitto_zipcode",
      "remitto_country",
      "remitto_phone",
      "AutoCreditWarnLateCustomers",
      "DefaultAutoCreditWarnGraceDays",
      "RecurringInvoiceBuffer",
      "DefaultARIncidentStatus",
      "AutoCloseARIncident"
    ];

  var spec = {
    recordType: "XM.Billing",
    skipCrud: true,
    skipSmoke: true,
    skipModelConfig: true,
    privileges: {
      read: "ConfigureAR",
      createUpdate: "ConfigureAR",
      delete: false
    }
  };

  var additionalTests = function () {

    it('can be loaded with a zombie session', function (done) {
      this.timeout(40 * 1000);
      zombieAuth.loadApp({callback: done, verbose: false});
    });

    it('XM.Billing settings model can be created', function (done) {
      model = new XM.Billing();
      assert.isDefined(model);
      model.fetch({
        success: function () {
          done();
        }
      });
    });

    it('XM.Billing should contain all valid options', function () {
      _.each(billingOptions, function (option) {
        assert.isDefined(model.attributes[option]);
      });
    });

    it('XM.Billing.settings function should be created with special handling', function (done) {
      XM.ModelMixin.dispatch('XM.Billing', 'settings', [], {
          success: function (resp) {
            assert.isDefined(resp.NextARMemoNumber);
            assert.isDefined(resp.NextCashRcptNumber);
            done();
          }
        }
      );
    });

    it('The XM.incidentCategories cache must be added to Billing', function () {
      assert.isDefined(XM.incidentCategories);
    });

    it('Configuration workspace should be created for Billing with options', function () {
      assert.isDefined(XV.BillingWorkspace);
      var K = enyo.kind({kind: XV.BillingWorkspace});
      workspace = new K();

      var attrs = _.pluck(workspace.$, 'attr'),
        address = _.values(workspace.$.address.attr);
      // assert that the address widget exist with attributes
      assert.notEqual(address.length, 0);
      // the option values should either be in attributes array or address widget
      assert.equal(_.difference(billingOptions, attrs, address).length, 0);
    });

    it('The Hide Apply to Balance button label should say Hide Apply to Balance action', function () {
      assert.equal(workspace.$.hideApplyToBalance.$.label.getContent(),
        "Hide 'Apply to Balance' Action:");
    });

    it('Users require the "ConfigureAR" privilege to access the Billing configuration', function () {
      assert.equal(model.privileges, "ConfigureAR");
    });
  };


  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
