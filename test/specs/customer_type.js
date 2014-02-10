/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    Customer Types are used to categorize the customers
    @class
    @alias CustomerType
    @property {String} code
    @property {String} description
  */
  var spec = {
    recordType: "XM.CustomerType",
    collectionType: "XM.CustomerTypeCollection",
    /**
      @member -
      @memberof CustomerType.prototype
      @description The Customer Types collection is cached.
    */
    cacheName: "XM.customerTypes",
    listKind: "XV.CustomerTypeList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof CustomerType.prototype
      @description CustomerTypes are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof CustomerType.prototype
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
    idAttribute: "code",
    enforceUpperKey: false,
    attributes: ["id", "code", "description"],
    requiredAttributes: ["code"],
    /**
      @member -
      @memberof CustomerType.prototype
      @description Used in the crm and project modules
    */
    extensions: ["sales"], //add purchasing
    /**
      @member -
      @memberof CustomerType.prototype
      @description CustomerTypes can be read by users with "ViewCustomerTypes" privilege
      and can be created, updated,or deleted by users with the "MaintainCustomerTypes" privilege
    */
    privileges: {
      createUpdateDelete: "MaintainCustomerTypes",
      read: "ViewCustomerTypes"
    },
    createHash: {
      code: "Cust" + Math.random(),
      description: "normal description"
    },
    updatableField: "description"
  };
  var additionalTests = function () {
    /**
      @member -
      @memberof CustomerType.prototype
      @description Length of Abbreviation field should not exceed 2, Currency Abbreviation
      and Currency Number should not exceed 3 and Currency Number value should be an integer
    */
    it.skip("Abbreviation length should not exceed 2", function () {
    });
    it.skip("Length of Currency Abbreviation should not exceed 3", function () {
    });
    it.skip("Currency Number value should be an integer and its length should not" +
    " exceed 3 ", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
