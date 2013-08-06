/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    assert = require("chai").assert;

  describe('Model integrity', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should contain its idAttribute', function () {
      _.each(XM, function (Klass, key) {
        var model;
        if (typeof Klass === 'function') {
          if (!Klass.prototype.recordType) {
            // guard against exceptions
            return;
          }
          model = new Klass();
          if (model instanceof XM.Model && !model instanceof XM.Settings) {
            assert.include(model.getAttributeNames(), model.idAttribute, key + " does not contain its idAttribute");
          }
        }
      });
    });
  });

  describe('Model read-only recursion', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should know to stop if an attribute is null', function () {
      var model, status;

      model = new XM.QuoteLine();
      model.set("itemSite", null);

      status = model.isReadOnly("itemSite.site.standardCost");
      assert.isNull(status);
    });
  });
}());

