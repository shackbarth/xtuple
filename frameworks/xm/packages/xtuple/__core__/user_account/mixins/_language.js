// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Language
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Language = {
  /** @scope XM.Language.prototype */
  
  className: 'XM.Language',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false
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
    @type String
  */
  abbreviationShort: SC.Record.attr(String, {
    label: '_abbreviationShort'.loc()
  }),

  /**
    @type String
  */
  abbreviationLong: SC.Record.attr(String, {
    label: '_abbreviationLong'.loc()
  })

};
