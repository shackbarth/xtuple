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
          // takes care of the corner cases not covered by the test runner spec
          it('verify constant values', function () {
            assert.equal(XM.ReasonCode.CREDIT_MEMO, "ARCM");
            assert.equal(XM.ReasonCode.DEBIT_MEMO, "ARDM");
          });

          it('verify that XM.reasonCodeDocumentTypes contains the constants', function () {
            assert.equal(XM.reasonCodeDocumentTypes.length, 2);

            assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
              return m.id === XM.ReasonCode.CREDIT_MEMO;
            }));
            assert.ok(_.find(XM.reasonCodeDocumentTypes.models, function (m) {
              return m.id === XM.ReasonCode.DEBIT_MEMO;
            }));
          });

          next();
        }
      }],
      afterSaveActions: [{
        it: "verify saved reason code is in cached collection",
        action: function (data, next) {
          assert.isTrue(_.contains(XM.reasonCodes.models, data.model));
          next();
        }
      }],
    };

  describe('Reason Code CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());
