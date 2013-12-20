/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  var crud = require('../lib/crud');

  /**
  Freight Class is used to label specific freight types.
  TIP: Create your freight classes using a logical, hierarchical structure. This will make it easier to retrieve freight class information in the future.
  @class
  @alias FreightClass
  @property {String} Code
  @property {String} Description
  **/

  var spec = {
      recordType: "XM.FreightClass",
      enforceUpperKey: false,
      collectionType: "XM.FreightClassCollection",
      listKind: "XV.FreightClassList",
      instanceOf: "XM.Document",
      attributes: ["code", "description"],
      idAttribute: "code",
      extensions: ["sales"],
      isLockable: true,
      cacheName: "XM.freightClasses",
      privileges: {
        createUpdateDelete: "MaintainFreightClasses",
        read: "ViewFreightClasses"
      },
      createHash: {
        code: "Freight" + Math.random()
      },
      updatableField: "code",
      defaults: {
      }
    };

  exports.spec = spec;

}());