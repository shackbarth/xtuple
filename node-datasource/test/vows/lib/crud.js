/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout: true, exports: true */

var _ = require("underscore"),
  assert = require("assert");

(function () {
  "use strict";

  exports.waitTime = 10000;

  /**
    Creates a working model and automatically checks state
    is `READY_NEW` and a valid `id` immediately afterward.

    Note: This function assumes the `id` is fetched automatically.
    For models with manually created ids such as 'XM.UserAccount',
    create a topic manually.

    @param {Object} Data
    @param {Object} Vows
  */
  exports.create = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        var that = this,
          timeoutId,
          model = data.model,
          auto_regex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER,
          callback = function (model, value) {
            if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
              // Check that the AUTO...NUMBER property has been set.
              if (model.get(model.documentKey) && model.id) {
                clearTimeout(timeoutId);
                model.off('change:' + model.documentKey, callback);
                model.off('change:id', callback);
                that.callback(null, data);
              }
            } else {
              clearTimeout(timeoutId);
              model.off('change:id', callback);
              that.callback(null, data);
            }
          };

        model.on('change:id', callback);
        // Add an event handler when using a model with an AUTO...NUMBER.
        if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
          model.on('change:' + model.documentKey, callback);
        }
        model.initialize(null, {isNew: true});

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          console.log("timeout was reached");
          that.callback(null, data);
        }, exports.waitTime);
      },
      'Status is `READY_NEW`': function (data) {
        assert.equal(data.model.getStatusString(), 'READY_NEW');
      },
      'ID is valid': function (data) {
        assert.isNumber(data.model.id);
      }
    };

    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

  /**
    Saves the working model and automatically checks state
    is `READY_CLEAN` immediately afterward.

    @param {Object} Data
    @param {Object} Vows
  */
  exports.save = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        var that = this,
          timeoutId,
          model = data.model,
          callback = function () {
            var status = model.getStatus(),
              K = XM.Model;
            if (status === K.READY_CLEAN) {
              clearTimeout(timeoutId);
              model.off('statusChange', callback);
              that.callback(null, data);
            }
          };
        model.on('statusChange', callback);
        model.save();

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          console.log("timeout was reached");
          that.callback(null, data);
        }, exports.waitTime);
      },
      'Status is `READY_CLEAN`': function (data) {
        assert.equal(data.model.getStatusString(), 'READY_CLEAN');
      },
      'And the values are as we set them': function (error, data) {
        var hashToTest = data.updated ? _.extend(data.createHash, data.updateHash) : data.createHash;
        _.each(hashToTest, function (value, key) {
          if (typeof (data.model.get(key)) === 'object') {
            assert.equal(data.model.get(key).id, value);
          } else {
            assert.equal(data.model.get(key), value);
          }
        });
      }
    };

    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

  /**
    Check before updating the working model that the state is `READY_CLEAN`.

    @param {Object} Data
    @param {Object} Vows
  */
  exports.update = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        return data;
      },
      'Status is `READY_CLEAN`': function (data) {
        assert.equal(data.model.getStatusString(), 'READY_CLEAN');
      }
    };

    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

  /**
    Destorys the working model and automatically checks state
    is `DESTROYED_CLEAN` immediately afterward.

    @param {Data}
    @param {Object} Vows
  */
  exports.destroy = function (data, vows) {
    vows = vows || {};
    var context = {
      topic: function () {
        var that = this,
          timeoutId,
          model = data.model,
          callback = function () {
            var status = model.getStatus(),
              K = XM.Model;
            if (status === K.DESTROYED_CLEAN) {
              clearTimeout(timeoutId);
              model.off('statusChange', callback);
              that.callback(null, data);
            }
          };
        model.on('statusChange', callback);
        model.destroy();

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          console.log("timeout was reached");
          that.callback(null, data);
        }, exports.waitTime);
      },
      'Status is `DESTROYED_CLEAN`': function (data) {
        assert.equal(data.model.getStatusString(), 'DESTROYED_CLEAN');
      }
    };
    // Add in any other passed vows
    _.extend(context, vows);
    return context;
  };

}());
