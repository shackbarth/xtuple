// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.OpportunitySource
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._OpportunitySource = {
  /** @scope XM.OpportunitySource.prototype */
  
  className: 'XM.OpportunitySource',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainOpportunitySources",
      "read": true,
      "update": "MaintainOpportunitySources",
      "delete": "MaintainOpportunitySources"
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
  description: SC.Record.attr(String)

};
