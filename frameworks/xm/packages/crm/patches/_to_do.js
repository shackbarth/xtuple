// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.ToDo.prototype */ { 
  
  target: 'XM.ToDo',

  body: {
  
    /**
      @type XM.AccountInfo
    */
    account: SC.Record.toOne('XM.AccountInfo', {
      isNested: true
    }),
  
    /**
      @type XM.IncidentInfo
    */
    incident: SC.Record.toOne('XM.IncidentInfo', {
      isNested: true
    }),
  
    /**
      @type XM.OpportunityInfo
    */
    opportunity: SC.Record.toOne('XM.OpportunityInfo', {
      isNested: true
    }),
  
    /**
      @type XM.ToDoIncident
    */
    incidents: SC.Record.toMany('XM.ToDoIncident', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.ToDoProject
    */
    projects: SC.Record.toMany('XM.ToDoProject', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.ToDoOpportunity
    */
    opportunities: SC.Record.toMany('XM.ToDoOpportunity', {
      isNested: true,
      inverse: 'source'
    })

  }

});
