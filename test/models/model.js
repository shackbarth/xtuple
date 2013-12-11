/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true,
  process:true, module:true, require:true, beforeEach: true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    assert = require("chai").assert;

  describe('Model integrity', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should contain its idAttribute', function () {
      _.each(XM, function (Klass, key) {
        var model;
        if (typeof Klass === 'function') {
          if (!Klass.prototype.recordType) {
            // guard against exceptions
            return;
          }
          model = new Klass();
          if (model instanceof XM.Model && !model instanceof XM.Settings) {
            assert.include(model.getAttributeNames(), model.idAttribute, key + " does not contain its idAttribute");
          }
        }
      });
    });
  });

  describe('Model read-only recursion', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should know to stop if an attribute is null', function () {
      var model, status;

      model = new XM.QuoteLine();
      model.set("itemSite", null);

      status = model.isReadOnly("itemSite.site.standardCost");
      assert.isNull(status);
    });
  });

  describe('XM.Model.setIfExists()', function () {

    beforeEach(function () {
      XM.TestModel = XM.Model.extend({
        recordType: "XM.TestModel",
        getAttributeNames: function () {
          return ["one", "two", "three"];
        }
      });
    });

    it('should set values that exist in the schema', function () {
      var model = new XM.TestModel();
      model.setIfExists("one", "en");
      assert.equal(model.get("one"), "en");
    });

    it('should not set values that do not exist in the schema', function () {
      var model = new XM.TestModel();
      model.setIfExists("four", "fire");
      assert.isUndefined(model.get("four"));
    });

    it('works with an object parameter', function () {
      var model = new XM.TestModel();
      model.setIfExists({two: "to", five: "fem"});
      assert.equal(model.get("two"), "to");
      assert.isUndefined(model.get("five"));
    });
  });

  describe('XM.Model.augment()', function () {

    beforeEach(function () {
      XM.TestModel = XM.Model.extend({
        recordType: "XM.TestModel",
        myHash: {
          foo: 3
        },
        myArray: [1, 2, 3],
        myCount: 1,
        myIncrementer: function () {
          this.myCount += 5;
        },
        defaults: function () {
          return {
            myDefault: 7
          };
        }
      });
    });

    it('should add new fields', function () {
      XM.TestModel.prototype.augment({
        myNewThing: "GREAT"
      });

      var model = new XM.TestModel();
      assert.equal(model.myNewThing, "GREAT");
    });

    it('should error on type mismatches', function () {
      try {
        XM.TestModel.prototype.augment({
          myHash: "GREAT"
        });
        assert.fail("Type mismatches should not be allowed");
      } catch (error) {
        assert.notEqual(error.actual, "Type mismatches should not be allowed");
      }
    });

    it('should error if you are stomping an object value', function () {
      try {
        XM.TestModel.prototype.augment({
          myHash: {foo: 19}
        });
        assert.fail("Do not allow this stomp");
      } catch (error) {
        assert.notEqual(error.actual, "Do not allow this stomp");
      }
    });

    it('should mix in objects', function () {
      XM.TestModel.prototype.augment({
        myHash: {
          bar: 5
        }
      });

      var model = new XM.TestModel();
      assert.equal(model.myHash.foo, 3);
      assert.equal(model.myHash.bar, 5);
    });

    it('should union arrays', function () {
      XM.TestModel.prototype.augment({
        myArray: [7]
      });

      var model = new XM.TestModel();
      assert.include(model.myArray, 1);
      assert.include(model.myArray, 2);
      assert.include(model.myArray, 3);
      assert.include(model.myArray, 7);
    });

    it('should run the old function and then the new', function () {
      XM.TestModel.prototype.augment({
        myIncrementer: function () {
          this.myCount *= 3;
        }
      });

      var a = new XM.TestModel();
      a.myIncrementer();
      var model = new XM.TestModel();
      model.myIncrementer();
      assert.equal(model.myCount, 18);
    });

    it('will mix together defaults from functions', function () {
      XM.TestModel.prototype.augment({
        defaults: function () {
          return {
            mySecondDefault: 17
          };
        }
      });

      var defaults = new XM.TestModel.prototype.defaults();
      assert.equal(defaults.myDefault, 7);
      assert.equal(defaults.mySecondDefault, 17);
    });

    it('should error on illegal augmentation', function () {
      try {
        XM.TestModel.prototype.augment({
          myCount: 99
        });
        assert.fail("Illegal augmentation should not be allowed");
      } catch (error) {
        assert.notEqual(error.actual, "Illegal augmentation should not be allowed");
      }
    });


  });
}());

