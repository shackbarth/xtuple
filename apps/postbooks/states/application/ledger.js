// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

sc_require('states/module');

Postbooks.LEDGER = Postbooks.MODULE.design({

  route: 'ledger',
  title: "_ledger",
  submodules: 'Journal GeneralLedger TrialBalance Budget FinancialStatement BankAccount'.w(),

  // ACTIONS

  showJournal: function() {
    this.gotoState('JOURNAL');
  },

  showGeneralLedgerSubmodule: function() {
    this.gotoState('GENERAL_LEDGER');
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

  "JOURNAL":             SC.State.plugin('Postbooks.JOURNAL'),
  "GENERAL_LEDGER":      SC.State.plugin('Postbooks.GENERAL_LEDGER'),
  "TRIAL_BALANCE":       SC.State.plugin('Postbooks.TRIAL_BALANCE'),
  "BUDGET":              SC.State.plugin('Postbooks.BUDGET'),
  "FINANCIAL_STATEMENT": SC.State.plugin('Postbooks.FINANCIAL_STATEMENT'),
  "BANK_ACCOUNT":        SC.State.plugin('Postbooks.BANK_ACCOUNT')

});
