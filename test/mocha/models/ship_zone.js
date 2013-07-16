/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.ShipZone",
    autoTestAttributes : true,
    createHash : {
      name: "TESTSHIPZONE",
      description: "Test Ship Zone"
    },
    updateHash : {
      name: "UPDATETESTSHIPZONE"
    }
  };

var timeout = 20 * 1000;

describe('ShipZone CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.ShipZone Model', function () {
    data.model = new XM.ShipZone();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.ShipZone', 'INIT Value should be XM.ShipZone');
  });

  it('should create an XM.ShipZone Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.ShipZone Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
  });

  it('should update an XM.ShipZone Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Name UPDATE Value is equal');
    done();
  });

  it('should delete an XM.ShipZone Model', function (done) {
    crud.destroy(data);
    done();
  });


});

