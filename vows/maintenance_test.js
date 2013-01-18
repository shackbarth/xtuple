/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

  var vows = require('vows'),
      assert = require('assert'),
      zombie = require('zombie');
(function () {
  "use strict";

  vows.describe('Report route').addBatch({
    'a GET to the maintenance route': {
      topic: function () {
        zombie.visit('http://localhost:2000/maintenance?organization=dev&extensions=[1,2,3,4,5]', {maxWait: 100000}, this.callback);
      },
      'should run the maintenance script': function (err, browser, status) {
        var body, bodyObj;

        assert(browser.success);
        body = browser.text("body");
        assert(body);
        bodyObj = JSON.parse(body);
        assert.equal(bodyObj.status, "SUCCESS");
      }
    },
  }).export(module);
}());

