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
    recordType: "XM.Address",
    autoTestAttributes: true,
    createHash: {
      line1: "123 Main St"
    },
    updateHash: {
      line1: "456 Main St"
    }
  };




var timeout = 20 * 1000;

describe.skip('Address CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('Address CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.Address Model', function () {
      data.model = new XM.Address();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.Address', 'INIT Value should be XM.Address');
    });

    it.skip('should create an XM.Address Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it.skip('should read an XM.Address Model', function () {
      assert.equal(data.model.get('line1'), data.createHash.line1, 'Model Code READ Value is equal');
    });

    it.skip('should update an XM.Address Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('line1'), data.updateHash.line1, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.Address Model', function (done) {
      crud.destroy(data);
      done();
    });

  });
