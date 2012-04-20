// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.State
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._State = {
  /** @scope XM.State.prototype */
  
  className: 'XM.State',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainStates",
      "read": true,
      "update": "MaintainStates",
      "delete": "MaintainStates"
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
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  abbreviation: SC.Record.attr(String, {
    label: '_abbreviation'.loc()
  }),

  /**
    @type XM.Country
  */
  country: SC.Record.toOne('XM.Country', {
    label: '_country'.loc()
  })

};
