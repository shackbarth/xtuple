/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    common = require("../lib/common"),
    assert = require("chai").assert;

  describe('Workspaces', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    // XXX This test works best on an app with all the extensions!
    it('should be plumbed correctly', function () {
      var workspace,
        Klass,
        master = new enyo.Control();

      // look at all the workspaces in XV
      _.each(XV, function (value, key) {
        if (XV.inheritsFrom(value.prototype, "XV.Workspace")) {
          if (key === 'SalesOrderBase' || value.prototype.modelAmnesty) {
            // exclude abstract classes and child workspaces
            return;
          }

          describe('XV.' + key, function () {

            it('should reflect well in the history panel', function () {
              workspace = master.createComponent({kind: "XV." + key});
              if (workspace.model) {
                Klass = XT.getObjectByName(workspace.model);
                assert.isNotNull(Klass);
                if (Klass.prototype.getAttributeNames().indexOf(Klass.prototype.nameAttribute) < 0 &&
                    typeof Klass.prototype[Klass.prototype.nameAttribute] !== 'function' &&
                    Klass.prototype.idAttribute === 'uuid') {
                  assert.fail(0, 1, workspace.model + " does not contain its nameAttribute, which will reflect " +
                    "poorly in the history panel");
                }
              }
            });

            it('should have its attrs set up right', function () {
              workspace = master.createComponent({kind: "XV." + key});
              var attrs = _.compact(_.map(workspace.$, function (component) {
                return component.attr;
              }));
              _.each(attrs, function (attr) {
                common.verifyAttr(attr, workspace.model);
              });

              assert.equal(1, 1);
            });


          });
        }
      });

    });
  });


}());
