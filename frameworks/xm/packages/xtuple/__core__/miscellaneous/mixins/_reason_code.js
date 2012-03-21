// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ReasonCode
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ReasonCode = {
  /** @scope XM.ReasonCode.prototype */
  
  className: 'XM.ReasonCode',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainReasonCodes",
      "read": true,
      "update": "MaintainReasonCodes",
      "delete": "MaintainReasonCodes"
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
  code: SC.Record.attr(String, {
    isRequired: true,
    label: '_code'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  })

};
