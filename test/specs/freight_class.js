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
  TIP: Create your freight classes using a logical, hierarchical structure. 
  This will make it easier to retrieve freight class information in the future.
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
      /**
      @member -
      @memberof FreightClass.prototype
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
      idAttribute: "code",
      /**
      @member -
      @memberof FreightClass.prototype
      @description Used in the sales modules
    */
      extensions: ["sales"],
      /**
      @member -
      @memberof FreightClass.prototype
      @description FreightClasses are lockable.
    */
      isLockable: true,
      /**
      @member -
      @memberof FreightClass.prototype
      @description The Freight Classes collection is cached.
    */
      cacheName: "XM.freightClasses",
      /**
      @member -
      @memberof FreightClass.prototype
      @description FreightClasses can be read by users with "ViewFreightClasses"
      privilege and can be created, updated, or deleted by users with the "MaintainFreightClasses"
      privilege.
    */
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