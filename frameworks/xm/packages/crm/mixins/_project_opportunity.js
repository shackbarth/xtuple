// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProjectOpportunity
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ProjectOpportunity = {
  /** @scope XM.ProjectOpportunity.prototype */
  
  className: 'XM.ProjectOpportunity',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
      "delete": true
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
    @type XM.Project
  */
  source: SC.Record.toOne('XM.Project'),

  /**
    @type XM.OpportunityInfo
  */
  opportunity: SC.Record.toOne('XM.OpportunityInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String)

};
