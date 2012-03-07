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
XM._ItemSubstitute = XM.Record.extend(
  /** @scope XM._ItemSubstitute.prototype */ {
  
  className: 'XM.ItemSubstitute',

  

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
    @type XM.Item
  */
  substituteItem: SC.Record.toOne('XM.Item'),

  /**
    @type Number
  */
  conversionRatio: SC.Record.attr(Number),

  /**
    @type Number
  */
  rank: SC.Record.attr(Number)

});
