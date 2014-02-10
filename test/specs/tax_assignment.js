/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
 Tax Assignments create a matrix used to find the Tax Codes to apply to an Item 
 given the Item's Tax Type and the Tax Zone with jurisdiction over the transaction.
 Nested Tax Codes, whose calculations are based on other Tax Codes are shown 
 as indented.
  @class
  @alias TaxAssignment
  @property {TaxZone} TaxZone
  @property {TaxType} TaxType
  @property {TaxCode} TaxCode
  **/

  var spec = {
    recordType: "XM.TaxAssignment",
    enforceUpperKey: false,
    collectionType: "XM.TaxAssignmentCollection",
    listKind: "XV.TaxAssignmentList",
    instanceOf: "XM.Model",
    attributes: ["id", "uuid", "taxZone", "taxType", "tax"],
    requiredAttributes: ["tax", "uuid"],
    /**
    @member -
    @memberof TaxAssignment
    @description The ID attribute is "uuid"
  */
    idAttribute: "uuid",
    /**
    @member -
    @memberof TaxAssignment
    @description Used in Sales module
  */
    extensions: ["sales"], 
    /**
    @member -
    @memberof TaxAssignment
    @description Tax Assignment is lockable and is not cached
  */
    isLockable: false,
    cacheName: null,
    /**
    @member -
    @memberof TaxAssignment
    @description Tax Assignments can be read by users with the "ViewTaxAssignments" privilege and can only be created, updated,
      or deleted by users with the "MaintainTaxAssignments" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainTaxAssignments",
      read: "ViewTaxAssignments" 
    },
    createHash: {
      tax: {code: "VATAX-A"},
      taxZone: {code: "GA TAX"},
      taxType: {name: "Adjustment"}
    },
    updateHash: {
    taxType: {name: "Freight"}
    },
    skipSmoke:true,
  };
  exports.spec = spec;
}());