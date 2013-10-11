/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true, expr:true */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  'use strict';

  /**
   * @class XM.SalesCategory
   * @extends XM.Document
   * @author Travis Webb <travis@xtuple.com>
   */
  XM.SalesCategory = XM.Document.extend({
    recordType: 'XM.SalesCategory',
    idAttribute: 'name',

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
         * @fires XM.SalesCategory#set:unpostedInvoices
         */
        success: _.bind(this.trigger, this, 'set:unpostedInvoices'),
        /**
         * On error, an event informs listeners that canDeactivate
         * is set to false.
         * @fires XM.SalesCategory#onCanDeactivateChange
         */
        error:   _.bind(this.trigger, this, 'onCanDeactivateChange', false)
      });
    },

    /**
     * Apply additional constraints for the isActive field. Specifically, if
     * isActive is true, automatically disable editing.
     *
     * @override
     * @see XM.ModelMixin#canEdit
     */
    canEdit: function (attr) {
      return _.all([
        (attr !== 'isActive' || this.get('isActive') === false),
        this._super('canEdit', attr)
      ]);
    },

    /**
     * Determine whether we can deactivate this SalesCategory.
     *
     * @param {Function} [callback=this.trigger]  invoked when canDeactivate 
     *    has been determined.
     *
     * @listens set:unpostedInvoices
     * @fires XM.SalesCategory#onCanDeactivateChange
     * @callback after
     * @see XM.SalesCategory#getUnpostedInvoices
     */
    canDeactivate: function (callback) {
      console.log("canDeactivate");
      /**
       * Check base 'canDeactivate' conditions to determine whether querying
       * the server will be necessary.
       *
       * @private @inner @function
       * @returns {Boolean} true if all conditions met, false otherwise
       */
      var prequalify = _(_.all).bind(this, [
        this.get('isActive'),
        this.canEdit('isActive'),
        this.hasLockKey(),
        this.canUpdate()
      ]);

      _(callback).wrap(function (callback, canDeactivate) {
        this.trigger('onCanDeactivateChange', canDeactivate);
        if (_.isFunction(callback)) {
          callback(canDeactivate);
        }
      }, this);

      // if I don't prequalify for canDeactivate, fail immediately.
      if (!prequalify()) {
        return callback(false);
      }

      this.once('set:unpostedInvoices', function (unpostedInvoices) {
        callback(prequalify() && !unpostedInvoices);
      }, this);

      this.getUnpostedInvoices();
    },

    /**
     * Intended to be invoked by the SalesCategoryList deactivate action
     * prerequisite; passes the result of 'canDeactivate' into the
     * supplied callback.
     *
     * @listens onCanDeactivateChange
     * @callback enableActionCallback
     * @see XV.SalesCategoryList#actions
     * @see XM.SalesCategory#canDeactivate
     */
    hasDeactivateActionPrerequisite: function (enableActionCallback) {
      this.once('onCanDeactivateChange', enableActionCallback);
      this.canDeactivate();
    },

    /**
     * Extend XM.Model.save to include the ability to mutate the model without
     * fetching an Editable version of it.
     *
     * @override
     * @see XM.Model#save
     * [@linkcode Backbone.Model.save()]{http://backbonejs.org/docs/backbone.html#section-56}
     */
    save: function (key, val, options) {
      console.log("SalesCategory#save()");
      this.once('lock:acquire', function () {
        console.log("acquired lock");
        Backbone.Model.prototype.save.apply(this, arguments);
      }, this);
    },

    /**
     * Deactivate this SalesCategory.
     */
    deactivate: function () {
      this.save({ isActive: false });
    }

  });

  /**
   * @class XM.SalesCategoryCollection
   * @extends XM.Collection
   */
  XM.SalesCategoryCollection = XM.Collection.extend({
    model: XM.SalesCategory
  });

  XT.extensions.billing.initSalesCategoryModel = function () {
    XT.cacheCollection('XM.salesCategories', 'XM.SalesCategoryCollection');
  };

}());

