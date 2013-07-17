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
    recordType: "XM.IncidentResolution",
    autoTestAttributes: true,
    createHash: {
      description: "test account",
      name: "test IncidentResolution",
      order: 10
    },
    updateHash: {
      order: 20
    }
  };



var timeout = 20 * 1000;

describe.skip('IncidentResolution CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('IncidentResolution CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.IncidentResolution Model', function () {
      data.model = new XM.IncidentResolution();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.IncidentResolution', 'INIT Value should be XM.IncidentResolution');
    });

    it('should create an XM.IncidentResolution Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it('should read an XM.IncidentResolution Model', function () {
      assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
    });

    it('should update an XM.IncidentResolution Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('order'), data.updateHash.order, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.IncidentResolution Model', function (done) {
      crud.destroy(data);
      done();
    });

  });
