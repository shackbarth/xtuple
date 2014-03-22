XT.extensions.billing.extendSalesOrder = function () {
  'use strict';

  if (_.isUndefined(XM.SalesOrder)) {
    throw 'XM.SalesOrder is not defined';
  }

  /**
   * Post a Cash Receipt payment to a Sales Order
   */
  XM.SalesOrder.prototype.addPayment = function (cashReceipt) {
    var that = this;

    if (this.isDirty() || this.isNew()) {
      this.notify('Cannot add payment to an unsaved Sales Order');
      return;
    }

    cashReceipt.once('sync', function (cashReceipt, resp, options) {
      // XXX should this be moved to into a server-side transaction?
      that.dispatch('XM.SalesOrder', 'addPayment', [cashReceipt.get('number'), that.get('number')], {
        success: function (result) {
          if (result.paid) {
            that.trigger('payment:success');
          }
          else {
            // TODO better error message
            that.trigger('payment:error', 'Not able to post payment');
          }
        },
        error: function (error) {
          that.trigger('payment:error', error);
        }
      });
    });
    cashReceipt.save();
  };
};
