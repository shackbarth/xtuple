// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CharacteristicAssignment
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._CharacteristicAssignment = XM.Record.extend(
  /** @scope XM.CharacteristicAssignment.prototype */ {
  
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
  targetType: SC.Record.attr(String),

  /**
    @type XM.Characteristic
  */
  target: SC.Record.toOne('XM.Characteristic'),

  /**
    @type XM.Characteristic
  */
  characteristic: SC.Record.toOne('XM.Characteristic', {
    isNested: true
  }),

  /**
    @type String
  */
  value: SC.Record.attr(String)

});
