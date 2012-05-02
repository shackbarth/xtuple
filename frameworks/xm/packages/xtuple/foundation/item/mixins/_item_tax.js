// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemTax
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemTax = {
  /** @scope XM.ItemTax.prototype */
  
  className: 'XM.ItemTax',

  

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
  itemTax: SC.Record.attr(Number),

  /**
    @type Number
  */
  itemTaxType: SC.Record.attr(Number),

  /**
    @type Number
  */
  itemTaxZone: SC.Record.attr(Number)

};
