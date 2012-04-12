// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.PAYABLES = SC.State.design({

  enterState: function() {
    SC.routes.set('location', 'payables');
    // Postbooks.set('mainViewShowing', 'secure');
    // Postbooks.mainPage.mainPane.makeFirstResponder(Postbooks.mainPage.mainPane.getPath('mainView.contentView'));
    // 
    Postbooks.LoadModule("Payables", 'Vendor Voucher Payable PaymentApproval Payment'.w());
  }

  // ACTIONS


  // SUBSTATES

});
