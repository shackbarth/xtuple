/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require('../lib/zombie_auth'),
    prepDatabase = require('../lib/prep_database');

  describe('The zombie login process', function () {
    it('should work if we give it enough time', function (done) {
      this.timeout(10 * 60 * 1000);
      zombieAuth.loadApp({refreshLogin: true, callback: done});
    });
    it('will need some database prep', function (done) {
      this.timeout(10 * 1000);
      prepDatabase.prepDatabase(done);
    });
  });

}());
