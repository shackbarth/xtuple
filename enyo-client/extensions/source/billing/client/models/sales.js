/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.billing.initSalesCategoryModel = function () {
    /**
     * @class XM.SalesCategory
     * @extends XM.Document
     */
    XM.SalesCategory = XM.Document.extend(
      /** @scope XM.SalesCategory.prototype */ {

      recordType: 'XM.SalesCategory',
      documentKey: 'name',
      isDocumentAssignment: true
    });

    /**
     * @class XM.SalesCategoryCollection
     * @extends XM.Collection
     */
    XM.SalesCategoryCollection = XM.Collection.extend({
      /** @scope XM.SalesCategory.prototype */
      model: XM.SalesCategory
    });

    XT.cacheCollection("XM.salesCategories", "XM.SalesCategoryCollection");
  };

}());

