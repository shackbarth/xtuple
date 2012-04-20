// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Account.prototype */ { 
  
  target: 'XM.Account',

  body: {
  
    /**
      @type XM.Vendor
    */
    vendor: SC.Record.toOne('XM.Vendor', {
      label: '_vendor'.loc()
    })

  }

});
