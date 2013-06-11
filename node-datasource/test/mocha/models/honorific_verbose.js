/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  zombieAuth = require('../lib/zombie_auth'),

  data = {
    recordType: "XM.Honorific",
    autoTestAttributes: true,
    createHash: {
      code: "Jedi"
    },
    updateHash: {
      code: "Sith"
    }
  };

var timeout = 20 * 1000;

describe('Honorific CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.Honorific Model', function () {
    data.model = new XM.Honorific();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Honorific', 'INIT Value should be XM.Honorific');
  });

  it('should create an XM.Honorific Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should read an XM.Honorific Model', function () {
    assert.equal(data.model.get('code'), data.createHash.code, 'Model Code READ Value is equal');
  });

  it('should update an XM.Honorific Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('code'), data.updateHash.code, 'Model Code UPDATE Value is equal');
    done();
  });

  it('should delete an XM.Honorific Model', function (done) {
    crud.destroy(data);
    done();
  });


});

