// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._State = XM.Record.extend(
  /** @scope XM._State.prototype */ {
  
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
  name: SC.Record.attr(String),

  /**
    @type String
  */
  abbreviation: SC.Record.attr(String),

  /**
    @type XM.Country
  */
  country: SC.Record.toOne('XM.Country')

});
