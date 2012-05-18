// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Opportunity.prototype */ { 
  
  target: 'XM.Opportunity',

  body: {
  
    /**
      @type XM.OpportunityProject
    */
    projects: SC.Record.toMany('XM.OpportunityProject', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.OpportunityToDo
    */
    toDos: SC.Record.toMany('XM.OpportunityToDo', {
      isNested: true,
      inverse: 'source'
    }),
  
    /**
      @type XM.ToDoInfo
    */
    toDoRelations: SC.Record.toMany('XM.ToDoInfo')

  }

});
