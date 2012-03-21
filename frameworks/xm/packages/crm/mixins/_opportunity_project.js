// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.OpportunityProject
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._OpportunityProject = {
  /** @scope XM.OpportunityProject.prototype */
  
  className: 'XM.OpportunityProject',

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
    @type XM.Opportunity
  */
  source: SC.Record.toOne('XM.Opportunity', {
    label: '_source'.loc()
  }),

  /**
    @type XM.ProjectInfo
  */
  project: SC.Record.toOne('XM.ProjectInfo', {
    isNested: true,
    label: '_project'.loc()
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String, {
    label: '_purpose'.loc()
  })

};
