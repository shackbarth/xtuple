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

    it('Test Grid Box Functionality', function () {
      _.each(XV, function (value, key) {
        var list,
          kinds = ['SalesOrderList', 'QuoteList', 'InvoiceList', 'ReturnList', 'ProjectList'];
        // lists with grid boxes; TODO: find candidates automatically
        if (_.contains(kinds, key)) {
          describe('Create Workspace for XV.' + key, function () {
            it('Create a Workspace', function () {
              list = "XV." + key;
              smoke.navigateToNewWorkspace(XT.app, list, function (workspaceContainer) {
                var workspace = workspaceContainer.$.workspace,
                    getExportButton = function (obj) {
                      var result = null;
                      if (_.isObject(obj.$)) {
                        result = obj.$.exportButton ||
                                 _.find(obj.$, getExportButton);
                      }
                      return result;
                    };

                _.each(workspace.$, function (component) {
                  if (XV.inheritsFrom(component, 'XV.GridBox')) {
                    describe('Checking ' + component.name, function () {
                      it('checks for the export button', function () {
                        var exportButton = getExportButton(component);
                        assert.ok(exportButton);
                        // TODO: need to populate before we can export
                        // assert.doesNotThrow(exportButton.doTap());
                        // TODO: find the generated file & check contents
                      });

                      it('creates line items for ' + component, function () {
                        var gridBox = component,
                            exportButton = getExportButton(gridBox),
                            gridRow,
                            startingRows = gridBox.liveModels().length;

                        assert.isFalse(exportButton.disabled,
                                      'export enabled for fresh data');
                        gridBox.newItem();
                        gridRow = gridBox.$.editableGridRow;
                        assert.equal(gridBox.liveModels().length, startingRows += 1);
                        assert.isTrue(exportButton.disabled,
                                       'export disabled for changed data');

                        // Add a new row using the enter key
                        gridRow.bubble("onkeyup", {keyCode: 13});
                        assert.equal(gridBox.liveModels().length, startingRows += 1);
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
}());
