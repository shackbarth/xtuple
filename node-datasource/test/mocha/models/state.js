/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.State",
    autoTestAttributes : true,
    createHash: {
      name: "Milky Way",
      abbreviation: "MW",
      country: 213  //arbitrary number, must match actual country_id
    },
    updateHash: {
      abbreviation: "XY"
    }
  };

var timeout = 20 * 1000;

describe('State CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.State Model', function () {
    data.model = new XM.State();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.State', 'INIT Value should be XM.State');
  });

  it.skip('should create an XM.State Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it.skip('should read an XM.State Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
    assert.equal(data.model.get('abbreviation'), data.createHash.abbreviation, 'Model Abbreviation READ Value is equal');
//Needs work to get this correct - Error:  Model Country READ Value is equal: expected { Object (collection, _deferProcessing, ...) } to equal 214
//    assert.equal(data.model.get('country'), data.createHash.country, 'Model Country READ Value is equal');
  });

  it.skip('should update an XM.State Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('abbreviation'), data.updateHash.abbreviation, 'Model Abbreviation UPDATE Value is equal');
    done();
  });

  it('should delete an XM.State Model', function (done) {
    crud.destroy(data);
    done();
  });


});

