// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Project.prototype */ { 
  
  target: 'XM.Project',

  body: {
  
    /**
      @type XM.ProjectOpportunity
    */
    opportunities: SC.Record.toMany('XM.ProjectOpportunity', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.ProjectIncident
    */
    incidents: SC.Record.toMany('XM.ProjectIncident', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.ProjectToDo
    */
    toDos: SC.Record.toMany('XM.ProjectToDo', {
      isNested: true,
      inverse: 'source'
    })

  }

});
