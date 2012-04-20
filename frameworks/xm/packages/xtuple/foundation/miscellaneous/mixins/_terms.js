// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Terms
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Terms = {
  /** @scope XM.Terms.prototype */
  
  className: 'XM.Terms',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainTerms",
      "read": true,
      "update": "MaintainTerms",
      "delete": "MaintainTerms"
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
    isRequired: true,
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
  termsType: SC.Record.attr(String, {
    defaultValue: 'D',
    label: '_termsType'.loc()
  }),

  /**
    @type Number
  */
  dueDays: SC.Record.attr(Number, {
    defaultValue: 0,
    label: '_dueDays'.loc()
  }),

  /**
    @type Number
  */
  discountDays: SC.Record.attr(Number, {
    defaultValue: 0,
    label: '_discountDays'.loc()
  }),

  /**
    @type Percent
  */
  discountPercent: SC.Record.attr(Percent, {
    defaultValue: 0,
    label: '_discountPercent'.loc()
  }),

  /**
    @type Number
  */
  cutOffDay: SC.Record.attr(Number, {
    defaultValue: 0,
    label: '_cutOffDay'.loc()
  })

};
