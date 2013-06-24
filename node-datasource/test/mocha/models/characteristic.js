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
    recordType: "XM.Characteristic",
    autoTestAttributes: true,
    createHash: {
      name: "A test Characteristic",
      isItems: true
    },
    updateHash: {
      name: "updated characteristic"
    }
  };



var timeout = 20 * 1000;

describe.skip('Characteristic CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('Characteristic CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.Characteristic Model', function () {
      data.model = new XM.Characteristic();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.Characteristic', 'INIT Value should be XM.Characteristic');
    });

    it('should create an XM.Characteristic Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it('should read an XM.Characteristic Model', function () {
      assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
    });

    it('should update an XM.Characteristic Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('name'), data.updateHash.name, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.Characteristic Model', function (done) {
      crud.destroy(data);
      done();
    });

  });
