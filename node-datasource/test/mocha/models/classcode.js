/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.ClassCode",
    autoTestAttributes : true,
    createHash : {
      code: 'test code',
      description: 'code description'
    },
    updateHash : {
      description : 'update description'
    }
  };

var timeout = 20 * 1000;

describe.skip('Class Code CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

describe('Class Code CRUD Test', function () {
    before(function (done) {
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

    it('should be able to Initialize an XM.ClassCode Model', function () {
      data.model = new XM.ClassCode();
      expect(data.model).to.exist;
      assert.equal(data.model.recordType, 'XM.ClassCode', 'INIT Value should be XM.ClassCode');
    });

    it('should create an XM.ClassCode Model', function (done) {
      data.model.set(data.createHash);
      crud.save(data);
      done();
    });

    it('should read an XM.ClassCode Model', function () {
      assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
    });

    it('should update an XM.ClassCode Model', function (done) {
      data.model.set(data.updateHash);
      crud.save(data);
      assert.equal(data.model.get('description'), data.updateHash.description, 'Model Code UPDATE Value is equal');
      done();
    });

    it('should delete an XM.ClassCode Model', function (done) {
      crud.destroy(data);
      done();
    });

  });

