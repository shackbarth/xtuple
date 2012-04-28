// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CurrencyRate
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CurrencyRate = {
  /** @scope XM.CurrencyRate.prototype */
  
  className: 'XM.CurrencyRate',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCurrencyRates",
      "read": "ViewCurrencyRates",
      "update": "MaintainCurrencyRates",
      "delete": "MaintainCurrencyRates"
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
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    isRequired: true,
    label: '_currency'.loc()
  }),

  /**
    @type UnitRatio
  */
  rate: SC.Record.attr(UnitRatio, {
    isRequired: true,
    label: '_rate'.loc()
  }),

  /**
    @type Date
  */
  effective: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true,
    label: '_effective'.loc()
  }),

  /**
    @type Date
  */
  expires: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    isRequired: true,
    label: '_expires'.loc()
  })

};
