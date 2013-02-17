/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var zombieAuth = require("../zombie_auth"),
    vows = require("vows"),
    assert = require("assert"),
    model = "Honorific",
    crud = require('../crud');

  var createHash = {
    code: "Mista"
  };

  vows.describe('Contact testing').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp('admin', 'somenew', undefined, this.callback);
      },


      'CREATE ': crud.create(model, createHash)
    }
  }).export(module);
}());
