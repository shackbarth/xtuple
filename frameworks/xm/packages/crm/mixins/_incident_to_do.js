// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.IncidentToDo
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._IncidentToDo = {
  /** @scope XM.IncidentToDo.prototype */
  
  className: 'XM.IncidentToDo',

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
    @type XM.Incident
  */
  source: SC.Record.toOne('XM.Incident', {
    label: '_source'.loc()
  }),

  /**
    @type XM.ToDoInfo
  */
  toDo: SC.Record.toOne('XM.ToDoInfo', {
    isNested: true,
    label: '_toDo'.loc()
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String, {
    label: '_purpose'.loc()
  })

};
