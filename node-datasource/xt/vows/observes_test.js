/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var vows = require('vows'),
    assert = require('assert');

  require('../xt');

  vows.describe('the X.Object observes function').addBatch({

    "when an observed function's event is not fired": {
      topic: function () {
        var objectWithObservedEvent = X.Object.create({
          anyNameFunction: this.callback.observes('something')
        });
        objectWithObservedEvent.emit('an event with a different name');
        return true;
      },
      'The function is not executed': function (error, result) {
        // vows cleverness: if the function had been executed then
        // vows would have errored on the combination of a callback
        // and a return value.
        assert.isTrue(result);
      }
    },

    "when an observed function's event *is* fired": {
      topic: function () {
        var objectWithObservedEvent = X.Object.create({
          anyNameFunction: this.callback.observes('something')
        });
        objectWithObservedEvent.emit('something');
      },
      'The function is executed': function (error, result) {
        // the following assertions are consistent with the effect
        // of the callback being fired
        assert.isNull(error);
        assert.equal(result, undefined);
      }
    },

    "when an observed property is set": {
      topic: function () {
        var objectWithObservedEvent = X.Object.create({
          anyNameFunction: this.callback.observes('something')
        });
        objectWithObservedEvent.set('something', 17);
      },
      'The function is executed': function (property, value) {
        assert.equal(property, "something");
        assert.equal(value, 17);
      }
    },

    "when an inherited function's event is fired": {
      topic: function () {
        var BaseClass = X.Object.extend({
          anyNameFunction: this.callback.observes('something')
        });
        var classInstance = BaseClass.create({
          someSecondaryFunction: function () {}
        });
        classInstance.emit('something');
      },
      'The inherited function is executed': function (error, result) {
        // the following assertions are consistent with the effect
        // of the callback being fired
        assert.isNull(error);
        assert.equal(result, undefined);
      }
    },

    "when an overriden function's event is fired": {
      topic: function () {
        var BaseClass = X.Object.extend({
          anyNameFunction: this.callback.observes('something')
        });
        var classInstance = BaseClass.create({
          anyNameFunction: function () {
            return true;
          }
        });
        classInstance.emit('something');
        return true;
      },
      'The overriden function will not be called': function (error, result) {
        // the following assertions are consistent with the effect
        // of the callback not being fired
        assert.isNull(error);
        assert.equal(result, true);
      }
    },

    "but when an overriden function's event is fired": {
      topic: function () {
        var BaseClass = X.Object.extend({
          anyNameFunction: this.callback//.observes('something')
        });
        var classInstance = BaseClass.create({
          anyNameFunction: function () {
            this._super.anyNameFunction();
            return true;
          }.observes('something')
        });
        classInstance.emit('something');
      },
      'The overriden function can be accessed through super': function (error, result) {
        // the following assertions are consistent with the effect
        // of the callback being fired
        assert.isNull(error);
        assert.equal(result, undefined);
      }
    },

    "but yet when an overriden function's event is fired": {
      topic: function () {
        var BaseClass = X.Object.extend({
          anyNameFunction: this.callback.observes('something')
        });
        var classInstance = BaseClass.create({
          anyNameFunction: function () {
            this._super.anyNameFunction();
            return true;
          }//.observes('something')
        });
        classInstance.emit('something');
      },
      "The overiding function shouldn't also need to also observe": function (error, result) {
        // XXX this fails. Should it fail?

        // the following assertions are consistent with the effect
        // of the callback being fired
        assert.isNull(error);
        assert.equal(result, undefined);
      }
    }
  }).export(module);

}());
