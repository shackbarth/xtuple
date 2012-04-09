// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Incident.prototype */ { 
  
  target: 'XM.Incident',

  body: {
  
    /**
      @type XM.ReceivableInfo
    */
    receivable: SC.Record.toOne('XM.ReceivableInfo', {
      isNested: true,
      label: '_receivable'.loc()
    }),
  
    /**
      @type XM.IncidentCustomer
    */
    customers: SC.Record.toMany('XM.IncidentCustomer', {
      isNested: true,
      inverse: 'source',
      label: '_customers'.loc()
    })

  }

});
