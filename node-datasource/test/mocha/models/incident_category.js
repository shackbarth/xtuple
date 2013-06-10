/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.IncidentCategory",
    autoTestAttributes : true,
    createHash : {
      name: 'tested',
      description: 'description'
    },
    updateHash : {
      description : 'Update Description'
    }
  };

var timeout = 20 * 1000;

describe('IncidentCategory CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.IncidentCategory Model', function () {
    data.model = new XM.IncidentCategory();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.IncidentCategory', 'INIT Value should be XM.IncidentCategory');
  });

  it('should create an XM.IncidentCategory Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.IncidentCategory Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
  });

  it('should update an XM.IncidentCategory Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal');
    done();
  });

  it('should delete an XM.IncidentCategory Model', function (done) {
    crud.destroy(data);
    done();
  });


});

