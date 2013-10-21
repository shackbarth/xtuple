/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var assert = require("chai").assert,
    crud = require('../lib/crud'),
    data = {
      recordType : "XM.SalesCategory",
      autoTestAttributes : true,
      createHash : {
        name: "NORMAL-SALE",
        description: "Normal Sale",
        isActive: true
      },
      updateHash : {
        description: "Changed Descrip",
        isActive: false
      }
    };

  describe('SaleType CRUD Test', function () {
    crud.runAllCrud(data);

    it('test deactivate with no unposted invoices', function (done) {
      this.timeout(5000);

      var sc = new XM.SalesCategory({
        name: 'test1',
        description: 'test1 desc',
        isActive: true
      });

      sc.once('change:canDeactivate', function (canDeactivate) {
        if (canDeactivate) {
          done();
        }
        else {
          assert.fail();
        }
      });

      sc.canDeactivate();
    });

    it('test deactivate with unposted invoices', function (done) {
      this.timeout(20000);
      // TODO 
    });
  });
})();
