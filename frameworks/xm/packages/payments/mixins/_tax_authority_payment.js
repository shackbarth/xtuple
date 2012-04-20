// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxAuthorityPayment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._TaxAuthorityPayment = {
  /** @scope XM.TaxAuthorityPayment.prototype */
  
  className: 'XM.TaxAuthorityPayment',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainPayments",
      "read": "ViewPayments",
      "update": "MaintainPayments",
      "delete": "MaintainPayments"
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type XM.TaxAuthority
  */
  taxAuthority: SC.Record.toOne('XM.TaxAuthority', {
    label: '_taxAuthority'.loc()
  })

};
