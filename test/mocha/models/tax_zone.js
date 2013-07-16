/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.TaxZone",
    autoTestAttributes : true,
    createHash: {
      code: "taxzonetest",
      description: "create"
    },
    updateHash: {
      description: "update"
    }
  };

var timeout = 20 * 1000;

describe('TaxZone CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.TaxZone Model', function () {
    data.model = new XM.TaxZone();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.TaxZone', 'INIT Value should be XM.TaxZone');
  });

  it('should create an XM.TaxZone Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.TaxZone Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
  });

  it('should update an XM.TaxZone Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal');
    done();
  });

  it('should delete an XM.TaxZone Model', function (done) {
    crud.destroy(data);
    done();
  });


});

