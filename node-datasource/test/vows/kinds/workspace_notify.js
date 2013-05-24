/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var zombieAuth = require("../../mocha/lib/zombie_auth"),
    vows = require("vows"),
    assert = require("assert");

  /**
    Test the number widget.
   */
  vows.describe('Workspace notification').addBatch({
    'When we load up our app': {
      topic: function () {
        zombieAuth.loadApp({callback: this.callback, verbose: true});
      },
      'we can create a workspace linked to a model': {
        topic: function () {
          var workspaceContainer = new XV.WorkspaceContainer();

          workspaceContainer.setWorkspace({workspace: "XV.HonorificWorkspace"});
          return workspaceContainer;
        },
        'the error popup is typically not showing': function (workspaceContainer) {
          assert.isFalse(workspaceContainer.$.errorPopup.getShowing());
        },
        'when the model raises a notification': {
          topic: function (workspaceContainer) {
            workspaceContainer.$.workspace.getValue().notify("Hello!");
            return workspaceContainer;
          },
          'then the notification popup does show': function (workspaceContainer) {
            assert.isTrue(workspaceContainer.$.errorPopup.getShowing());
          },
          'only the appropriate buttons display': function (workspaceContainer) {
            assert.isTrue(workspaceContainer.$.errorOk.showing);
            assert.isFalse(workspaceContainer.$.errorYes.showing);
            assert.isFalse(workspaceContainer.$.errorNo.showing);
          },
          'and the buttons are all translated': function (workspaceContainer) {
            assert.notEqual(workspaceContainer.$.errorOk.content, "_ok");
            assert.notEqual(workspaceContainer.$.errorYes.content, "_yes");
            assert.notEqual(workspaceContainer.$.errorNo.content, "_no");
          },
          'when the model raises a question whose answer is no': {
            topic: function (workspaceContainer) {
              workspaceContainer.$.workspace.getValue().notify("What is baz?",
                {type: XM.Model.QUESTION, callback: this.callback});
              workspaceContainer.errorOk({}, {originator: {name: "errorNo"}});
            },
            'then false is returned to the model': function (topic) {
              assert.isFalse(topic);
            }
          },
          'when the model raises a question whose answer is yes': {
            topic: function (workspaceContainer) {
              workspaceContainer.$.workspace.getValue().notify("What is baz?",
                {type: XM.Model.QUESTION, callback: this.callback});
              workspaceContainer.errorOk({}, {originator: {name: "errorYes"}});
            },
            'then true is returned to the model': function (topic) {
              assert.isTrue(topic);
            }
          }
        }
      }
    }
  }).export(module);
}());
