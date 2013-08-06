/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    assert = require("chai").assert,
    endsWith = function (s, key) {
      return s.indexOf(key, s.length - key.length) !== -1;
    };

  describe('Workspaces', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    // XXX This test works best on an app with all the extensions!
    it('should have reflect well in the history panel', function () {
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

          // create the workspace
          try {
            workspace = master.createComponent({
              kind: "XV." + key,
              name: key
            });
          } catch (error) {
            //assert.fail(1, 0, "XV." + key + " cannot be created");
            console.log("XV." + key + " cannot be created with the extensions you " +
              " have installed (probably none). Best to run it with all the extensions.");
            return;
          }
          assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);

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
        }
      });

    });
  });


}());
