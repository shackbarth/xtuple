// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Customer
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Customer = {
  /** @scope XM.Customer.prototype */
  
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
  number: SC.Record.attr(String, {
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true,
    label: '_name'.loc()
  }),

  /**
    @type XM.Customer
  */
  customerType: SC.Record.toOne('XM.Customer', {
    isRequired: true,
    label: '_customerType'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  billingContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_billingContact'.loc()
  }),

  /**
    @type XM.ContactInfo
  */
  correspondenceContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: true,
    label: '_correspondenceContact'.loc()
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    isRequired: true,
    label: '_salesRep'.loc()
  }),

  /**
    @type Percent
  */
  commission: SC.Record.attr(Percent, {
    label: '_commission'.loc()
  }),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String, {
    label: '_shipVia'.loc()
  }),

  /**
    @type XM.Customer
  */
  shipCharge: SC.Record.toOne('XM.Customer', {
    label: '_shipCharge'.loc()
  }),

  /**
    @type Boolean
  */
  isAcceptsBackorders: SC.Record.attr(Boolean, {
    label: '_isAcceptsBackorders'.loc()
  }),

  /**
    @type Boolean
  */
  isAcceptsPartialShip: SC.Record.attr(Boolean, {
    label: '_isAcceptsPartialShip'.loc()
  }),

  /**
    @type Boolean
  */
  isFreeFormShipto: SC.Record.attr(Boolean, {
    label: '_isFreeFormShipto'.loc()
  }),

  /**
    @type Boolean
  */
  isFreeFormBillto: SC.Record.attr(Boolean, {
    defaultValue: false,
    label: '_isFreeFormBillto'.loc()
  }),

  /**
    @type XM.Customer
  */
  terms: SC.Record.toOne('XM.Customer', {
    isRequired: true,
    label: '_terms'.loc()
  }),

  /**
    @type Percent
  */
  discount: SC.Record.attr(Percent, {
    defaultValue: 0,
    label: '_discount'.loc()
  }),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    label: '_currency'.loc()
  }),

  /**
    @type String
  */
  creditStatus: SC.Record.attr(String, {
    defaultValue: 'G',
    label: '_creditStatus'.loc()
  }),

  /**
    @type String
  */
  balanceMethod: SC.Record.attr(String, {
    defaultValue: 'B',
    label: '_balanceMethod'.loc()
  }),

  /**
    @type Number
  */
  creditLimit: SC.Record.attr(Number, {
    label: '_creditLimit'.loc()
  }),

  /**
    @type XM.Customer
  */
  creditLimitCurrency: SC.Record.toOne('XM.Customer', {
    defaultValue: function() {
      return XM.Currency.BASE;
    },
    label: '_creditLimitCurrency'.loc()
  }),

  /**
    @type String
  */
  creditRating: SC.Record.attr(String, {
    label: '_creditRating'.loc()
  }),

  /**
    @type Number
  */
  graceDays: SC.Record.attr(Number, {
    label: '_graceDays'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  taxZone: SC.Record.toOne('XM.TaxZone', {
    label: '_taxZone'.loc()
  }),

  /**
    @type XM.CustomerShipto
  */
  shiptos: SC.Record.toMany('XM.CustomerShipto', {
    isNested: true,
    inverse: 'customer',
    label: '_shiptos'.loc()
  }),

  /**
    @type XM.CustomerComment
  */
  comments: SC.Record.toMany('XM.CustomerComment', {
    isNested: true,
    inverse: 'customer',
    label: '_comments'.loc()
  }),

  /**
    @type XM.CustomerCharacteristic
  */
  characteristics: SC.Record.toMany('XM.CustomerCharacteristic', {
    isNested: true,
    inverse: 'customer',
    label: '_characteristics'.loc()
  }),

  /**
    @type XM.CustomerCreditCard
  */
  creditCards: SC.Record.toMany('XM.CustomerCreditCard', {
    isNested: true,
    inverse: 'customer',
    label: '_creditCards'.loc()
  }),

  /**
    @type XM.CustomerCreditCardPayment
  */
  creditCardPayments: SC.Record.toMany('XM.CustomerCreditCardPayment', {
    label: '_creditCardPayments'.loc()
  }),

  /**
    @type XM.CustomerContact
  */
  contacts: SC.Record.toMany('XM.CustomerContact', {
    isNested: true,
    inverse: 'source',
    label: '_contacts'.loc()
  }),

  /**
    @type XM.CustomerItem
  */
  items: SC.Record.toMany('XM.CustomerItem', {
    isNested: true,
    inverse: 'source',
    label: '_items'.loc()
  }),

  /**
    @type XM.CustomerFile
  */
  files: SC.Record.toMany('XM.CustomerFile', {
    isNested: true,
    inverse: 'source',
    label: '_files'.loc()
  }),

  /**
    @type XM.CustomerImage
  */
  images: SC.Record.toMany('XM.CustomerImage', {
    isNested: true,
    inverse: 'source',
    label: '_images'.loc()
  }),

  /**
    @type XM.CustomerUrl
  */
  urls: SC.Record.toMany('XM.CustomerUrl', {
    isNested: true,
    inverse: 'source',
    label: '_urls'.loc()
  }),

  /**
    @type XM.CustomerCustomer
  */
  customers: SC.Record.toMany('XM.CustomerCustomer', {
    isNested: true,
    inverse: 'source',
    label: '_customers'.loc()
  })

};
