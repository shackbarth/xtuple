/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.OpportunityType",
    autoTestAttributes : true,
    createHash : {
      name : 'Test Name',
      description : 'Test Description'
    },
    updateHash : {
      description : 'Updated Description'
    }
  };

var timeout = 20 * 1000;

describe('OpportunityType CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.OpportunityType Model', function () {
    data.model = new XM.OpportunityType();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.OpportunityType', 'INIT Value should be XM.OpportunityType');
  });

  it('should create an XM.OpportunityType Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.OpportunityType Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
  });

  it('should update an XM.OpportunityType Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal');
    done();
  });

  it('should delete an XM.OpportunityType Model', function (done) {
    crud.destroy(data);
    done();
  });


});

