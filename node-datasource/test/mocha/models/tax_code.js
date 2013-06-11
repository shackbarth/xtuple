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
    recordType: "XM.TaxCode",
    autoTestAttributes: true,
    createHash: {
      code: "asdf"
    },
    updateHash: {
      code: "fdsa"
    }
  };



var timeout = 20 * 1000;

describe.skip('Tax Code CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('Tax Code CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.TaxCode Model', function () {
      data.model = new XM.TaxCode();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.TaxCode', 'INIT Value should be XM.TaxCode');
    });

    it('should create an XM.TaxCode Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it('should read an XM.TaxCode Model', function () {
      assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
    });

    it('should update an XM.TaxCode Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('number'), data.updateHash.number, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.TaxCode Model', function (done) {
      crud.destroy(data);
      done();
    });

  });
