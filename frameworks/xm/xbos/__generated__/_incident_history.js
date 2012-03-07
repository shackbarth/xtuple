// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._IncidentHistory = XM.Record.extend(
  /** @scope XM._IncidentHistory.prototype */ {
  
  className: 'XM.IncidentHistory',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllIncidentHistory",
      "read": "ViewAllIncidentHistory",
      "update": "MaintainAllIncidentHistory",
      "delete": "MaintainAllIncidentHistory"
    },
    "personal": {
      "create": "MaintainPersonalIncidentHistory",
      "read": "ViewPersonalIncidentHistory",
      "update": "MaintainPersonalIncidentHistory",
      "delete": "MaintainPersonalIncidentHistory",
      "properties": [
        "owner",
        "assignedTo"
      ]
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
  incident: SC.Record.toOne('XM.Incident'),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Date
  */
  created: SC.Record.attr(Date),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String)

});
