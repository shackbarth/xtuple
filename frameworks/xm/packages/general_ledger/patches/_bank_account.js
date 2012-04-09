// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.BankAccount.prototype */ { 
  
  target: 'XM.BankAccount',

  body: {
  
    /**
      @type XM.LedgerAccountInfo
    */
    ledgerAccount: SC.Record.toOne('XM.LedgerAccountInfo', {
      isNested: true,
      isRequired: true,
      label: '_ledgerAccount'.loc()
    })

  }

});
