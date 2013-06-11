/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.Priority",
    autoTestAttributes : true,
    createHash : {
      name: "Must Have"
    },
    updateHash : {
      name: "Deferred"
    }
  };

var timeout = 20 * 1000;

describe('Priority CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.Priority Model', function () {
    data.model = new XM.Priority();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Priority', 'INIT Value should be XM.Priority');
  });

  it('should create an XM.Priority Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.Priority Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
  });

  it('should update an XM.Priority Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Name UPDATE Value is equal');
    done();
  });

  it('should delete an XM.Priority Model', function (done) {
    crud.destroy(data);
    done();
  });


});

