// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CustomerPayment
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._CustomerPayment = XM.Record.extend(
  /** @scope XM.CustomerPayment.prototype */ {
  
  className: 'XM.CustomerPayment',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "false",
      "read": "read",
      "update": "false",
      "delete": "false"
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
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer')

});
