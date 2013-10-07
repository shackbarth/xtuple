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

  describe('Pickers', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      // setup for the date widget
      var appLoaded = function () {
        done();
      };

      zombieAuth.loadApp(appLoaded);
    });

    describe('XV Pickers', function () {
      it('should be set up correctly', function () {
        // look at all the lists in XV
        _.each(XV, function (value, key) {
          var child,
            collName,
            master = new enyo.Control();

          if (XV.inheritsFrom(value.prototype, "XV.Picker") &&
              // don't test abstract kinds
              !_.contains(['PickerWidget', 'AttributePicker', 'ExpenseCategoryPicker'], key)) {

            describe('XV.' + key, function () {
              it('should have their attrs set up correctly', function () {
                // create the picker
                child = master.createComponent({
                  kind: "XV." + key,
                  name: key
                });
                assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);

                // test that filters work properly when credit memo the reason code
                child.setDocumentType(XM.ReasonCode.CREDIT_MEMO);
                var list = child.getListModels();
              });
            });
          }
        });
      });
    });
  });
}());
