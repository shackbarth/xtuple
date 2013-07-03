/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
    assert = require('chai').assert,
    expect = require('chai').expect,
    _ = require("underscore"),
    zombieAuth = require('../lib/zombie_auth'),
    data = {
    recordType: "XM.UserAccount",
    autoTestAttributes: true,
    createHash : {
      username : 'uname1',
      password : 'second',
      properName : 'Peter',
      isActive : true,
      locale : 'Default'
    },     
    updateHash: {
      properName : 'Parker'
    }
  },
  timeout = 20 * 1000;

describe('User Account CRUD Test', function () {
    before(function (done){
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

      it('should be able to Initialize an XM.UserAccount Model', function (){
        data.model = new XM.UserAccount();
        expect(data.model).to.exist;
        assert.equal(data.model.recordType, 'XM.UserAccount', 'INIT Value should be XM.UserAccount');
      });

      it('should create an XM.UserAccount Model', function (done){
        data.model.set(data.createHash);
        crud.save(data);
        done();
      });

      it('should read an XM.UserAccount Model', function (){
        assert.equal(data.model.get('properName'), data.createHash.properName, 'READ Value is equal')
      });

      it('should update an XM.UserAccount Model', function (done){
        data.model.set(data.updateHash);
        crud.save(data);
        assert.equal(data.model.get('properName'), data.updateHash.properName, 'Model Code UPDATE Value is equal');
        done();
      });

      it('should delete an XM.UserAccount Model', function (done){
        crud.destroy(data);
        done();
      });

});