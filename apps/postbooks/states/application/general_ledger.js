// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.GENERAL_LEDGER = SC.State.design({

  enterState: function() {
    SC.routes.set('location', 'general-ledger');
    // Postbooks.set('mainViewShowing', 'secure');
    // Postbooks.mainPage.mainPane.makeFirstResponder(Postbooks.mainPage.mainPane.getPath('mainView.contentView'));
    // 
    Postbooks.LoadModule("General Ledger", 'Journal GeneralLedger TrialBalance Budget FinancialStatement BankAccount'.w());
  }

  // ACTIONS


  // SUBSTATES

});
