/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Items that are sold are assigned a Product Category
  @class
  @alias ProductCategory
  @property {String} Code
  @property {String} Description
  **/
  var spec = {
    recordType: "XM.ProductCategory",
    enforceUpperKey: false,
    collectionType: "XM.ProductCategoryCollection",
    listKind: "XV.ProductCategoryList",
    instanceOf: "XM.Document",
    attributes: ["id", "code", "description"],
    /**
      @member -
      @memberof ProductCategory.prototype
      @description The ID attribute is "code", which will not be automatically uppercased.
    */
    idAttribute: "code",
    /**
      @member -
      @memberof ProductCategory.prototype
      @description Used in the crm module
    */
    extensions: ["crm"],
    /**
      @member -
      @memberof ProductCategory.prototype
      @description ProductCategories are lockable.
    */
    isLockable: true,
    /**
    @member -
    @memberof ProductCategory.prototype
    @description The Product category collection is cached.
    */
    cacheName: "XM.productCategories",
    /**
      @member -
      @memberof ProductCategory.prototype
      @description ProductCategories can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainProductCategories" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainProductCategories",
      read: true
    },
    createHash : {
      code : 'CLASSIC-WOOD1' + Math.random(),
      description : 'Product Category Description'
    },
    updatableField: "description"
  };
  exports.spec = spec;
}());
