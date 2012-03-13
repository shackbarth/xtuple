// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Customer
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Customer = XM.Record.extend(
  /** @scope XM.Customer.prototype */ {
  
  className: 'XM.Customer',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCustomerMasters",
      "read": "ViewCustomerMasters",
      "update": "MaintainCustomerMasters",
      "delete": "MaintainCustomerMasters"
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
  number: SC.Record.attr(String),

  /**
    @type String
  */
  name: SC.Record.attr(String),

  /**
    @type XM.Customer
  */
  customerType: SC.Record.toOne('XM.Customer'),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type XM.ContactInfo
  */
  billingContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type XM.ContactInfo
  */
  correspondenceContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep'),

  /**
    @type Number
  */
  commission: SC.Record.attr(Number),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String),

  /**
    @type XM.Customer
  */
  shipCharge: SC.Record.toOne('XM.Customer'),

  /**
    @type Boolean
  */
  isAcceptsBackorders: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isAcceptsPartialShip: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isFreeFormShipto: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isFreeFormBillto: SC.Record.attr(Boolean),

  /**
    @type XM.Customer
  */
  terms: SC.Record.toOne('XM.Customer'),

  /**
    @type Number
  */
  discount: SC.Record.attr(Number),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency'),

  /**
    @type String
  */
  creditStatus: SC.Record.attr(String),

  /**
    @type String
  */
  balanceMethod: SC.Record.attr(String),

  /**
    @type Number
  */
  creditLimit: SC.Record.attr(Number),

  /**
    @type XM.Customer
  */
  creditLimitCurrency: SC.Record.toOne('XM.Customer'),

  /**
    @type String
  */
  creditRating: SC.Record.attr(String),

  /**
    @type Number
  */
  graceDays: SC.Record.attr(Number),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone'),

  /**
    @type XM.CustomerShipto
  */
  shiptos: SC.Record.toMany('XM.CustomerShipto', {
    isNested: true,
    inverse: 'customer'
  }),

  /**
    @type XM.CustomerComment
  */
  comments: SC.Record.toMany('XM.CustomerComment', {
    isNested: true,
    inverse: 'customer'
  }),

  /**
    @type XM.CustomerCharacteristic
  */
  characteristics: SC.Record.toMany('XM.CustomerCharacteristic', {
    isNested: true,
    inverse: 'customer'
  }),

  /**
    @type XM.CustomerCreditCard
  */
  creditCards: SC.Record.toMany('XM.CustomerCreditCard', {
    isNested: true,
    inverse: 'customer'
  }),

  /**
    @type XM.CustomerContact
  */
  contacts: SC.Record.toMany('XM.CustomerContact', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.CustomerItem
  */
  items: SC.Record.toMany('XM.CustomerItem', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.CustomerFile
  */
  files: SC.Record.toMany('XM.CustomerFile', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.CustomerImage
  */
  images: SC.Record.toMany('XM.CustomerImage', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.CustomerUrl
  */
  urls: SC.Record.toMany('XM.CustomerUrl', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.CustomerCustomer
  */
  customers: SC.Record.toMany('XM.CustomerCustomer', {
    isNested: true,
    inverse: 'source'
  })

});
