/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  An Inventory control mechanism used for categorizing items regardless of item type.
  Distinguished from product category, which categorizes sold items only.
  @class
  @alias ClassCode
  @property {String} Code
  @property {String} Description
  **/

  var spec = {
      recordType: "XM.ClassCode",
      enforceUpperKey: false,
      collectionType: "XM.ClassCodeCollection",
      listKind: "XV.ClassCodeList",
      instanceOf: "XM.Document",
      attributes: ["code", "description"],
      /**
        @member -
        @memberof ClassCode
        @description The ID attribute is "code", which will not be automatically uppercased.
      */
      idAttribute: "code",
      /**
        @member -
        @memberof ClassCode
        @description Used in the CRM and Project module
      */
      extensions: ["crm", "project"], 
      /**
        @member -
        @memberof ClassCode
        @description Class Codes are lockable.
      */
      isLockable: true,
      cacheName: "XM.classCodes",
      /**
        @member -
        @memberof ClassCode
        @description Class Codes can be read by users with "ViewClassCodes" privilege and can be created, updated,
          or deleted by users with the "MaintainClassCodes" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainClassCodes",
        read: "ViewClassCodes"
      },
      createHash: {
        code: "CCode" + Math.random(),
        description: 'Class Code Description'
      },
      updatableField: "code",
    };

  exports.spec = spec;

}());