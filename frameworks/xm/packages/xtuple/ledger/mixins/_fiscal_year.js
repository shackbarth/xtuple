// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.FiscalYear
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._FiscalYear = {
  /** @scope XM.FiscalYear.prototype */
  
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
  start: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_start'.loc()
  }),

  /**
    @type Date
  */
  end: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_end'.loc()
  }),

  /**
    @type Boolean
  */
  closed: SC.Record.attr(Boolean, {
    label: '_closed'.loc()
  })

};
