// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @patch

  This code is automatically generated and will be over-written. Do not edit directly.
*/
SC.Patch.create( /** @scope XM.Customer.prototype */ { 
  
  target: 'XM.Customer',

  body: {
  
    /**
      @type XM.Account
    */
    account: SC.Record.toOne('XM.Account'),
  
    /**
      @type XM.ContactInfo
    */
    contactRelations: SC.Record.toMany('XM.ContactInfo'),
  
    /**
      @type XM.IncidentInfo
    */
    incidentRelations: SC.Record.toMany('XM.IncidentInfo'),
  
    /**
      @type XM.OpportunityInfo
    */
    opportunitytRelations: SC.Record.toMany('XM.OpportunityInfo'),
  
    /**
      @type XM.ToDoInfo
    */
    toDoRelations: SC.Record.toMany('XM.ToDoInfo')

  }

});
