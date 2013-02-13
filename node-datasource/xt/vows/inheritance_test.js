/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var vows = require('vows'),
    assert = require('assert');

  require('../xt');


  vows.describe('inheritance and mixins').addBatch({

    'when the create function is used': {
      topic: function () {
        var obj = X.Object.create({testProperty: 17});
        return obj;
      },
      "a new instance is created": function (topic) {
        assert.equal(topic.testProperty, 17);
      }
    },

    'when the extend function is used': {
      topic: function () {
        var Klazz = X.Object.extend({testProperty: 17});
        return Klazz;
      },
      "a subclass is created": function (topic) {
        assert.equal(typeof topic, "function");
        var instance = topic.create();
        assert.equal(instance.testProperty, 17);
      }
    },

    'when a class gets a function mixed in': {
      topic: function () {
        var Klass = X.Object.extend();
        X.mixin(Klass, {
          newFunction: function () {
            return "foo";
          }
        });
        var instance = Klass.create();
        return instance;
      },
      'it will be applied to any instances of that class': function (topic) {
        // XXX this fails. Should it fail?

        assert.equal(topic.newFunction, "foo");
      }
    },

    'when an instance gets a function mixed in': {
      topic: function () {
        var obj = X.Object.create();
        X.mixin(obj, {
          newFunction: function () {
            return 'foo';
          }
        });
        return obj.newFunction();
      },
      'it works as part of that instance': function (topic) {
        assert.equal(topic, 'foo');
      }
    },

    'when mixin is used on a pre-existing property': {
      topic: function () {
        var obj = X.Object.create();
        X.mixin(obj, {
          myProperty: 17
        });
        X.mixin(obj, {
          myProperty: 19
        });

        return obj.myProperty;
      },
      'the property will be overridden': function (topic) {
        assert.equal(topic, 19);
      }
    },

    'when complete is used on a pre-existing property': {
      topic: function () {
        var obj = X.Object.create();
        X.mixin(obj, {
          myProperty: 17
        });
        X.complete(obj, {
          myProperty: 19
        });

        return obj.myProperty;
      },
      'the property will not be overridden': function (topic) {
        assert.equal(topic, 17);
      }
    }
  }).export(module);

}());

