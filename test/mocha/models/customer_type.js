/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType: "XM.CustomerType",
    autoTestAttributes: true,
    enforceUpperKey: false,
    createHash: {
      name: "CupGrp",
      description: "normal description"
    },
    updateHash: {
      name: "group"
    }
  };

var timeout = 20 * 1000;

describe.skip('Customer Type CRUD Test', function () {
  this.timeout(20 * 1000);
  it('should perform all the crud operations', function (done) {
    crud.runAllCrud(data, done);
  });
});

describe('Customer Type CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.CustomerType Model', function () {
    data.model = new XM.CustomerType();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.CustomerType', 'INIT Value should be XM.CustomerType');
  });

  it.skip('should create an XM.CustomerType Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it.skip('should read an XM.CustomerType Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
  });

  it.skip('should update an XM.CustomerType Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.CustomerType Model', function (done) {
    crud.destroy(data);
    done();
  });

});
