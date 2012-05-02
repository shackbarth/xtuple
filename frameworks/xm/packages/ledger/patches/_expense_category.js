// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.ExpenseCategory.prototype */ { 
  
  target: 'XM.ExpenseCategory',

  body: {
  
    /**
      @type XM.LedgerAccount
    */
    expenseLedgerAccount: SC.Record.toOne('XM.LedgerAccount', {
      isRequired: true
    }),
  
    /**
      @type XM.LedgerAccount
    */
    liabilityLedgerAccount: SC.Record.toOne('XM.LedgerAccount', {
      isRequired: true
    }),
  
    /**
      @type XM.LedgerAccount
    */
    varianceLedgerAccount: SC.Record.toOne('XM.LedgerAccount', {
      isRequired: true
    }),
  
    /**
      @type XM.LedgerAccount
    */
    freightLedgerAccount: SC.Record.toOne('XM.LedgerAccount', {
      isRequired: true
    })

  }

});
