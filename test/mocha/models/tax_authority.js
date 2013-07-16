/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),
  deleteData = {},
  data = {
    recordType: "XM.TaxAuthority",
    autoTestAttributes: true,
    createHash : {
      code: "TAXAUTH3",
      name: "TAXAUTH NAME"
    },
    updateHash : {
      name: "Jon Fishman"
    }
  };
var timeout = 120 * 1000;
describe('TaxAuthority CRUD Test', function () {
  before(function (done) {
      this.timeout(timeout);
      zombieAuth.loadApp(done);
    });

  it('Should be able to initialize XM.TaxAuthority Model', function () {
    data.model = new XM.TaxAuthority();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.TaxAuthority', 'INIT Value should be XM.TaxAuthority');
  });

  it('should create an XM.TaxAuthority Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done()
  });

  it('should have required Attributes', function () {
    expect(data.model.requiredAttributes).to.contain('code');
    expect(data.model.requiredAttributes).to.contain('name');
  });

  it('should read XM.TaxAuthority Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'TaxAuthority code is equal');
    assert.equal(data.model.get('name'), data.createHash.name, 'TaxAuthority name is equal');
  });

  it('should update an XM.TaxAuthority Model', function (done) {
    deleteData.accntId = data.model.get("account");
    deleteData.accountModel = new XM.Account();
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'UPDATE Value is equal');
    done();
  });

  describe('DELETE THE TaxAuthority AND ACCOUNT', function () {
    it('Should delete the TaxAuthority', function (done) {
      crud.destroy(data);
      done();
    });
    it('Should delete the Account', function () {
      var account = deleteData.accountModel,
        fetchOptionsAccnt = {},
        destroyAccount,
        accountDestroyed;
      fetchOptionsAccnt.id = deleteData.accntId;
      destroyAccount = function () {
        if (account.getStatus() === XM.Model.READY_CLEAN) {
          accountDestroyed = function () {
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
