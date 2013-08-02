/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.Filter",
    autoTestAttributes : true,
    enforceUpperKey: false,
    createHash : {
      name: 'Filter Name',
      createdBy: 'username',
      params: '{search: search}',
      kind: 'XM.SomeParameterKind'
    },
    updateHash : {
      name: 'New Filter Name',
      shared: true
    }
  };

var timeout = 20 * 1000;

describe.skip('Filter CRUD Test', function () {
  this.timeout(20 * 1000);
  it('should perform all the crud operations', function (done) {
    crud.runAllCrud(data, done);
  });
});

describe('Filter CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.Filter Model', function () {
    data.model = new XM.Filter();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Filter', 'INIT Value should be XM.Filter');
  });

  it('should create an XM.Filter Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.Filter Model', function () {
    assert.equal(data.model.get('abbreviation'), data.createHash.abbreviation, 'Model Code READ Value is equal');
  });

  it('should update an XM.Filter Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.Filter Model', function (done) {
    crud.destroy(data);
    done();
  });

});
