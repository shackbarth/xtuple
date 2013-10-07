/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var crud = require("../lib/crud"),
    assert = require("chai").assert,
    _ = require("underscore"),
    data = {
      recordType: "XM.ReasonCode",
      autoTestAttributes: true,
      createHash: {
        code: "Reason" + Math.random(),
        description: "Description of reason",
        documentType: "M"
      },
      updateHash: {
        description: "New Description",
        documentType: "P"
      },
      beforeSetActions: [{
        it: "verify setup of model",
        action: function (data, next) {
          it('verify the model is a ReasonCode', function () {
            assert.equal(data.model.recordType, "XM.ReasonCode");
          });

          it('verify documentKey is code', function () {
            assert.equal(data.model.documentKey, "code");
            assert.equal(data.model.idAttribute, "code");
          });

          it('verify model is lockable', function () {
            assert.isTrue(data.model.lockable);
          });

          it('verify constant values', function () {
            assert.equal(XM.ReasonCode.CREDIT_MEMO, "ARCM");
            assert.equal(XM.ReasonCode.DEBIT_MEMO, "ARDM");
          });

          it('verify that document key is not enforced uppercase', function () {
            assert.notEqual(data.model.get("code"), data.model.documentKey.toUpperCase());
          });

          it('verify that XM.reasonCodeDocumentTypes contains the constants', function () {
            assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
              return m.id === XM.ReasonCode.CREDIT_MEMO;
            }));
            assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
              return m.id === XM.ReasonCode.DEBIT_MEMO;
            }));
          });

          it('verify that the ReasonCodeCollection exists', function () {
            assert.ok(XM.ReasonCodeCollection);
          });

          it('verify that the cached reason codes load on startup', function () {
            assert.ok(XM.reasonCodes);
          });

          it('verify privileges', function () {
            var privList = data.model.privileges.all;
            assert.isTrue(privList.read);
            assert.equal(privList.create, "MaintainReasonCodes");
            assert.equal(privList.update, "MaintainReasonCodes");
            assert.equal(privList.delete, "MaintainReasonCodes");
          });

          next();
        }
      }],
      afterSaveActions: [{
        it: "verify saved reason code is in cached collection",
        action: function (data, next) {
          assert.ok(_.find(XM.reasonCodes.models, function (m) {
            return m.id === data.model.id;
          }));
          next();
        }
      }],
    };

  describe('Reason Code CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
