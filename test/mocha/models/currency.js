/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.Currency",
    autoTestAttributes : true,
    enforceUpperKey: false,
    createHash : {
      name: 'rupee',
      symbol: 'R',
      abbreviation: 'RUP'
    },
    updateHash : {
      name : 'Rupayi'
    }
  };

var timeout = 20 * 1000;

describe.skip('Currency CRUD Test', function () {
  this.timeout(20 * 1000);
  it('should perform all the crud operations', function (done) {
    crud.runAllCrud(data, done);
  });
});

describe('Currency CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.Currency Model', function () {
    data.model = new XM.Currency();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Currency', 'INIT Value should be XM.Currency');
  });

  it('should create an XM.Currency Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.Currency Model', function () {
    assert.equal(data.model.get('abbreviation'), data.createHash.abbreviation, 'Model Code READ Value is equal');
  });

  it('should update an XM.Currency Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.Currency Model', function (done) {
    crud.destroy(data);
    done();
  });

});
