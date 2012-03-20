// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.IncidentResolution
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._IncidentResolution = {
  /** @scope XM.IncidentResolution.prototype */
  
  className: 'XM.IncidentResolution',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainIncidentResolutions",
      "read": "MaintainIncidentResolutions",
      "update": "MaintainIncidentResolutions",
      "delete": "MaintainIncidentResolutions"
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
    @type String
  */
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    label: '_order'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  })

};
