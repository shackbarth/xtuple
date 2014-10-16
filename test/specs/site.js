/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  var assert = require("chai").assert,
    smoke = require("../lib/smoke");

  /**
  Sites typically describe physical production and storage facilities. work centers, item sites, and site locations belong to sites.
  @class
  @alias Site
  **/
  var spec = {
    // smoke is ran in the inventory site spec
    skipSmoke: true,
    recordType: "XM.Site",
    collectionType: "XM.SiteCollection",
    /**
      @member -
      @memberof Sites.prototype
      @description The site collection is cached.
    */
    cacheName: "XM.sites",
    listKind: "XV.SiteList",
    instanceOf: "XM.Document",
    extensions: [],
    /**
      @member -
      @memberof Sites.prototype
      @description Sites are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Sites.prototype
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code", "address", "code", "comments", "contact", "description", "incoterms",
      "isActive", "siteType", "taxZone"],
    privileges: {
      createUpdateDelete: "MaintainWarehouses",
      view: true
    },
    createHash: {
      isActive: true,
      code: "NewSite" + Math.random(),
      siteType: {name: "MFG"}
    },
    updatableField: "description"
  };

  var additionalTests = function () {
    /**
      @member Setup
      @memberof Site.prototype
      @description Multiple Sites should not be allowed on Postbooks
    */
    it("Multiple Sites should not be allowed on Postbooks", function (done) {
      if (!XT.extensions.inventory) {
        assert.equal(XM.sites.length, 1);
        smoke.navigateToList(XT.app, "XV.SiteList");
        assert.isTrue(XT.app.$.postbooks.getActive().$.newButton.disabled);
        return done();
      }
      done();
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
