// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.ToDoInfo.prototype */ { 
  
  target: 'XM.ToDoInfo',

  body: {
  
    /**
      @type XM.OpportunityInfo
    */
    opportunity: SC.Record.toOne('XM.OpportunityInfo'),
  
    /**
      @type XM.AccountInfo
    */
    account: SC.Record.toOne('XM.AccountInfo'),
  
    /**
      @type XM.IncidentInfo
    */
    incident: SC.Record.toOne('XM.IncidentInfo')

  }

});
