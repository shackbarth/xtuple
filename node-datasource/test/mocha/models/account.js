/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true, it:true, describe:true */

//var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var crud = require('../lib/crud'),
    assert = require('chai').assert,
    expect = require('chai').expect,
    zombieAuth = require('../lib/zombie_auth'),

    data = {
      recordType: "XM.Account",
      autoTestAttributes: true,
      createHash: {
        number: "Test_account",
        name: "A test Account"
      },
      updateHash: {
        number: "updated_account"
      }
    };



  var timeout = 20 * 1000;

  describe('Account CRUD Test', function () {
      this.timeout(20 * 1000);
      it('should perform all the crud operations', function (done) {
        crud.runAllCrud(data, done);
      });
    });
/*
  describe.skip('Account CRUD Test', function () {
        before(function (done){
          this.timeout(timeout);
                zombieAuth.loadApp(done);
              });

              it('should be able to Initialize an XM.Account Model', function (){
                  data.model = new XM.Account();
                  expect(data.model).to.exist;
                  assert.equal(data.model.recordType, 'XM.Account', 'INIT Value should be XM.Account');
              });

              it('should create an XM.Account Model', function (){
                  data.model.set(data.createHash);
                  crud.save(data)
              });

              it('should read an XM.Account Model', function (){
                  assert.equal(data.model.get('name'), data.createHash.name, 'Model Code READ Value is equal')
              });

              it('should update an XM.Account Model', function (){
                  data.model.set(data.updateHash);
                  crud.save(data)
                  assert.equal(data.model.get('number'), data.updateHash.number, 'Model Code UPDATE Value is equal')
              });

              it('should delete an XM.Account Model', function (){
                  crud.destroy(data)
              });

  });
  */
}());
