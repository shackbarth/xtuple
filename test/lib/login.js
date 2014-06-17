/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require('../lib/zombie_auth'),
    prepDatabase = require('../lib/prep_database');

  describe('xTuple Login', function () {
    this.timeout(60 * 1000);

    it('should login', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should prepare database', function (done) {
      prepDatabase.prepDatabase(done);
    });

  });
}());
