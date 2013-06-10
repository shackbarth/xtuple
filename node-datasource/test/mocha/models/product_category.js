/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.ProductCategory",
    autoTestAttributes : true,
    createHash : {
      code : 'CLASSIC-WOOD1',
      description : 'Product Category Description'
    },
    updateHash : {
      description : 'Updated Description'
    }
  };

var timeout = 20 * 1000;

describe('ProductCategory CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.ProductCategory Model', function () {
    data.model = new XM.ProductCategory();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.ProductCategory', 'INIT Value should be XM.ProductCategory');
  });

  it('should create an XM.ProductCategory Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.ProductCategory Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
  });

  it('should update an XM.ProductCategory Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal');
    done();
  });

  it('should delete an XM.ProductCategory Model', function (done) {
    crud.destroy(data);
    done();
  });


});

