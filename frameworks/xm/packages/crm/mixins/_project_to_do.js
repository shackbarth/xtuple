// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProjectToDo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ProjectToDo = {
  /** @scope XM.ProjectToDo.prototype */
  
  className: 'XM.ProjectToDo',

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
    @type XM.Project
  */
  source: SC.Record.toOne('XM.Project'),

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

};
