/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

//var XVOWS = XVOWS || {};
//(function () {
//  "use strict";

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

 data = {
  recordType: "XM.TaxAssignment",
  autoTestAttributes: true,
  createHash: {
    tax: "GA TAX-A",
    taxZone: "GA TAX",
    taxType: "Adjustment"
  },
  updateHash: {
    taxType: "Freight"
  }
};



var timeout = 20 * 1000;

describe.skip('TaxAssignment CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('TaxAssignment CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.TaxAssignment Model', function () {
      data.model = new XM.TaxAssignment();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.TaxAssignment', 'INIT Value should be XM.TaxAssignment');
    });

    it.skip('should create an XM.TaxAssignment Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it.skip('should read an XM.TaxAssignment Model', function () {
      assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
    });

    it.skip('should update an XM.TaxAssignment Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('number'), data.updateHash.number, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.TaxAssignment Model', function (done) {
      crud.destroy(data);
      done();
    });

  });
