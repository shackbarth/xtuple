// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemAlias
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ItemAlias = XM.Record.extend(
  /** @scope XM.ItemAlias.prototype */ {
  
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
  item: SC.Record.toOne('XM.Item'),

  /**
    @type String
  */
  aliasNumber: SC.Record.attr(String),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  useDescription: SC.Record.attr(Boolean),

  /**
    @type String
  */
  description1: SC.Record.attr(String),

  /**
    @type String
  */
  description2: SC.Record.attr(String)

});
