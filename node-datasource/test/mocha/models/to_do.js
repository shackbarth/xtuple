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
    recordType: "XM.ToDo",
    autoTestAttributes: true,
    createHash: {
      //dueDate: today,
      name: "Pass the VOWS tests"
    },
    updateHash: {
      name: "Updated"
    }
  };



var timeout = 20 * 1000;

describe.skip('ToDo CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('ToDo CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.ToDo Model', function () {
      data.model = new XM.ToDo();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.ToDo', 'INIT Value should be XM.ToDo');
    });

    it.skip('should create an XM.ToDo Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it.skip('should read an XM.ToDo Model', function () {
      assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
    });

    it.skip('should update an XM.ToDo Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('name'), data.updateHash.name, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.ToDo Model', function (done) {
      crud.destroy(data);
      done();
    });

  });
