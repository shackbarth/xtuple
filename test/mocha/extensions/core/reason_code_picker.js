/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

// NOTE! This test will fail in an extensionless build. This failure represents
// a low-burning bug in the app, that many kinds are defined but not instantiable
// in the core itself, usually because they rely on pickers that rely on caches
// that don't exist. We don't see this problem in the app because those kinds
// are hidden without the pertinent extension.

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    common = require("../../lib/common"),
    _ = require("underscore"),
    assert = require("chai").assert,
    child,
    key,
    master;

  describe('XV ReasonCodePicker', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      // setup for the date widget
      var appLoaded = function () {
        done();
      };
      zombieAuth.loadApp(appLoaded);
    });

    describe('test reason code picker', function () {

      before(function () {
        key = "ReasonCodePicker";
        master = new enyo.Control();

        // create the reason code picker
        child = master.createComponent({
          kind: "XV." + key,
          name: key
        });
        assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);
      });

      it('verify that the list has all test values when no document type is specified', function () {

        describe('test filtering on reason code picker', function () {

          var K, nullModel, debitModel, creditModel;

          before(function () {
            // add some mock data to the reason codes
            K = XM.ReasonCode;
            nullModel = new XM.ReasonCode({id: "1", code: "test1", documentType: null});
            debitModel = new XM.ReasonCode({id: "2", code: "test2", documentType: K.DEBIT_MEMO});
            creditModel = new XM.ReasonCode({id: "3", code: "test3", documentType: K.CREDIT_MEMO});
            XM.reasonCodes.add(nullModel);
            XM.reasonCodes.add(debitModel);
            XM.reasonCodes.add(creditModel);
          });

          it('verify that the list has all test values when no document type is specified', function () {
            child.setDocumentType("");
            child.buildList();
            var list = child.getListModels();
            assert.isTrue(_.contains(list, nullModel));
            assert.isTrue(_.contains(list, creditModel));
            assert.isTrue(_.contains(list, debitModel));
          });

          it('verify that the list filters correctly when credit memo is the document type', function () {
            child.setDocumentType(XM.ReasonCode.CREDIT_MEMO);
            child.buildList();
            var list = child.getListModels();
            assert.isTrue(_.contains(list, nullModel));
            assert.isTrue(_.contains(list, creditModel));
          });

          it('verify that the list filters correctly when debit memo is the document type', function () {
            child.setDocumentType(XM.ReasonCode.DEBIT_MEMO);
            child.buildList();
            var list = child.getListModels();
            assert.isTrue(_.contains(list, nullModel));
            assert.isTrue(_.contains(list, debitModel));
          });
        });
      });
    });
  });
}());
