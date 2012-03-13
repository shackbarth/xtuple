// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProfitCenter
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._ProfitCenter = XM.Record.extend(
  /** @scope XM.ProfitCenter.prototype */ {
  
  className: 'XM.ProfitCenter',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainChartOfAccounts",
      "read": true,
      "update": "MaintainChartOfAccounts",
      "delete": "MaintainChartOfAccounts"
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
  number: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String)

});
