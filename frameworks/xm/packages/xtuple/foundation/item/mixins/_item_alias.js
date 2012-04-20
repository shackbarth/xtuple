// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemAlias
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemAlias = {
  /** @scope XM.ItemAlias.prototype */
  
  className: 'XM.ItemAlias',

  

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
    @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    label: '_item'.loc()
  }),

  /**
    @type String
  */
  aliasNumber: SC.Record.attr(String, {
    label: '_aliasNumber'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Boolean
  */
  useDescription: SC.Record.attr(Boolean, {
    label: '_useDescription'.loc()
  }),

  /**
    @type String
  */
  description1: SC.Record.attr(String, {
    label: '_description1'.loc()
  }),

  /**
    @type String
  */
  description2: SC.Record.attr(String, {
    label: '_description2'.loc()
  })

};
