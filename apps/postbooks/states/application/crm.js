// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.CRM = SC.State.design({

  enterState: function() {
    SC.routes.set('location', 'crm');
    // Postbooks.set('mainViewShowing', 'secure');
    // Postbooks.mainPage.mainPane.makeFirstResponder(Postbooks.mainPage.mainPane.getPath('mainView.contentView'));
    // 
    // Postbooks.LoadModule("CRM", 'Contact Account Opportunity Incident Project'.w());
    Postbooks.LoadModule("CRM", 'Contact Account Incident Project'.w()); // FIXME: Opporunity hangs the app.
  }

  // ACTIONS


  // SUBSTATES

});
