// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Period
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Period = {
  /** @scope XM.Period.prototype */
  
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
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

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
    @type XM.FiscalYear
  */
  fiscalYear: SC.Record.toOne('XM.FiscalYear', {
    label: '_fiscalYear'.loc()
  }),

  /**
    @type Number
  */
  number: SC.Record.attr(Number, {
    label: '_number'.loc()
  }),

  /**
    @type Number
  */
  quarter: SC.Record.attr(Number, {
    label: '_quarter'.loc()
  }),

  /**
    @type Boolean
  */
  frozen: SC.Record.attr(Boolean, {
    label: '_frozen'.loc()
  }),

  /**
    @type Boolean
  */
  closed: SC.Record.attr(Boolean, {
    label: '_closed'.loc()
  })

};
