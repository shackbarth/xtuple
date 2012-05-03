// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Incident.prototype */ { 
  
  target: 'XM.Incident',

  body: {
  
    /**
      @type XM.ProjectInfo
    */
    project: SC.Record.toOne('XM.ProjectInfo', {
      isNested: true
    }),
  
    /**
      @type XM.IncidentOpportunity
    */
    opportunities: SC.Record.toMany('XM.IncidentOpportunity', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.IncidentProject
    */
    projects: SC.Record.toMany('XM.IncidentProject', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.IncidentToDo
    */
    toDos: SC.Record.toMany('XM.IncidentToDo', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.ToDoInfo
    */
    todoRelations: SC.Record.toMany('XM.ToDoInfo', {
      isNested: true,
      inverse: 'incident'
    })

  }

});
