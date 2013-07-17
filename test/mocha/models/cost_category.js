/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType: "XM.CostCategory",
    autoTestAttributes: true,
    enforceUpperKey: false,
    createHash: {
      code: "HERE",
      description: "Costs her"
    },
    updateHash: {
      description: "Costs here"
    }
  };

var timeout = 20 * 1000;

describe.skip('Cost Category CRUD Test', function () {
  this.timeout(20 * 1000);
  it('should perform all the crud operations', function (done) {
    crud.runAllCrud(data, done);
  });
});

describe('Cost Category CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.CostCategory Model', function () {
    data.model = new XM.CostCategory();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.CostCategory', 'INIT Value should be XM.CostCategory');
  });

  it('should create an XM.CostCategory Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.CostCategory Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
  });

  it('should update an XM.CostCategory Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.CostCategory Model', function (done) {
    crud.destroy(data);
    done();
  });

});

