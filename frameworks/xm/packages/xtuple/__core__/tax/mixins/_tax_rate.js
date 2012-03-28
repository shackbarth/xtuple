// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.TaxRate
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._TaxRate = {
  /** @scope XM.TaxRate.prototype */
  
  className: 'XM.TaxRate',

  nestedRecordNamespace: XM,

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
    @type XM.TaxCode
  */
  taxCode: SC.Record.toOne('XM.TaxCode', {
    label: '_taxCode'.loc()
  }),

  /**
    @type Number
  */
  percent: SC.Record.attr(Number, {
    label: '_percent'.loc()
  }),

  /**
    @type Number
  */
  amount: SC.Record.attr(Number, {
    label: '_amount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    isNested: true,
    label: '_currency'.loc()
  }),

  /**
    @type Date
  */
  effective: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_effective'.loc()
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_expires'.loc()
  })

};
