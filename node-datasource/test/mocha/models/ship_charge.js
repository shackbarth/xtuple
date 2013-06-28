/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.ShipCharge",
    autoTestAttributes : true,
    createHash : {
      name: "Test Ship Charge",
      description: "iAmAShipCharge",
      isCustomerPay: true
    },
    updateHash : {
      name: "Update Test Ship Charge",
      isCustomerPay: false
    }
  };

var timeout = 20 * 1000;

describe('ShipCharge CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.ShipCharge Model', function () {
    data.model = new XM.ShipCharge();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.ShipCharge', 'INIT Value should be XM.ShipCharge');
  });

  it('should create an XM.ShipCharge Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.ShipCharge Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
    assert.equal(data.model.get('isCustomerPay'), data.createHash.isCustomerPay, 'Model isCustomerPay READ Value is equal');
  });

  it('should update an XM.ShipCharge Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Name UPDATE Value is equal');
    assert.equal(data.model.get('isCustomerPay'), data.updateHash.isCustomerPay, 'Model isCustomerPay UPDATE Value is equal');
    done();
  });

  it('should delete an XM.ShipCharge Model', function (done) {
    crud.destroy(data);
    done();
  });


});

