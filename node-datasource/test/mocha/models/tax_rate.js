/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
    assert = require('chai').assert,
    expect = require('chai').expect,
    _ = require("underscore"),
    zombieAuth = require('../lib/zombie_auth');
var data = {
    recordType: "XM.TaxRate",
    autoTestAttributes: true,
    createHash : {
      amount : '10',
      percent : '5',
      effectiveDate : '9/2/13',
      expirationDate : '10/2/13',
      tax : 'NC TAX-A',
      currency : 'USD'
    },     
    updateHash: {
      amount: '20'
    }
  },
  timeout = 20 * 1000;

describe('Tax rate CRUD Test', function () {
    before(function (done){
        this.timeout(timeout);
        zombieAuth.loadApp(done);
      });

      it('should be able to Initialize an XM.TaxRate Model', function (){
        data.model = new XM.TaxRate();
        expect(data.model).to.exist;
        assert.equal(data.model.recordType, 'XM.TaxRate', 'INIT Value should be XM.TaxRate');
      });

      it('should create an XM.TaxRate Model', function (done){
        data.model.set(data.createHash);
        crud.save(data);
        done();
      });

      it('should read an XM.TaxRate Model', function (){
        assert.equal(data.model.get('amount'), data.createHash.amount, 'READ Value is equal');
      });

      it('should update an XM.TaxRate Model', function (done){
        data.model.set(data.updateHash);
        crud.save(data);
        done();
      });
      it('Verify the value is updated', function (){
        assert.equal(data.model.get('amount'), data.updateHash.amount, 'Model Code UPDATE Value is equal');
      });
      it('should delete an XM.TaxRate Model', function (done){
        crud.destroy(data);
        done();
      });

});