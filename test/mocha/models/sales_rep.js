/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    data = {
      recordType: "XM.SalesRep",
      autoTestAttributes: true,
      createHash : {
        number: "TESTSALESREP" + Math.random(),
        name: "TestRep"
      },
      updateHash : {
        name: "Updated Test SalesRep"
      },
      beforeDeleteActions: [{it: 'saves the account id', action: function (data, done) {
        data.deleteData = {
          accntId: data.model.get("account"),
          accountModel: new XM.Account()
        };
        done();
      }}],
      afterDeleteActions: [{it: 'deletes the related account', action: function (data, done) {
        var account = data.deleteData.accountModel,
          fetchOptionsAccnt = {},
          destroyAccount;
        fetchOptionsAccnt.id = data.deleteData.accntId;
        destroyAccount = function () {
          if (account.getStatus() === XM.Model.READY_CLEAN) {
            var accountDestroyed = function () {
              if (account.getStatus() === XM.Model.DESTROYED_CLEAN) {
                account.off("statusChange", accountDestroyed);
                done();
              }
            };

            account.off("statusChange", destroyAccount);
            account.on("statusChange", accountDestroyed);
            account.destroy();
          }
        };
        account.on("statusChange", destroyAccount);
        account.fetch(fetchOptionsAccnt);
      }}]
    };

  describe('SalesRep CRUD Test', function () {
    crud.runAllCrud(data);
  });
  /*
  describe('SalesRep CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('Should be able to initialize XM.SalesRep Model', function () {
      data.model = new XM.SalesRep();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.SalesRep', 'INIT Value should be XM.SalesRep');
    });

    it('should create an XM.SalesRep Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it('should have required Attributes', function () {
      expect(data.model.requiredAttributes).to.contain('number');
    });

    it('should read XM.SalesRep Model', function () {
      assert.equal(data.model.get('number'), data.createHash.number, 'SalesRep number is equal');
      assert.equal(data.model.get('name'), data.createHash.name, 'SalesRep name is equal');
    });

    it('should update an XM.SalesRep Model', function (done) {
      deleteData.accntId = data.model.get("account");
      deleteData.accountModel = new XM.Account();
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('name'), data.updateHash.name, 'UPDATE Value is equal');
      done();
    });

    describe('DELETE THE SalesRep AND ACCOUNT', function () {
      it('Should delete the SalesRep', function (done) {
        crud.destroy(data);
        done();
      });
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
