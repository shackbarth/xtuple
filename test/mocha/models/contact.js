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
    recordType: "XM.Contact",
    autoTestAttributes: true,
    createHash: {
      firstName: "Michael",
      primaryEmail: "modonnell@xtuple.com"
    },
    updateHash: {
      firstName: "Mike"
    }
  };



var timeout = 20 * 1000;

describe.skip('Contact CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('Contact CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.Contact Model', function () {
      data.model = new XM.Contact();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.Contact', 'INIT Value should be XM.Contact');
    });

    it.skip('should create an XM.Contact Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it.skip('should read an XM.Contact Model', function () {
      assert.equal(data.model.get('firstName'), data.createHash.firstName, 'Model Code READ Value is equal');
    });

    it.skip('should update an XM.Contact Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('firstName'), data.updateHash.firstName, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.Contact Model', function (done) {
      crud.destroy(data);
      done();
    });

  });
