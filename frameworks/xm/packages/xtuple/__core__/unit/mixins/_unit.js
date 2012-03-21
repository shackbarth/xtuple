// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Unit
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Unit = {
  /** @scope XM.Unit.prototype */
  
  className: 'XM.Unit',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainUOMs",
      "read": true,
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
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type Boolean
  */
  isItemWeight: SC.Record.attr(Boolean, {
    label: '_isItemWeight'.loc()
  }),

  /**
    @type XM.UnitConversion
  */
  conversionTo: SC.Record.toMany('XM.UnitConversion', {
    isNested: true,
    inverse: 'to_unit',
    label: '_conversionTo'.loc()
  }),

  /**
    @type XM.UnitConversion
  */
  conversionFrom: SC.Record.toMany('XM.UnitConversion', {
    isNested: true,
    inverse: 'from_unit',
    label: '_conversionFrom'.loc()
  })

};
