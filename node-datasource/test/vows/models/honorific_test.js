/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    vows = require("vows"),
    assert = require("assert"),
    model = "Honorific",
    crud = require('../lib/crud');

  var createHash = {
    code: "Herr"
  };

  var updateHash = {
    code: "Dame"
  };

  vows.describe('Contact testing').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp('admin', 'somenew', undefined, this.callback);
      },
      'We can run the CRUD tests': crud.create(model, createHash, updateHash),
      'We can test business logic': {
        topic: function () {
          return new XM.Honorific();
        },
        'The record type is XM.Honorific': function (topic) {
          assert.equal(topic.recordType, "Honey");
        }

      }
    }
  }).export(module);
}());
