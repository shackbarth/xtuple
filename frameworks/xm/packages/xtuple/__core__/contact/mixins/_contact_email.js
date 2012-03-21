// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ContactEmail
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ContactEmail = {
  /** @scope XM.ContactEmail.prototype */
  
  className: 'XM.ContactEmail',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
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
    @type XM.Comment
  */
  contact: SC.Record.toOne('XM.Comment', {
    label: '_contact'.loc()
  }),

  /**
    @type String
  */
  email: SC.Record.attr(String, {
    label: '_email'.loc()
  })

};
