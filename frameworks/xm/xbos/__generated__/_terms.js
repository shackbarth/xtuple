// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Terms
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Terms = XM.Record.extend(
  /** @scope XM.Terms.prototype */ {
  
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
  code: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type String
  */
  termsType: SC.Record.attr(String),

  /**
    @type XM.number
  */
  dueDays: SC.Record.attr('XM.number'),

  /**
    @type Number
  */
  discountDays: SC.Record.attr(Number),

  /**
    @type Number
  */
  discountPercent: SC.Record.attr(Number),

  /**
    @type Number
  */
  cutOffDay: SC.Record.attr(Number)

});
