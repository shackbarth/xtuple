/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert;

  var spec = {
    recordType: "XM.ReasonCode",
    collectionType: "XM.ReasonCodeCollection",
    cacheName: "XM.reasonCodes",
    listKind: "XV.ReasonCodeList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "description", "documentType"],
    extensions: ["billing"],
    privileges: {
      createUpdateDelete: "MaintainReasonCodes",
      read: true
    },
    createHash: {
      code: "TestReasonCode" + Math.random(),
      description: "Test Reason Code",
      documentType: "ARDM"
    },
    updatableField: "description",
    afterSaveActions: [{
      it: "verify saved reason code is in cached collection",
      action: function (data, next) {
        assert.isTrue(_.contains(XM.reasonCodes.models, data.model));
        next();
      }
    }],
  };

  var additionalTests = function () {
    it('verify constant values', function () {
      assert.equal(XM.ReasonCode.CREDIT_MEMO, "ARCM");
      assert.equal(XM.ReasonCode.DEBIT_MEMO, "ARDM");
    });

    it('verify that XM.reasonCodeDocumentTypes contains the constants', function () {
      assert.isDefined(XM.reasonCodeDocumentTypes);
      assert.equal(XM.reasonCodeDocumentTypes.length, 2);

      assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
        return m.id === XM.ReasonCode.CREDIT_MEMO;
      }));
      assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
        return m.id === XM.ReasonCode.DEBIT_MEMO;
      }));
    });

    it('verify that the list has all test values when no document type is specified', function () {

      describe('test filtering on Reason Code Picker', function () {
        var K, picker, nullModel, debitModel, creditModel;

        before(function () {
          assert.isDefined(XV.ReasonCodePicker);
          picker = new XV.ReasonCodePicker();

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
          picker.setDocumentType("");
          picker.buildList();
          var list = picker._collection.models;
          assert.include(list, nullModel);
          assert.include(list, creditModel);
          assert.include(list, debitModel);
        });

        it('verify that the list filters correctly when credit memo is the document type', function () {
          picker.setDocumentType(XM.ReasonCode.CREDIT_MEMO);
          picker.buildList();
          var list = picker._collection.models;
          assert.include(list, nullModel);
          assert.include(list, creditModel);
        });

        it('verify that the list filters correctly when debit memo is the document type', function () {
          picker.setDocumentType(XM.ReasonCode.DEBIT_MEMO);
          picker.buildList();
          var list = picker._collection.models;
          assert.include(list, nullModel);
          assert.include(list, debitModel);
        });
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
