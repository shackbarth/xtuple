/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, process:true, module:true, require:true */

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
      'We should be able to create a new contact': {
        topic: function () {
          return new XM.Contact(null, {isNew: true});
        },
        'whose type is read-only': function (topic) {
          assert.isTrue(topic.isReadOnly("type"));
        },
        'and whose business logic is such-and-such': function (topic) {
          assert.equal (topic.businessLogic, undefined);//"such-and-such");
        },
        'and we can create a workspace to front it': function (topic) {
          var workspace = new XV.ContactWorkspace();
          workspace.setValue(topic);
          assert.equal (workspace.getValue().recordType, 'XM.Contact');
        }
      },
      // run with command vows and not node for it to exit upon completion
      //teardown : function () {
        //console.log("teardown", arguments);
      //}
    }
  }).export(module);
}());
