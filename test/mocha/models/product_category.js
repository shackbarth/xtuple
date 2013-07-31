/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType : "XM.ProductCategory",
      autoTestAttributes : true,
      createHash : {
        code : 'CLASSIC-WOOD1' + Math.random(),
        description : 'Product Category Description'
      },
      updateHash : {
        description : 'Updated Description'
      }
    };

  describe('ProductCategory CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
}());
