// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.RECEIVABLES = SC.State.design({

  enterState: function() {
    SC.routes.set('location', 'receivables');

    Postbooks.LoadModule("Receivables", 'Customer Invoice Receivable CashReceipt CustomerCreditCard'.w());
  },

  exitState: function() {
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  showReceivables: function() {
    // Do nothing.
  },

  showDashboard: function() {
    this.gotoState('DASHBOARD');
  }


  // SUBSTATES

});
