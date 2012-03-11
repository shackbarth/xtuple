// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.OpportunityToDo
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._OpportunityToDo = XM.Record.extend(
  /** @scope XM.OpportunityToDo.prototype */ {
  
  className: 'XM.OpportunityToDo',

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
  source: SC.Record.toOne('XM.Opportunity'),

  /**
    @type XM.ToDoInfo
  */
  toDo: SC.Record.toOne('XM.ToDoInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String)

});
