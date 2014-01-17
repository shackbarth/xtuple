/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  A classification applied to item sites which specifies how costs should
  be distributed to the general ledger whenever inventory is received,
  moved, consumed, produced, shipped, scrapped, or returned.
  @class
  @alias CostCategory
  @property {String} Code
  @property {String} Description
  **/

  var spec = {
      recordType: "XM.CostCategory",
      enforceUpperKey: true,
      collectionType: "XM.CostCategoryCollection",
      listKind: "XV.CostCategoryList",
      instanceOf: "XM.Document",
      attributes: ["code", "description"],
      /**
      @member -
      @memberof CostCategory.prototype
      @description The ID attribute is "code", which will be automatically uppercased.
    */
      idAttribute: "code",
      /**
      @member -
      @memberof CostCategory.prototype
      @description Used in the Sales and Inventory modules
    */
      extensions: ["sales"], //Incident 22101
      //extensions: ["inventory", "sales"], //Inventory is not in postbooks
      isLockable: true,
      cacheName: "XM.costCategories",
      /**
      @member -
      @memberof CostCategory.prototype
      @description Cost Categories can be read by users with privilege "ViewCostCategories" and can only be created, updated,
        or deleted by users with the "MaintainCostCategories" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainCostCategories",
        read: "ViewCostCategories" //Incident 22100
      },
      createHash: {
        code: "CostCategory" + Math.random(),
        description: 'Cost Category Description'
      },
      updatableField: "code",
    };

  exports.spec = spec;

}());