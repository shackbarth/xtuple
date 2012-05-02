// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxAssignment
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._TaxAssignment = {
  /** @scope XM.TaxAssignment.prototype */
  
  className: 'XM.TaxAssignment',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainTaxAssignments",
      "read": "ViewTaxAssignments",
      "update": "MaintainTaxAssignments",
      "delete": "MaintainTaxAssignments"
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
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type XM.TaxType
  */
  taxType: SC.Record.toOne('XM.TaxType'),

  /**
    @type XM.TaxCode
  */
  taxCode: SC.Record.toOne('XM.TaxCode')

};
