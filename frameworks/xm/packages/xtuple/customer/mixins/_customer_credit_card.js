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
  sequence: SC.Record.attr(Number, {
    label: '_sequence'.loc()
  }),

  /**
    @type XM.Customer
  */
  customer: SC.Record.toOne('XM.Customer', {
    label: '_customer'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  address1: SC.Record.attr(String, {
    label: '_address1'.loc()
  }),

  /**
    @type String
  */
  address2: SC.Record.attr(String, {
    label: '_address2'.loc()
  }),

  /**
    @type String
  */
  city: SC.Record.attr(String, {
    label: '_city'.loc()
  }),

  /**
    @type String
  */
  state: SC.Record.attr(String, {
    label: '_state'.loc()
  }),

  /**
    @type String
  */
  postalCode: SC.Record.attr(String, {
    label: '_postalCode'.loc()
  }),

  /**
    @type String
  */
  country: SC.Record.attr(String, {
    label: '_country'.loc()
  }),

  /**
    @type String
  */
  number: SC.Record.attr(String, {
    label: '_number'.loc()
  }),

  /**
    @type Boolean
  */
  isDebit: SC.Record.attr(Boolean, {
    label: '_isDebit'.loc()
  }),

  /**
    @type String
  */
  monthExpire: SC.Record.attr(String, {
    label: '_monthExpire'.loc()
  }),

  /**
    @type String
  */
  yearExpire: SC.Record.attr(String, {
    label: '_yearExpire'.loc()
  }),

  /**
    @type String
  */
  cardType: SC.Record.attr(String, {
    label: '_cardType'.loc()
  }),

  /**
    @type Date
  */
  created: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_created'.loc()
  }),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String, {
    label: '_createdBy'.loc()
  }),

  /**
    @type Date
  */
  updated: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    useIsoDate: false,
    label: '_updated'.loc()
  }),

  /**
    @type String
  */
  updatedBy: SC.Record.attr(String, {
    label: '_updatedBy'.loc()
  })

};
