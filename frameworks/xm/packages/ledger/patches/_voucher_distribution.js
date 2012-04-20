// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.VoucherDistribution.prototype */ { 
  
  target: 'XM.VoucherDistribution',

  body: {
  
    /**
      @type XM.LedgerAccount
    */
    ledgerAccount: SC.Record.toOne('XM.LedgerAccount', {
      isNested: true,
      label: '_ledgerAccount'.loc()
    })

  }

});
