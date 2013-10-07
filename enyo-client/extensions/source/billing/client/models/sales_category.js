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
     * @author Travis Webb <travis@xtuple.com>
     */
    XM.SalesCategory = XM.Document.extend(
      /** @scope XM.SalesCategory.prototype */ {

      recordType: 'XM.SalesCategory',
      documentKey: 'name',

      /**
       * @member {Backbone.Model}
       * Used to listen on metadata change events without disturbing the
       * underlying.
       */
      meta: null,

      initialize: function () {
        XM.Document.prototype.initialize.apply(this, arguments);
        this.meta = new Backbone.Model();
      },

      /**
       * Determines if this is a child of an unposted invoice.
       *
       * @fires XM.Model#dispatch
       * @fires XM.SalesCategory#change:unpostedInvoices
       *
       * @see XM.SalesCategory#isDeactivateAllowed
       * @see XM.SalesCategory#queryUnpostedInvoice
       */
      queryUnpostedInvoice: function () {
        /**
         * Invoke the queryUnpostedInvoice remote procedure call
         * @event XM.Model#dispatch
         */
        this.dispatch('XM.SalesCategory', 'queryUnpostedInvoiceRPC', [this.id], {
          success: _.bind(function (rpcResult) {
            this.meta.set('unpostedInvoices', rpcResult || [ ]);
          }, this),
          error: _.bind(this.meta.set, this, 'isDeactivateAllowed', false)
        });
      },

      /**
       * Determine if we can deactivate this SalesCategory. Return false if
       * there exist unposted invoices that reference this and true otherwise.
       *
       * @fires XM.SalesCategory#change:isDeactivateAllowed
       * @see XM.SalesCategory#queryUnpostedInvoice
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
       * @see XV.SalesCategoryList#actions
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
      model: XM.SalesCategory
    });

    XT.cacheCollection('XM.salesCategories', 'XM.SalesCategoryCollection');
  };

}());

