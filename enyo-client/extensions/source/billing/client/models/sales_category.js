/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  'use strict';

  XT.extensions.billing.initSalesCategoryModel = function () {
    /**
     * @class XM.SalesCategory
     * @extends XM.Document
     */
    XM.SalesCategory = XM.Document.extend(
      /** @scope XM.SalesCategory.prototype */ {

      recordType: 'XM.SalesCategory',
      documentKey: 'name',

      initialize: function () {
        //XM.Model.apply(this, arguments);
        this.meta = new Backbone.Model();
      },

      /**
       * @private
       * Determines if this is a child of an unposted invoice. Uses 'dispatch' 
       * to invoke queryUnpostedInvoice
       *
       * @see XM.SalesCategory#isDeactivateAllowed
       * @see XM.SalesCategory#queryUnpostedInvoice
       * @callback cb
       */
      queryUnpostedInvoice: function () {
        this.dispatch('XM.SalesCategory', 'queryUnpostedInvoiceRPC', [this.id], {
          success: _.bind(function (rpcResult) {
            this.meta.set('unpostedInvoices', rpcResult || [ ]);
          }, this),
          error: _.bind(this.meta.set, this, 'isDeactivateAllowed', false)
        });
      },

      /**
       * Trigger isDeactivateAllowed event. Determine if we can deactivate this
       * SalesCategory. Return false if there exist unposted invoices that
       * reference this and true otherwise.
       *
       * @see XV.SalesCategoryList#actions
       * @see XM.SalesCategory#queryUnpostedInvoice
       * @callback cb
       */
      isDeactivateAllowed: function () {
        this.meta.once('change:unpostedInvoices', function (self, invoices) {
          this.meta.set('isDeactivateAllowed', invoices.length === 0);
        }, this);

        this.queryUnpostedInvoice();
      },

      /**
       * Intended to be invoked by the SalesCategoryList deactivate action
       * prerequisite; passes the result of 'isDeactivateAllowed' into the
       * supplied callback.
       *
       * @see XM.SalesCategory#isDeactivateAllowed
       * @callback enableActionCallback
       */
      hasDeactivateActionPrerequisite: function (enableActionCallback) {
        this.meta.once('change:isDeactivateAllowed', function (self, allowed) {
          enableActionCallback(allowed);
        }, this);

        this.isDeactivateAllowed();
      }
    });

    /**
     * @class XM.SalesCategoryCollection
     * @extends XM.Collection
     */
    XM.SalesCategoryCollection = XM.Collection.extend({
      /** @scope XM.SalesCategory.prototype */
      model: XM.SalesCategory
    });

    XT.cacheCollection('XM.salesCategories', 'XM.SalesCategoryCollection');
  };

}());

