/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

  (function () {
  "use strict";

  /**
  Sites typically describe physical production and storage facilities. work centers, item sites, and site locations belong to sites.
  @class
  @alias Site
  **/
  exports.spec = {
    skipAll: true,
    // XXX very awkward
    recordType: "XM.Site"
  };
  var additionalTests = function () {
    /**
      @member Setup
      @memberof Site.prototype
      @description Multiple Item Sites should not be allowed on Postbooks
    */
    it.skip("Multiple Item Sites should not be allowed on Postbooks", function () {
    });
};

  exports.additionalTests = additionalTests;
}());