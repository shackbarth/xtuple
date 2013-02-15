/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("./zombie_auth"),
    vows = require("vows"),
    assert = require("assert");

  vows.describe('Contact testing').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp('admin', 'somenew', undefined, this.callback);
      },
      'We should be able to create a new contact': function (err, browser, status) {
        var m = new XM.Contact(null, {isNew: true});

        assert.isTrue(m.isReadOnly("type"));
      }
    }
  }).export(module);






}());
