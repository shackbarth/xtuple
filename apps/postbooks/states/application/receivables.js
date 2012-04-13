// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.RECEIVABLES = SC.State.design({

  initialSubstate: 'DUMMY',

  enterState: function() {
    if (this.__movingUp__) {
      this.__movingUp__ = false;
      return;
    }

    SC.routes.set('location', 'receivables');

    Postbooks.LoadModule("Receivables", 'Customer Invoice Receivable CashReceipt CustomerCreditCard'.w());
  },

  exitState: function() {
    if (this.__movingUp__) return;
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  showReceivables: function() {
    // Do nothing.
  },

  showDashboard: function() {
    this.gotoState('DASHBOARD');
  },

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

  "DUMMY":                 SC.State, // HACK: Prevent "missing initial state" error message from SC.
  "CUSTOMER":              SC.State.plugin('Postbooks.CUSTOMER'),
  "INVOICE":               SC.State.plugin('Postbooks.INVOICE'),
  "RECEIVABLE":            SC.State.plugin('Postbooks.RECEIVABLE'),
  "CASH_RECEIPT":          SC.State.plugin('Postbooks.CASH_RECEIPT'),
  "CUSTOMER_CREDIT_CARD":  SC.State.plugin('Postbooks.CUSTOMER_CREDIT_CARD')

});
