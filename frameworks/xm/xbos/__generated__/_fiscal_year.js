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
XM._FiscalYear = XM.Record.extend(
  /** @scope XM._FiscalYear.prototype */ {
  
  className: 'XM.FiscalYear',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAccountingPeriods",
      "read": true,
      "update": "MaintainAccountingPeriods",
      "delete": "MaintainAccountingPeriods"
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
    @type Date
  */
  start: SC.Record.attr(Date),

  /**
    @type Date
  */
  end: SC.Record.attr(Date),

  /**
    @type Boolean
  */
  closed: SC.Record.attr(Boolean)

});
