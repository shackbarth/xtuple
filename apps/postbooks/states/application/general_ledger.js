// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.GENERAL_LEDGER = SC.State.design({

  enterState: function() {
    SC.routes.set('location', 'general-ledger');

    Postbooks.LoadModule("General Ledger", 'Journal GeneralLedger TrialBalance Budget FinancialStatement BankAccount'.w());
  },

  exitState: function() {
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  showGeneralLedger: function() {
    // Do nothing.
  },

  showDashboard: function() {
    this.gotoState('DASHBOARD');
  }


  // SUBSTATES

});
