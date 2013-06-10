/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    assert = require("chai").assert;

  describe('Model read-only recursion', function () {
    this.timeout(20 * 1000);
    it('should know to stop if an attribute is null', function (done) {
      var testReadOnly = function () {
        var model, status;

        model = new XM.QuoteLine();
        model.set("itemSite", null);

        status = model.isReadOnly("itemSite.site.standardCost");
        assert.isNull(status);

        done();
      };


      zombieAuth.loadApp(testReadOnly);
    });
  });
}());

