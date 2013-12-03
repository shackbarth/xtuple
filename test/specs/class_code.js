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
      idAttribute: "code",
      //extensions: ["crm", "project"], //Incident 22102
      extensions: ["crm"],
      isLockable: true,
      cacheName: "XM.classCodes",
      privileges: {
        createUpdateDelete: "MaintainClassCodes",
        //read: "ViewClassCodes" //Incident 22098
      },
      createHash: {
        code: "CCode" + Math.random(),
        description: 'Class Code Description'
      },
      updatableField: "code",
    };

  exports.spec = spec;

}());