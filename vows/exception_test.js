/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var vows = require('vows'),
    assert = require('assert');

  require('../xt');


  vows.describe('X.exception').addBatch({

    'when an exception is created': {
      topic: function () {
        return X.fatal('this is a fatal exception');
      },
      'it is just an object': function (topic) {
        assert.equal(typeof topic, 'object');
        assert.equal(topic.type, 'fatal');
        assert.equal(topic.message, 'this is a fatal exception');
      }
    },
    'when an exception is issued': {
      topic: function () {
        var errorMessage = 'original';
        try {
          issue(X.fatal('do not worry if you see this onscreen'));
        } catch (error) {
          errorMessage = 'exception caught';
        }
        return errorMessage;
      },
      'it will not get caught through the standard try catch': function (topic) {
        assert.equal(topic, 'original');
      }

    }

  }).export(module);

}());
