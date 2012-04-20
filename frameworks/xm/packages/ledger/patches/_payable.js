// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Payable.prototype */ { 
  
  target: 'XM.Payable',

  body: {
  
    /**
      @type Date
    */
    distributionDate: SC.Record.attr(SC.DateTime, {
      format: '%Y-%m-%d',
      useIsoDate: false,
      label: '_distributionDate'.loc()
    }),
  
    /**
      @type XM.LedgerAccount
    */
    ledgerAccount: SC.Record.toOne('XM.LedgerAccount', {
      isNested: true,
      label: '_ledgerAccount'.loc()
    }),
  
    /**
      @type Number
    */
    journalNumber: SC.Record.attr(Number, {
      label: '_journalNumber'.loc()
    })

  }

});
