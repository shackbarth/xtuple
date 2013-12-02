/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var async = require("async"),
    _ = require("underscore"),
    common = require("../lib/common"),
    assert = require("chai").assert;

  /**
    Email profile to be shared among sales business objects such as sales orders
      and quotes. Used by workflow for automated notifications.
    @class
    @alias SalesEmailProfile
    @property {String} name
    @property {String} description
    @property {String} from
    @property {String} replyTo
    @property {String} to
    @property {String} cc
    @property {String} bcc
    @property {String} subject
    @property {String} body
  */
  var spec = {
    recordType: "XM.SalesEmailProfile",
    collectionType: "XM.SalesEmailProfileCollection",
    cacheName: null,
    listKind: "XV.SalesEmailProfileList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof SalesEmailProfile
      @description Sales email profiles are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof SalesEmailProfile
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "name",
    enforceUpperKey: true,

    attributes: ["name", "description", "from", "replyTo", "to", "cc", "bcc", "subject", "body"],
    /**
      @member -
      @memberof SalesEmailProfile
      @description Used in the sales module
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof SalesEmailProfile
      @description Sales email profiles can be read by anyone and can be created, updated,
       or deleted by users with the "MaintainSalesEmailProfiles" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainSalesEmailProfiles",
      read: true
    },
    createHash: {
      name: "testSalesEmailProfile" + Math.random()
    },
    updatableField: "description"
  };
  exports.spec = spec;

}());


