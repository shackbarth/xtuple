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
      isNested: true,
      label: '_account'.loc()
    }),
  
    /**
      @type XM.IncidentInfo
    */
    incident: SC.Record.toOne('XM.IncidentInfo', {
      isNested: true,
      label: '_incident'.loc()
    }),
  
    /**
      @type XM.OpportunityInfo
    */
    opportunity: SC.Record.toOne('XM.OpportunityInfo', {
      isNested: true,
      label: '_opportunity'.loc()
    }),
  
    /**
      @type XM.ToDoIncident
    */
    incidents: SC.Record.toMany('XM.ToDoIncident', {
      isNested: true,
      inverse: 'source',
      label: '_incidents'.loc()
    }),
  
    /**
      @type XM.ToDoProject
    */
    projects: SC.Record.toMany('XM.ToDoProject', {
      isNested: true,
      inverse: 'source',
      label: '_projects'.loc()
    }),
  
    /**
      @type XM.ToDoOpportunity
    */
    opportunities: SC.Record.toMany('XM.ToDoOpportunity', {
      isNested: true,
      inverse: 'source',
      label: '_opportunities'.loc()
    })

  }

});
