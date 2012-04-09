// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @patch

  This code is automatically generated and will be over-written. Do not edit directly.

*/

SC.Patch.create( /** @scope XM.ToDo */ {

  target: 'XM.ToDo',

  body: {
  
    /**
      @type XM.AccountInfo
    */
    account: SC.Record.toOne('XM.AccountInfo', {
      label: "_account".loc()
    }),
    
    /**
      @type XM.IncidentInfo
    */
    incident: SC.Record.toOne('XM.IncidentInfo', {
      label: "_incident".loc()
    }),
    
    /**
      @type XM.OpportunityInfo
    */
    opportunity: SC.Record.toOne('XM.OpportunityInfo', {
      label: "_opportunity".loc()
    }),
    
    /**
      @type ToDoIncident
    */
    incidents: SC.Record.toMany('XM.ToDoIncident', {
      label: "_incidents".loc()
    }),
    
    /**
      @type ToDoProjects
    */
    projects: SC.Record.toMany('XM.ToDoProject', {
      label: "_projects".loc()
    }),
    
    /**
      @type ToDoOpportunity
    */
    opportunities: SC.Record.toMany('XM.ToDoOpportunity', {
      label: "_opportunities".loc()
    })
  }
  
});


