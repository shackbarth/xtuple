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
XM._CharacteristicOption = XM.Record.extend(
  /** @scope XM._CharacteristicOption.prototype */ {
  
  className: 'XM.CharacteristicOption',

  

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
    @type XM.Characteristic
  */
  characteristic: SC.Record.toOne('XM.Characteristic'),

  /**
    @type String
  */
  value: SC.Record.attr(String),

  /**
    @type Number
  */
  order: SC.Record.attr(Number)

});
