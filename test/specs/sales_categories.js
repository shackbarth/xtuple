/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Sales Categories are used to identify the General Ledger (G/L) Accounts to be used when
  processing the following:

  Non-Inventory Receivables Invoices

  Receivables Credit Memos (optional)

  Receivables Debit Memos (optional)

  Cash Receipts (optional)

  For example, when creating an Invoice for miscellaneous goods or services unrelated to Inventory,
  you must select a Sales Category, thereby identifying the G/L Accounts the sales transaction 
  will be distributed to. 
  @class
  @alias SalesCategory
  @property {String} Name
  @property {String} Description
  @property {Boolean} isActive
  **/

  var spec = {
      recordType: "XM.SalesCategory",
      enforceUpperKey: true,
      collectionType: "XM.SalesCategoryCollection",
      listKind: "XV.SalesCategoryList",
      instanceOf: "XM.Document",
      attributes: ["id", "isActive", "name", "description"],
      requiredAttributes: ["isActive", "name", "description"],
      /**
      @member -
      @memberof SalesCategory
      @description The ID attribute is "name", which will be automatically uppercased.
    */
      idAttribute: "name",
      /**
      @member -
      @memberof SalesCategory
      @description Used in Billing module
    */
      extensions: ["billing"], 
      isLockable: true,
      cacheName: "XM.salesCategories",
      /**
      @member -
      @memberof SalesCategory
      @description Sales Categories can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainSalesCategories" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainSalesCategories",
        read: "ViewSalesCategories" 
      },
      createHash: {
        isActive: true,
        name: "SalesCategory" + Math.random(),
        description: "Sales Category Description"
      },
      updatableField: "name",
      skipSmoke: true
    };
  var additionalTests = function () {
  /**
      @member -
      @memberof SalesCategory
      @description User can deactivate a Sales category opened for editing
      */
    it.skip("User can deactivate a Sales category opened for editing", function () {
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());