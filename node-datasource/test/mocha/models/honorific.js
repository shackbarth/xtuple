/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  /**
    Usage:
    cd node-datasource/test/mocha
    mocha -R spec
  */

  var crud = require("../lib/crud"),
    assert = require("chai").assert,
    data = {
      recordType: "XM.Honorific",
      autoTestAttributes: true,
      createHash: {
        code: "Herr" + Math.random()
      },
      updateHash: {
        code: "Dame" + Math.random()
      }
    };

  describe('Honorific crud test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
/*

  Proof-of-concept: you *could* run this as many times as you want.

  describe('Honorific crud test', function (){
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

  describe('Honorific crud test', function (){
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });

*/
}());
