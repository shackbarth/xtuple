/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType: "XM.PlannerCode",
    autoTestAttributes: true,
    createHash: {
      code: "10",
      name: "Ten"
    },
    updateHash: {
      name: "Ti"
    }
  };

var timeout = 20 * 1000;

describe('PlannerCode CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.PlannerCode Model', function () {
    data.model = new XM.PlannerCode();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.PlannerCode', 'INIT Value should be XM.PlannerCode');
  });

  it('should create an XM.PlannerCode Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.PlannerCode Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
  });

  it('should update an XM.PlannerCode Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Name UPDATE Value is equal');
    done();
  });

  it('should delete an XM.PlannerCode Model', function (done) {
    crud.destroy(data);
    done();
  });


});

