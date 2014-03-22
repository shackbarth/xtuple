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
        // look at all the pickers in XV
        _.each(XV, function (value, key) {
          var child,
            collName,
            collection,
            master = new enyo.Control();

          if (XV.inheritsFrom(value.prototype, "XV.Picker") &&
              // don't test abstract kinds, non-picker widgets with picker in name
              !_.contains(['PickerWidget', 'AttributePicker', 'ExpenseCategoryPicker', 'DependencyPicker'], key)) {

            describe('XV.' + key, function () {
              before(function () {
                // create the picker
                child = master.createComponent({
                  kind: "XV." + key,
                  name: key
                });
                assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);
              });

              // TODO: pickers can have the collection passed into them as an attribute
              // really we should look at these pickers in the context of the workspace
              // in which we're being used, so that we can see if the collection value
              // is being passed in. This would involve iterating over the workspaces.
              it.skip('verify that there is a backing model for the picker', function () {
                collName = child.getCollection();
                assert.isNotNull(collName, 'XV.' + key + ' has no collection behind it');

                collection = _.isObject(this.collection) ? child.collection :
                    XT.getObjectByName(child.collection);
                assert.isNotNull(collection, 'XV.' + key + ' does not have a valid collection name');
              });

              it('verify that the name attribute is valid', function () {
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
              });

              it('verify that noneText attribute is valid', function () {
                var list = child.$.picker.getComponents();
                if (child.showNone) {
                  assert.ok(_.find(list, function (c) {
                    return !c.value && c.content === child.noneText;
                  }));
                } else {
                  assert.isUndefined(_.find(list, function (c) {
                    return !c.value && c.content === child.noneText;
                  }));
                }
              });

              it('verify showLabel attribute is valid', function () {
                if (child.showLabel) {
                  assert.isTrue(child.$.label.showing);
                } else {
                  assert.isFalse(child.$.label.showing);
                }
              });
            });
          }
        });
      });
    });
  });
}());
