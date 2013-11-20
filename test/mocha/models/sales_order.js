/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
module:true, require:true, exports:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    crud = require("../lib/crud"),
    modelData = require("../lib/model_data"),
    assert = require("chai").assert;

  describe('Quote', function () {
    crud.runAllCrud(modelData.quoteData);
  });

  describe('Quote business logic', function () {
    it('should take the defaults from the customer', function (done) {
      var terms = new XM.Terms(),
        customer = new XM.CustomerProspectRelation(),
        quote = new XM.Quote(),
        initCallback = function () {
          terms.set({code: "COD"});
          customer.set({terms: terms, billtoContact: "Bob"});
          assert.equal(quote.getValue("terms.code"), "");
          quote.set({customer: customer});

          // customer.terms.code gets copied to terms.code
          assert.equal(quote.getValue("terms.code"), "COD");
          done();
        };

      quote.on('change:number', initCallback);
      quote.initialize(null, {isNew: true});
    });
  });
}());
