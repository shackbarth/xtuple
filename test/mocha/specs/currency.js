/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  'use strict';

  var async = require('async'),
    _ = require('underscore'),
    specs = require('../lib/specs'),
    smoke = require('../lib/smoke'),
    assert = require('chai').assert,
    additionalTests = function () {

    var usd, eur, gbp, btc, baseCurrency;

    beforeEach(function () {
      //usd = XM.Currency.findOrCreate('USD');
      eur = XM.Currency.findOrCreate('EUR');
      gbp = XM.Currency.findOrCreate('GBP');
      baseCurrency = usd;
      
      // defined in spec.createHash
      //btc = new XM.Currency(specs.currency.createHash);
      btc = XM.Currency.findOrCreate(specs.currency.createHash);

      assert.ok(usd);
      assert.ok(eur);
      assert.ok(gbp);
      assert.ok(btc);
      assert.ok(baseCurrency);
    });

    describe('toCurrency', function () {
      /*
      'should include an asynchronous prototype function "toCurrency" that' +
        'accepts a "to" currency, a value, an as of date, and options. It' +
        'should return the receiver.', function () {
        
        HINT: Review XM.Currency.toBase implementation.
      */

      it('An asychronous "success" callback in options should pass back the ' +
           'converted value of the currency', function () {
        
      });
      it('If the currency pased in is the same as the receiver, the value will be' +
        'forwarded to the success callback.', function () {

      });
      it('If the value passed in is zero, then zero will be forwarded to the callback.', function () {

      });
      it('Determine the exchange rate for the "from" currency where the effective' +
        'and expire dates are between the as of date.', function () {

      });
      it('Determine the exchange rate for the "to" currency where the effective and' +
        'expire dates are between the as of date.', function () {

      });
      it('If/when a server request is made for the above, the server should cache' +
        'the results of these queries to avoid making duplicate requests.', function () {

      });
      it('When when ratios for both currencies have been determined, the success' +
        'callback should forward the result of the calculation: ' +
        'value * toRate / fromRate', function () {

      });
      it('If either of the two ratios are not found, an error callback will be' +
        'forwarded.', function () {

      });
    });
  };

  exports.additionalTests = additionalTests;
})();
