XT.extensions.billing.extendSalesOrder = function () {
  'use strict';

  if (_.isUndefined(XM.SalesOrder)) {
    throw 'XM.SalesOrder is not defined';
  }

  /**
   * Post a Cash Receipt payment to a Sales Order
   */
  XM.SalesOrder.prototype.addPayment = function (cashReceipt) {
    var order = this;

    if (this.isDirty() || this.isNew()) {
      this.notify('Cannot add payment to an unsaved Sales Order');
      return;
    }

    cashReceipt.once('sync', function (cashReceipt, resp, options) {
      // XXX should this be moved to into a server-side transaction?
      order.dispatch('XM.SalesOrder', 'addPayment', [cashReceipt.get('number'), order.get('number')], {
        success: function (result) {
          if (result.paid) {
            order.trigger('payment:success');
          }
          else {
            // TODO better error message
            order.trigger('payment:error', 'not paid');
          }
        },
        error: function (error) {
          order.trigger('payment:error', error);
        }
      });
    });
    cashReceipt.save();
  };
};
