// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxClass
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._TaxClass = {
  /** @scope XM.TaxClass.prototype */
  
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
  code: SC.Record.attr(String, {
    label: '_code'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type Number
  */
  groupSequence: SC.Record.attr(Number, {
    label: '_groupSequence'.loc()
  })

};
