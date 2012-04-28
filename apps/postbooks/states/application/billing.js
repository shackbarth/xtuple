// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

sc_require('states/module');

Postbooks.BILLING = Postbooks.MODULE.design({

  route: 'billing',
  title: "_billing",
  submodules: 'Customer Invoice Receivable CashReceipt'.w(),

  // ACTIONS

  showCustomer: function() {
    this.gotoState('CUSTOMER');
  },

  showInvoice: function() {
    this.gotoState('INVOICE');
  },

  showReceivable: function() {
    this.gotoState('RECEIVABLE');
  },

  showCashReceipt: function() {
    this.gotoState('CASH_RECEIPT');
  },

  showCustomerCreditCard: function() {
    this.gotoState('CUSTOMER_CREDIT_CARD');
  },

  // SUBSTATES

  "CUSTOMER":             SC.State.plugin('Postbooks.CUSTOMER'),
  "INVOICE":              SC.State.plugin('Postbooks.INVOICE'),
  "RECEIVABLE":           SC.State.plugin('Postbooks.RECEIVABLE'),
  "CASH_RECEIPT":         SC.State.plugin('Postbooks.CASH_RECEIPT'),
  "CUSTOMER_CREDIT_CARD": SC.State.plugin('Postbooks.CUSTOMER_CREDIT_CARD')

});
