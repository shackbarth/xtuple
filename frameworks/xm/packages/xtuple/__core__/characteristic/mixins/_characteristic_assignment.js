// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CharacteristicAssignment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CharacteristicAssignment = {
  /** @scope XM.CharacteristicAssignment.prototype */
  
  className: 'XM.CharacteristicAssignment',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
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
  targetType: SC.Record.attr(String, {
    label: '_targetType'.loc()
  }),

  /**
    @type XM.Characteristic
  */
  target: SC.Record.toOne('XM.Characteristic', {
    label: '_target'.loc()
  }),

  /**
    @type XM.Characteristic
  */
  characteristic: SC.Record.toOne('XM.Characteristic', {
    isNested: true,
    label: '_characteristic'.loc()
  }),

  /**
    @type String
  */
  value: SC.Record.attr(String, {
    label: '_value'.loc()
  })

};
