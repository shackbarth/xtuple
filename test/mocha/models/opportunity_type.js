/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType : "XM.OpportunityType",
      autoTestAttributes : true,
      createHash : {
        name : 'Test Name' + Math.random(),
        description : 'Test Description'
      },
      updateHash : {
        description : 'Updated Description'
      }
    };

  describe('OpportunityType CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
}());
