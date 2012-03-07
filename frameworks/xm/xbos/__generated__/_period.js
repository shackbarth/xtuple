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
XM._Period = XM.Record.extend(
  /** @scope XM._Period.prototype */ {
  
  className: 'XM.Period',

  

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
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type Date
  */
  start: SC.Record.attr(Date),

  /**
    @type Date
  */
  end: SC.Record.attr(Date),

  /**
    @type XM.FiscalYear
  */
  fiscalYear: SC.Record.toOne('XM.FiscalYear'),

  /**
    @type Number
  */
  number: SC.Record.attr(Number),

  /**
    @type Number
  */
  quarter: SC.Record.attr(Number),

  /**
    @type Boolean
  */
  frozen: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  closed: SC.Record.attr(Boolean)

});
