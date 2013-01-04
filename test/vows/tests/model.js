// tests on the XM.Model object

// necessary global variables
XM = {};
_ = require("underscore");
Backbone = require('backbone');
require("backbone-relational");

var vows = require('vows'),
  assert = require('assert'),
  model = require('../../../source/model');


// Create a Test Suite
vows.describe('Check compound privileges').addBatch({
  'if a user has a certain privilege': {
    topic: function () {
      // the topic here is a mock of the sessionPriv model
      return {
        get: function (priv) {
          return priv === "MaintainAllFoo";
        }
      };
    },

    'they should get access': {
      'when the privilege is on a simple list': function (topic) {
        assert.isTrue(XM.Model.checkCompoundPrivs(topic, "MaintainAllFoo"));
      },
      'when the privilege is on a compound list': function (topic) {
        assert.isTrue(XM.Model.checkCompoundPrivs(topic, "ViewAllFoo MaintainAllFoo"));
      },
      'but not when the privilege is not on a simple list': function (topic) {
        assert.isFalse(XM.Model.checkCompoundPrivs(topic, "MaintainAllBar"));
      },
      'but not when the privilege is not on a compoundlist': function (topic) {
        assert.isFalse(XM.Model.checkCompoundPrivs(topic, "ViewAllBar MaintainAllBar"));
      }
    }
  }
}).run(); // Run it
