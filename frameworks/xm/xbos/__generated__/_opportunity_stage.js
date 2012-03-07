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
XM._OpportunityStage = XM.Record.extend(
  /** @scope XM._OpportunityStage.prototype */ {
  
  className: 'XM.OpportunityStage',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainOpportunityStages",
      "read": true,
      "update": "MaintainOpportunityStages",
      "delete": "MaintainOpportunityStages"
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
    @type Number
  */
  name: SC.Record.attr(Number),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Boolean
  */
  deactivate: SC.Record.attr(Boolean)

});
