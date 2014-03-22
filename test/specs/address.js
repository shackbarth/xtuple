/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Addresses may be associated with and shared by Contacts, Sites, Ship-to Addresses, Vendors, and Vendor Addresses.
  @class
  @alias Address
  @property {String} Number
  @property {Boolean} isActive
  @property {String} line1
  @property {String} line2
  @property {String} line3
  @property {String} City
  @property {String} State
  @property {String} Postal Code
  @property {String} Country
  @property {String} Notes
  @property {Comment} Comments
  @property {Characteristics} Characteristics
  @property {Account} CRMAccountUsers
  **/
  var spec = {
    recordType: "XM.Address",
    collectionType: null,
    enforceUpperKey: true,
    listKind: "XV.AddressList",
    instanceOf: "XM.Document",
    attributes: ["id", "number", "isActive", "line1", "line2", "line3", "city", "state", "postalCode", "country", "notes", "comments", "characteristics", "crmaccountUsers"],
    requireAttributes: ["number"],
    /**
      @member -
      @memberof Address.prototype
      @description The ID attribute is "number", which will not be automatically uppercased.
    */
    idAttribute: "number",
    /**
      @member -
      @memberof Address.prototype
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof Address.prototype
      @description Addresses are lockable.
    */
    isLockable: true,
    /**
    @member -
    @memberof Address.prototype
    @description Address has no cached defined
    */
    cacheName: null,
    /**
      @member -
      @memberof Address.prototype
      @description Addresses can be read by users with "ViewAddresses" privilege and can be created, updated,
        or deleted by users with the "MaintainAddresses" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainAddresses",
      read: "ViewAddresses"
    },
    skipSmoke: true,
    createHash: {
      line1: "123 Main St"
    },
    updatableField: "line1"
  };
  var additionalTests = function () {
    /**
      @member -
      @memberof Address.prototype
      @description Selecting 'Edit' button in the 'ADDRESS' panel of a record should open new Address
        workspace
    */
    it.skip("Selecting 'Edit' button in the 'ADDRESS' panel of a record should open new Address" +
    "workspace", function () {
    });
    /**
      @member -
      @memberof Address.prototype
      @description Selecting 'Search' button in the 'ADDRESS' panel of a record should display the
        Addresses list
    */
    it.skip("Selecting 'Search' button in the 'ADDRESS' panel of a record should display the" +
      "ADDRESSES list", function () {
    });
    /**
      @member -
      @memberof Address.prototype
      @description Editing an address shared by multiple records should display a confirmation dialog
      'There are multiple records sharing this address. Would you like to update the address
      across all of them?'
     */
    it.skip("Editing an address shared by multiple records should display a confirmation dialog" +
      "'There are multiple records sharing this address. Would you like to update the address" +
      "across all of them?", function () {
    });
    /**
      @member -
      @memberof Address.prototype
      @description - Selecting 'Yes' in the dialog should update the across all the records
    */
    it.skip("Selecting 'Yes' in the dialog should update the address across all the records", function () {
    });
    /**
      @member -
      @memberof Address.prototype
      @description - Selecting 'No' in the dialog should update only the current record
    */
    it.skip("Selecting 'No' in the dialog should update only the current record", function () {
    });
    /**
      @member -
      @memberof Address.prototype
      @description - Selecting 'Cancel' in the dialog should undo the changes on the
      current record
    */
    it.skip("Selecting 'Cancel' in the dialog should undo the changes on the" +
      "current record", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
