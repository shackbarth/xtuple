/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    common = require("../../lib/common"),
    smoke = require("../../lib/smoke"),
    _ = require("underscore"),
    assert = require("chai").assert;

  describe('Workspace Grid Boxes', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      // setup for the date widget
      var appLoaded = function () {
        done();
      };

      zombieAuth.loadApp(appLoaded);
    });

    describe('Test Grid Boxes', function () {
      it('Test Grid Box Functionality', function () {

        _.each(XV, function (value, key) {
          var list,
            kinds = ['SalesOrderList', 'QuoteList', 'InvoiceList', 'ReturnList', 'ProjectList'];
          // loop through lists with grid boxes
          if (XV.inheritsFrom(value.prototype, "XV.List") && _.contains(kinds, key)) {

            describe('Create Workspace for XV.' + key, function () {
              it('Create a Workspace', function () {
                list = "XV." + key;
                smoke.navigateToNewWorkspace(XT.app, list, function (workspaceContainer) {
                  var workspace = workspaceContainer.$.workspace;
                  _.each(workspace.$, function (component) {
                    if (XV.inheritsFrom(component, 'XV.GridBox') && XV.inheritsFrom(component, 'XV.WorkflowGridBox')) {

                      describe('Test creating line items for ' + component, function () {
                        it('Create line items', function () {
                          var gridBox = component, gridRow;
                          // Be sure that there are no rows
                          assert.equal(gridBox.liveModels().length, 0);

                          gridBox.newItem();
                          gridRow = gridBox.$.editableGridRow;
                          // Verify that there is currently one row
                          assert.equal(gridBox.liveModels().length, 1);

                          // Add a new row using the enter key
                          gridRow.bubble("onkeyup", {keyCode: 13});
                          // Verify that now there are two rows
                          assert.equal(gridBox.liveModels().length, 2);
                        });
                      });
                    }
                  });
                });
              });
            });
          }
        });
      });
    });
  });
}());
