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
    recordType: "XM.Prospect",
    autoTestAttributes: true,
    createHash : {
      number: "Prospect1",
      name: "Prospect name"
    },
    updateHash: {
      name: "Updated"
    }
  },
  timeout = 120 * 1000;
describe('Prospect CRUD Test', function () {
  before(function (done) {
      this.timeout(timeout);
      zombieAuth.loadApp(done);
    });

  it('Should be able to initialize XM.Prospect Model', function () {
    data.model = new XM.Prospect();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Prospect', 'INIT Value should be XM.Prospect');
  });

  it('should create an XM.Prospect Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should have required Attributes', function () {
    expect(data.model.requiredAttributes).to.contain('number');
    expect(data.model.requiredAttributes).to.contain('name');
  });

  it('should read XM.Prospect Model', function () {
    assert.equal(data.model.get('number'), data.createHash.number, 'Prospect number is equal');
    assert.equal(data.model.get('name'), data.createHash.name, 'Prospect name is equal');
  });

  it('should update an XM.Prospect Model', function (done) {
    deleteData.accntId = data.model.get("account");
    deleteData.accountModel = new XM.Account();
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'UPDATE Value is equal');
    done();
  });

  describe('DELETE THE PROSPECT AND ACCOUNT', function () {
    it('Should delete the prospect', function (done) {
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

  