// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CustomerCreditCard
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CustomerCreditCard = {
  /** @scope XM.CustomerCreditCard.prototype */
  
  className: 'XM.CustomerCreditCard',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
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
    @type Number
  */
  sequence: SC.Record.attr(Number),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer'),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type String
  */
  address1: SC.Record.attr(String),

  /**
    @type String
  */
  address2: SC.Record.attr(String),

  /**
    @type String
  */
  city: SC.Record.attr(String),

  /**
    @type String
  */
  state: SC.Record.attr(String),

  /**
    @type String
  */
  postalCode: SC.Record.attr(String),

  /**
    @type String
  */
  country: SC.Record.attr(String),

  /**
    @type String
  */
  number: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isDebit: SC.Record.attr(Boolean),

  /**
    @type String
  */
  monthExpire: SC.Record.attr(String),

  /**
    @type String
  */
  yearExpire: SC.Record.attr(String),

  /**
    @type String
  */
  cardType: SC.Record.attr(String),

  /**
    @type Date
  */
  created: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String),

  /**
    @type Date
  */
  updated: SC.Record.attr(XT.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false
  }),

  /**
    @type String
  */
  updatedBy: SC.Record.attr(String)

};
