// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.VendorPayment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._VendorPayment = {
  /** @scope XM.VendorPayment.prototype */
  
  className: 'XM.VendorPayment',

  

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
    @type XM.Vendor
  */
  vendor: SC.Record.toOne('XM.Vendor', {
    label: '_vendor'.loc()
  })

};
