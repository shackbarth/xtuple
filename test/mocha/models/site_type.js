/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.SiteType",
    autoTestAttributes : true,
    createHash: {
      name: "FUDGE",
      description: "A site specializing in fudge"
    },
    updateHash: {
      description: "A site with an exclusive fudge partnership with L.A. Burdick, Inc."
    }
  };

var timeout = 20 * 1000;

describe('SiteType CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.SiteType Model', function () {
    data.model = new XM.SiteType();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.SiteType', 'INIT Value should be XM.SiteType');
  });

  it('should create an XM.SiteType Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.SiteType Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal');
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal');
  });

  it('should update an XM.SiteType Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal');
    done();
  });

  it('should delete an XM.SiteType Model', function (done) {
    crud.destroy(data);
    done();
  });


});

