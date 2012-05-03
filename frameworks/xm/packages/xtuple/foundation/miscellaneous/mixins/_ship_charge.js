// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ShipCharge
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ShipCharge = {
  /** @scope XM.ShipCharge.prototype */
  
  className: 'XM.ShipCharge',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainShippingChargeTypes",
      "read": true,
      "update": "MaintainShippingChargeTypes",
      "delete": "MaintainShippingChargeTypes"
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
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isCustomerPay: SC.Record.attr(Boolean)

};
