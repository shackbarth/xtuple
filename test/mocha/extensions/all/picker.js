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
              // don't test abstract kinds, or widgets with "picker" in name that aren't pickers
              !_.contains(['PickerWidget', 'AttributePicker', 'ExpenseCategoryPicker'], key)) {

            describe('XV.' + key, function () {
              it('should have their attrs set up correctly', function () {
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

                // verify that the name attribute is valid
                // this is a little tricky, because the static models are Backbone models, not XM models
                if (collection && child.nameAttribute) {
                  var models = collection.models;
                  if (models.length !== 0) {
                    var name = _.find(models, function (m) {
                      return m.getValue ? m.getValue(child.nameAttribute) : m.get(child.nameAttribute);
                    });
                    assert.ok(name, 'XV.' + key + ' does not have a valid name attribute');
                  }
                }

                var list = child.$.picker.getComponents();
                // if they specify to not show a none text, then it shouldn't be there
                if (!child.showNone) {
                  assert.isUndefined(_.find(list, function (c) {
                    return !c.value && c.content === child.noneText;
                  }));
                } else {
                  assert.ok(_.find(list, function (c) {
                    return !c.value && c.content === child.noneText;
                  }));
                }

                // if the specify not to show a label, then don't
                if (!child.showLabel) {
                  assert.isFalse(child.$.label.showing);
                } else {
                  assert.isTrue(child.$.label.showing);
                }
              });
            });
          }
        });
      });
    });
  });
}());
