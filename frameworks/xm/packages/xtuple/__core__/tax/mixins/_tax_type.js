// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxType
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._TaxType = {
  /** @scope XM.TaxType.prototype */
  
  className: 'XM.TaxType',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainTaxTypes",
      "read": "ViewTaxTypes",
      "update": "MaintainTaxTypes",
      "delete": "MaintainTaxTypes"
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
  isSystem: SC.Record.attr(Boolean, {
    label: '_isSystem'.loc()
  })

};
