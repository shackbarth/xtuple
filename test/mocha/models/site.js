/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType: "XM.Site",
    autoTestAttributes: true,
    createHash: {
      code: "B2E2",
      description: "Between Egypt and Eritrea",
      siteType: {id: 2}
    },
    updateHash: {
      description: "Between England and Eire, PA"
    }
  };

var timeout = 20 * 1000;

describe('Site CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.Site Model', function () {
    data.model = new XM.Site();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Site', 'INIT Value should be XM.Site');
  });

  it('should create an XM.Site Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done()
  });

// Site will not be working until the patch to the database code is in place
  it.skip('should read an XM.Site Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
    assert.equal(data.model.get('siteType'), data.createHash.siteType, 'Model SiteType READ Value is equal');
  });

  it('should update an XM.Site Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal');
    done();
  });

  it('should delete an XM.Site Model', function (done) {
    crud.destroy(data);
    done();
  });


});

