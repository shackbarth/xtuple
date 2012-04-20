// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ShipVia
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ShipVia = {
  /** @scope XM.ShipVia.prototype */
  
  className: 'XM.ShipVia',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainShipVias",
      "read": true,
      "update": "MaintainShipVias",
      "delete": "MaintainShipVias"
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
  code: SC.Record.attr(String, {
    isRequired: true,
    label: '_code'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  })

};
