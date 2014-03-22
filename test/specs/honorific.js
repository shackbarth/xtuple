/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    A title, such as Mr. or Mrs.
    @class
    @alias Honorific
  */
  var spec = {
    recordType: "XM.Honorific",
    collectionType: "XM.HonorificCollection",
    /**
      @member -
      @memberof Honorific.prototype
      @description The honorific collection is cached.
    */
    cacheName: "XM.honorifics",
    listKind: "XV.HonorificList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Honorific.prototype
      @description Honorifics are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Honorific.prototype
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["code"],
    /**
      @member -
      @memberof Honorific.prototype
      @description Used in the crm and project modules
    */
    extensions: ["crm", "project"],
    /**
      @member -
      @memberof Honorific.prototype
      @description Honorifics can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainTitles" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTitles",
      read: true
    },
    createHash: {
      code: "Herr" + Math.random()
    },
    updatableField: "code"
  };

  exports.spec = spec;

}());
