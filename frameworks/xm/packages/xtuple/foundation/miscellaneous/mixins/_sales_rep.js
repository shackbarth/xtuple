// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.SalesRep
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._SalesRep = {
  /** @scope XM.SalesRep.prototype */
  
  className: 'XM.SalesRep',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainSalesReps",
      "read": true,
      "update": "MaintainSalesReps",
      "delete": "MaintainSalesReps"
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
  number: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type Number
  */
  commission: SC.Record.attr(Number, {
    defaultValue: 0
  })

};
