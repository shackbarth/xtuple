/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.OpportunityStage",
    autoTestAttributes : true,
    createHash : {
      name: 'Stage',
      description: 'Description',
      deactivate: true
    },
    updateHash : {
      description : 'Update Description'
    }
  };

var timeout = 20 * 1000;

describe('OpportunityStage CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.OpportunityStage Model', function () {
    data.model = new XM.OpportunityStage();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.OpportunityStage', 'INIT Value should be XM.OpportunityStage');
  });

  it('should create an XM.OpportunityStage Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.OpportunityStage Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
    assert.equal(data.model.get('deactivate'), data.createHash.deactivate, 'Model Deactivate READ Value is equal');
  });

  it('should update an XM.OpportunityStage Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal');
    done();
  });

  it('should delete an XM.OpportunityStage Model', function (done) {
    crud.destroy(data);
    done();
  });


});

