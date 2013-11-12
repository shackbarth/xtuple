XT.extensions.billing.initSalesCategoryModel = function () {
  'use strict';

  /**
   * @class XM.SalesCategory
   * @extends XM.Document
   * @author travis@xtuple.com
   */
  XM.SalesCategory = XM.Document.extend({
    recordType: 'XM.SalesCategory',
    idAttribute: 'name',
    documentKey: 'name',

    /**
     * Determines whether this is a child of an unposted invoice.
     *
     * @see XM.SalesCategory#canDeactivate
     * @see XM.SalesCategory#queryUnpostedInvoices
     */
    getUnpostedInvoices: function () {
      this.dispatch('XM.SalesCategory', 'queryUnpostedInvoices', [this.id], {
        /**
         * Forward the dispatch/rpc response as an event for whoever may be
         * interested in listening for it.
         * @fires XM.SalesCategory#change:unpostedInvoices
         */
        success: _.bind(this.trigger, this, 'change:unpostedInvoices'),
        /**
         * On error, an event informs listeners that canDeactivate
         * is set to false.
         * @fires XM.SalesCategory#change:canDeactivate
         */
        error:   _.bind(this.trigger, this, 'change:canDeactivate', false)
      });
    },

    /**
     * Determine whether we can deactivate this SalesCategory.
     *
     * @param {Function} [callback=this.trigger]  invoked when canDeactivate 
     *    has been determined.
     *
     * @listens change:unpostedInvoices
     * @fires XM.SalesCategory#change:canDeactivate
     * @callback after
     * @see XM.SalesCategory#getUnpostedInvoices
     */
    canDeactivate: function (callback) {
      var that = this,
       /**
        * Check base 'canDeactivate' conditions to determine whether querying
        * the server will be necessary.
        *
        * @private @inner @function
        * @returns {Boolean} true if all conditions met, false otherwise
        */
        prequalify = _(_.all).bind(this, [
          this.get('isActive'),
          this.canEdit('isActive'),
          this.canUpdate()
        ]),

        /**
         * @callback
         * Invoked after it is determined if there are unposted invoices that
         * reference this model.
         */
        afterUnpostedInvoicesChange = function (unpostedInvoices) {
          var canDeactivate = prequalify() && !unpostedInvoices;
          that.trigger('change:canDeactivate', canDeactivate);

          if (_.isFunction(callback)) {
            callback(canDeactivate);
          }
        };

      // if I don't prequalify for canDeactivate, fail immediately.
      if (!prequalify()) {
        return callback(false);
      }

      this.once('change:unpostedInvoices', afterUnpostedInvoicesChange);
      this.getUnpostedInvoices();
    },

    /**
     * Intended to be invoked by the SalesCategoryList deactivate action
     * prerequisite; passes the result of 'canDeactivate' into the
     * supplied callback.
     *
     * @listens change:canDeactivate
     * @callback enableActionCallback
     * @see XV.SalesCategoryList#actions
     * @see XM.SalesCategory#canDeactivate
     */
    hasDeactivateActionPrerequisite: function (enableActionCallback) {
      this.once('change:canDeactivate', enableActionCallback);
      this.canDeactivate();
    },

    /**
     * Deactivate this SalesCategory.
     */
    deactivate: function () {
      var afterSave = function (model) {
          model.releaseLock();
        },
        afterFetch = function (model) {
          // model is already deactivated
          if (!model.get('isActive')) {
            model.releaseLock();
            return;
          }
          model.save({ isActive: false }, {
            success: afterSave
          });
        };
      this.fetch({ success: afterFetch });
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
