// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemBrowse
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ItemBrowse = XM.Record.extend(
  /** @scope XM.ItemBrowse.prototype */ {
  
  className: 'XM.ItemBrowse',

  

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
    @type Number
  */
  number: SC.Record.attr(Number),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  description1: SC.Record.attr(String),

  /**
    @type String
  */
  description2: SC.Record.attr(String),

  /**
    @type String
  */
  type: SC.Record.attr(String),

  /**
    @type String
  */
  barcode: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isSold: SC.Record.attr(Boolean)

});
