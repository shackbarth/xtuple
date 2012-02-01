/*global XM global require */

var vows = require('vows'),
    assert = require('assert');

var simpleSuite = vows.describe('Simple XM Tests');

simpleSuite.addBatch({
    "XM's NAMESPACE": {
      topic: function() {
        return XM.NAMESPACE;
      },
      'should be "XM"': function (ns) {
        assert.equal(ns, "XM");
      }
    }
});

module.exports = simpleSuite;
