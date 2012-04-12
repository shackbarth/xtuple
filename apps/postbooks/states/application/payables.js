// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.PAYABLES = SC.State.design({

  enterState: function() {
    SC.routes.set('location', 'payables');

    Postbooks.LoadModule("Payables", 'Vendor Voucher Payable PaymentApproval Payment'.w());
  },

  exitState: function() {
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  showPayables: function() {
    // Do nothing.
  },

  showDashboard: function() {
    this.gotoState('DASHBOARD');
  }


  // SUBSTATES

});
