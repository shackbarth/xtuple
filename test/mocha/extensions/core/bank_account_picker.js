/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    common = require("../../lib/common"),
    _ = require("underscore"),
    assert = require("chai").assert,
    child;

  describe('XV BankAccountPicker', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      // setup for the date widget
      var appLoaded = function () {
        done();
      };
      zombieAuth.loadApp(appLoaded);
    });

    describe('test billing bank account picker', function () {

      before(function () {
        var key = "BillingBankAccountPicker",
          master = new enyo.Control();

        // create the billing bank account picker
        child = master.createComponent({
          kind: "XV." + key,
          name: key
        });
        assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);
      });

      it('verify only lists bank accouts where isUsedByBilling is true', function () {

        describe('test filtering on billing bank account picker', function () {
          var K, nullModel, billingModel, notBillingModel;

          before(function () {
            // add some mock data
            K = XM.BankAccountRelation;
            nullModel = new XM.BankAccountRelation({id: "1", name: "test1"});
            billingModel = new XM.BankAccountRelation({id: "2", name: "test2", isUsedByBilling: true});
            notBillingModel = new XM.BankAccountRelation({id: "3", name: "test3", isUsedByBilling: false});
            XM.bankAccountRelations.add(nullModel);
            XM.bankAccountRelations.add(billingModel);
            XM.bankAccountRelations.add(notBillingModel);
          });

          it('verify that the list has the billing model only', function () {
            child.buildList();
            var list = child.getListModels();
            assert.isTrue(_.contains(list, billingModel), 'The list should contain this model');
            assert.isFalse(_.contains(list, notBillingModel), 'The list should not contain this model');
            assert.isFalse(_.contains(list, nullModel), 'The list should not contain this model');
          });
        });
      });
    });
  });
}());
