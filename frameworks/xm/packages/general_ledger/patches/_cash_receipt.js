// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.CashReceipt.prototype */ { 
  
  target: 'XM.CashReceipt',

  body: {
  
    /**
      @type XM.SalesCategory
    */
    salesCategory: SC.Record.toOne('XM.SalesCategory', {
      isRequired: true,
      defaultValue: -1,
      label: '_salesCategory'.loc()
    }),
  
    /**
      @type XM.CashReceiptDistribution
    */
    distributions: SC.Record.toMany('XM.CashReceiptDistribution', {
      isNested: true,
      inverse: 'cashReceipt',
      label: '_distributions'.loc()
    })

  }

});
