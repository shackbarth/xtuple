/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, setTimeout:true, XT:true, XM:true, XV:true, process:true, module:true, require:true */

(function () {
  "use strict";

  describe('Long test', function () {
    this.timeout(15 * 1000);
    it('should catch any lingering timeout bugs', function (done) {
      setTimeout(function () {
        done();
      }, 14 * 1000);
    });
  });
}());
