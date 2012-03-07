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
XM._Unit = XM.Record.extend(
  /** @scope XM._Unit.prototype */ {
  
  className: 'XM.Unit',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainUOMs",
      "read": "ViewUOMs",
      "update": "MaintainUOMs",
      "delete": "MaintainUOMs"
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
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isItemWeight: SC.Record.attr(Boolean),

  /**
    @type XM.UnitConversion
  */
  conversionTo: SC.Record.toMany('XM.UnitConversion', {
    isNested: true,
    inverse: 'to_unit'
  }),

  /**
    @type XM.UnitConversion
  */
  conversionFrom: SC.Record.toMany('XM.UnitConversion', {
    isNested: true,
    inverse: 'from_unit'
  })

});
