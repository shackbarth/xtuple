/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType : "XM.Country",
    autoTestAttributes : true,
    enforceUpperKey: true,
    createHash: {
      name: "DQ Islands",
      abbreviation: "DQ",
      currencyAbbreviation: "USD"
    },

    updateHash: {
      abbreviation: "qq"
    }
  };

var timeout = 20 * 1000;

describe.skip('Country CRUD Test', function () {
  this.timeout(20 * 1000);
  it('should perform all the crud operations', function (done) {
    crud.runAllCrud(data, done);
  });
});

describe('Country CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.Country Model', function () {
    data.model = new XM.Country();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Country', 'INIT Value should be XM.Country');
  });

  it('should create an XM.Country Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.Country Model', function () {
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal');
  });

  it('should update an XM.Country Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('abbreviation'), data.updateHash.abbreviation, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.Country Model', function (done) {
    crud.destroy(data);
    done();
  });

});
