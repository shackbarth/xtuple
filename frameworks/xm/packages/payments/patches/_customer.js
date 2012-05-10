// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Customer.prototype */ { 
  
  target: 'XM.Customer',

  body: {
  
    /**
      @type XM.CustomerPayment
    */
    checks: SC.Record.toMany('XM.CustomerPayment', {
      label: '_checks'.loc()
    })

  }

});
