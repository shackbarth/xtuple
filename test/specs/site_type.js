/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    Because Sites may serve multiple purposes as- warehouses, stores, etc.the concept of Site
    Types allows you to categorize how Sites are used.
    @class
    @alias SiteType
    @property {String} Name
    @property {String} Description
  */
  var spec = {
    recordType: "XM.SiteType",
    collectionType: "XM.SiteTypeCollection",
    cacheName: "XM.siteTypes",
    listKind: "XV.SiteTypeList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof SiteType
      @description Site Types are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof SiteType
      @description The ID attribute is "name, which will not be automatically uppercased.
    */
    idAttribute: "name",
    enforceUpperKey: false,
    attributes: ["id", "name", "description"],
    requiredAttributes: ["name"],
    /**
      @member -
      @memberof SiteType
      @description Site Types can be read by users with "ViewSiteTypes" privilege and can be created, updated,
        or deleted by users with the "MaintainSiteTypes" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainSiteTypes",
      read: "ViewSiteTypes"
    },
    createHash: {
      name: "TestSiteType" + Math.random(),
      description: "Test Site Type"
    },
    updatableField: "description"
  };

  exports.spec = spec;

}());

