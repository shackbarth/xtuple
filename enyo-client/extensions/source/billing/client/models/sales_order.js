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

    cashReceipt.on('sync', function (cashReceipt, resp, options) {
      // XXX should this be moved to into a server-side transaction?
      cashReceipt.dispatch('XM.SalesOrder', 'addPayment', [cashReceipt.get('number'), that.get('number')], {
        success: function () {
          console.warn(arguments);
        },
        error: function () {
          // TODO delete saved CashReceipt if failed; irrelevant if/when moved into a transaction
          console.warn(arguments);
        }
      });
    });
    cashReceipt.save();
  };
};
