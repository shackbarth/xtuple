// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.GENERAL_LEDGER = SC.State.design({

  initialSubstate: 'DUMMY',

  enterState: function() {
    if (this.__movingUp__) {
      this.__movingUp__ = false;

      // Clear the selection. This is somewhat tricky to find...
      var listView = this.listContainer.get('contentSurface');
      if (listView) listView.set('selection', SC.IndexSet.create().freeze());
      return;
    }

    SC.routes.set('location', 'general-ledger');

    Postbooks.LoadModule("General Ledger", 'Journal GeneralLedger TrialBalance Budget FinancialStatement BankAccount'.w(), this);
  },

  exitState: function() {
    if (this.__movingUp__) return;
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  showGeneralLedger: function() {
    // Do nothing.
  },

  showDashboard: function() {
    this.gotoState('DASHBOARD');
  },

  showJournal: function() {
    this.gotoState('JOURNAL');
  },

  showGeneralLedgerSubmodule: function() {
    this.gotoState('GENERAL_LEDGER_SUBMODULE');
  },

  showTrialBalance: function() {
    this.gotoState('TRIAL_BALANCE');
  },

  showBudget: function() {
    this.gotoState('BUDGET');
  },

  showFinancialStatement: function() {
    this.gotoState('FINANCIAL_STATEMENT');
  },

  showBankAccount: function() {
    this.gotoState('BANK_ACCOUNT');
  },

  // SUBSTATES

  "DUMMY":                     SC.State, // HACK: Prevent "missing initial state" error message from SC.
  "JOURNAL":                   SC.State.plugin('Postbooks.JOURNAL'),
  "GENERAL_LEDGER_SUBMODULE":  SC.State.plugin('Postbooks.GENERAL_LEDGER_SUBMODULE'),
  "TRIAL_BALANCE":             SC.State.plugin('Postbooks.TRIAL_BALANCE'),
  "BUDGET":                    SC.State.plugin('Postbooks.BUDGET'),
  "FINANCIAL_STATEMENT":       SC.State.plugin('Postbooks.FINANCIAL_STATEMENT'),
  "BANK_ACCOUNT":              SC.State.plugin('Postbooks.BANK_ACCOUNT')

});
