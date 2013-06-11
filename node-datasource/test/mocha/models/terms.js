/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.Terms",
    autoTestAttributes : true,
    createHash: {
      code: "datTerm"
    },
    updateHash: {
      code: "updatedTerm"
    }
  };

var timeout = 20 * 1000;

describe('Terms CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.Terms Model', function () {
    data.model = new XM.Terms();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Terms', 'INIT Value should be XM.Terms');
  });

  it('should create an XM.Terms Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.Terms Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
  });

  it('should update an XM.Terms Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('code'), data.updateHash.code, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.Terms Model', function (done) {
    crud.destroy(data);
    done();
  });


});

