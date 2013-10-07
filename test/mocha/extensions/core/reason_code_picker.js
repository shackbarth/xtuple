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
    assert = require("chai").assert;

  describe('XV ReasonCodePicker', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      // setup for the date widget
      var appLoaded = function () {
        done();
      };
      zombieAuth.loadApp(appLoaded);
    });

    describe('XV ReasonCodePicker', function () {
      it('should have their attrs set up correctly', function () {
        var child,
          key = "ReasonCodePicker",
          collName,
          master = new enyo.Control();

        // create the picker
        child = master.createComponent({
          kind: "XV." + key,
          name: key
        });
        assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);

        // verify that there is a backing model
        collName = child.getCollection();
        assert.isNotNull(collName, 'XV.' + key + ' has no collection behind it');
        var collection = _.isObject(this.collection) ? child.collection :
            XT.getObjectByName(child.collection);
        assert.isNotNull(collection, 'XV.' + key + ' does not have a valid collection name');

        // test that filters work properly when credit memo the reason code
        K = XM.ReasonCode;
        var reasonCodeTestJson = [
          {id: "1", code: "test1".loc(), documentType: null},
          {id: "2", code: "test2".loc(), documentType: K.DEBIT_MEMO},
          {id: "3", code: "test3".loc(), documentType: K.CREDIT_MEMO},
        ];
        for (i = 0; i < reasonCodeTestJson.length; i++) {
          var testCode = new XM.ReasonCodeModel(reasonCodeTestJson[i]);
          XM.reasonCodes.add(testCode);
        }
        child.setDocumentType(XM.ReasonCode.CREDIT_MEMO);
        child.buildList();
        var list = child.getListModels();
        console.log(list);
      });
    });
  });
}());
