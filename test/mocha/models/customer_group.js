/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType: "XM.CustomerGroup",
    autoTestAttributes: true,
    enforceUpperKey: false,
    createHash: {
      name: "CupGrp"
    },
    updateHash: {
      name: "group"
    }
  };

var timeout = 20 * 1000;

describe.skip('Customer Group CRUD Test', function () {
  this.timeout(20 * 1000);
  it('should perform all the crud operations', function (done) {
    crud.runAllCrud(data, done);
  });
});

describe('Customer Group CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.CustomerGroup Model', function () {
    data.model = new XM.CustomerGroup();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.CustomerGroup', 'INIT Value should be XM.CustomerGroup');
  });

  it('should create an XM.Customer Group Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.CustomerGroup Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
  });

  it('should update an XM.CustomerGroup Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.CustomerGroup Model', function (done) {
    crud.destroy(data);
    done();
  });

});
