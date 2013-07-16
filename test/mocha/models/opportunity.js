/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true, describe:true, it:true */

(function () {
  "use strict";

  var crud = require("../lib/crud"),
    assert = require("chai").assert,
    data = {
      recordType: "XM.Opportunity",
      autoTestAttributes: true,
      createHash: {
        name: "BigOne" + Math.random(),
        account: { number: "XPPI"},
        opportunityStage: { name: "QUOTE" },
        opportunitySource: { name: "INTERNAL" },
        opportunityType: { name: "DESIGN" }
      },
      updateHash: {
        name: "SmallOne" + Math.random()
      }
    };

  describe('Opportunity crud test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

}());
