// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Locale
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Locale = {
  /** @scope XM.Locale.prototype */
  
  className: 'XM.Locale',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainLocales",
      "read": "MaintainLocales",
      "update": "MaintainLocales",
      "delete": "MaintainLocales"
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
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.Language
  */
  language: SC.Record.toOne('XM.Language', {
    label: '_language'.loc()
  }),

  /**
    @type XM.Country
  */
  country: SC.Record.toOne('XM.Country', {
    label: '_country'.loc()
  }),

  /**
    @type String
  */
  errorColor: SC.Record.attr(String, {
    label: '_errorColor'.loc()
  }),

  /**
    @type String
  */
  warningColor: SC.Record.attr(String, {
    label: '_warningColor'.loc()
  }),

  /**
    @type String
  */
  emphasisColor: SC.Record.attr(String, {
    label: '_emphasisColor'.loc()
  }),

  /**
    @type String
  */
  altEmphasisColor: SC.Record.attr(String, {
    label: '_altEmphasisColor'.loc()
  }),

  /**
    @type String
  */
  expiredColor: SC.Record.attr(String, {
    label: '_expiredColor'.loc()
  }),

  /**
    @type String
  */
  futureColor: SC.Record.attr(String, {
    label: '_futureColor'.loc()
  }),

  /**
    @type Number
  */
  currencyScale: SC.Record.attr(Number, {
    label: '_currencyScale'.loc()
  }),

  /**
    @type Number
  */
  salesPriceScale: SC.Record.attr(Number, {
    label: '_salesPriceScale'.loc()
  }),

  /**
    @type Number
  */
  purchasePriceScale: SC.Record.attr(Number, {
    label: '_purchasePriceScale'.loc()
  }),

  /**
    @type Number
  */
  extendedPriceScale: SC.Record.attr(Number, {
    label: '_extendedPriceScale'.loc()
  }),

  /**
    @type Number
  */
  costScale: SC.Record.attr(Number, {
    label: '_costScale'.loc()
  }),

  /**
    @type Number
  */
  quantityScale: SC.Record.attr(Number, {
    label: '_quantityScale'.loc()
  }),

  /**
    @type Number
  */
  quantityPerScale: SC.Record.attr(Number, {
    label: '_quantityPerScale'.loc()
  }),

  /**
    @type Number
  */
  unitRatioScale: SC.Record.attr(Number, {
    label: '_unitRatioScale'.loc()
  }),

  /**
    @type Number
  */
  percentScale: SC.Record.attr(Number, {
    label: '_percentScale'.loc()
  })

};
