// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ShipZone
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ShipZone = {
  /** @scope XM.ShipZone.prototype */
  
  className: 'XM.ShipZone',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainShippingZones",
      "read": true,
      "update": "MaintainShippingZones",
      "delete": "MaintainShippingZones"
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
  description: SC.Record.attr(String)

};
