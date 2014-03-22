/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    assert = require('chai').assert,
    expect = require('chai').expect,
    deleteData = {},
    data = {
      recordType: "XM.Prospect",
      autoTestAttributes: true,
      createHash : {
        number: "Prospect1",
        name: "Prospect name"
      },
      updateHash: {
        name: "Updated"
      }
    };

  describe('Prospect CRUD Test', function () {
    crud.runAllCrud(data);
  });
       /*
        it('Should delete the Account', function () {
          var account = deleteData.accountModel,
            fetchOptionsAccnt = {},
            destroyAccount;
          fetchOptionsAccnt.id = deleteData.accntId;
          destroyAccount = function () {
            if (account.getStatus() === XM.Model.READY_CLEAN) {
              var accountDestroyed = function () {
                  if (account.getStatus() === XM.Model.DESTROYED_CLEAN) {
                    account.off("statusChange", accountDestroyed);
                  }
                };

              account.off("statusChange", destroyAccount);
              account.on("statusChange", accountDestroyed);
              account.destroy();
            }
          };
          account.on("statusChange", destroyAccount);
          account.fetch(fetchOptionsAccnt);
        });
      });
    });
  */
}());
