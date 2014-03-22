/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

//var XVOWS = XVOWS || {};
//(function () {
//  "use strict";
/*
var crud = require('../lib/crud'),
		assert = require('chai').assert,
		expect = require('chai').expect,
		zombieAuth = require('../lib/zombie_auth'),

   data = {
      recordType: "XM.Account",
      autoTestAttributes: true,
      createHash: {
        number: "test account",
        name: "A test Account"
      },
      updateHash: {
        number: "updated account"
      }
    };

describe('CRM Account', function (){
  this.timeout(20 * 1000);
  var account;

  before(function (done){
    var takeTheDefaults = function () {
      var initCallback = function () {
        //console.log(account.getStatusString());
        if (account.isReady()) {
          done();
        }
      };
      //Create a new Account; Verify the defaults.
      account = new XM.Account(),
      account.on('statusChange', initCallback);

      //account.on("all", function () {console.log(JSON.stringify(arguments))});
      account.initialize(null, {isNew: true});
    };
    zombieAuth.loadApp(takeTheDefaults);
  });

  describe('Verify New CRM Account', function () {
    it ('should default Active', function (){
      assert.equal(account.getValue("isActive"), true);
    });

    it ('Type Organization is default', function () {
      assert.equal(account.getValue("accountType"), "O");
    });

    it ('Owner is login user name', function () {

      try {
        loginData = require('../../shared/loginData');
      } catch (err) {
        console.log("Make sure you put your login credentials in the /test/shared/loginData.js file");
        process.exit(1);
      }
      //I do not like this hardcoded expected value - there should be a way to determin this
      assert.equal(account.getValue("owner.id"), "admin");
    });
  });
});
*/
