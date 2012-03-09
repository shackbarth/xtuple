// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxClass
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._TaxClass = XM.Record.extend(
  /** @scope XM.TaxClass.prototype */ {
  
  className: 'XM.TaxClass',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainTaxClasses",
      "read": "ViewTaxClasses",
      "update": "MaintainTaxClasses",
      "delete": "MaintainTaxClasses"
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
  code: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Number
  */
  groupSequence: SC.Record.attr(Number)

});
