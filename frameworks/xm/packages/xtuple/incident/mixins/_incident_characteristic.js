// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.IncidentCharacteristic
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._IncidentCharacteristic = {
  /** @scope XM.IncidentCharacteristic.prototype */
  
  className: 'XM.IncidentCharacteristic',

  nestedRecordNamespace: XM,

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
    @type Number
  */
  incident: SC.Record.attr(Number),

  /**
    @type XM.Characteristic
  */
  characteristic: SC.Record.toOne('XM.Characteristic', {
    isNested: true,
    isRequired: true
  }),

  /**
    @type Number
  */
  value: SC.Record.attr(Number)

};
