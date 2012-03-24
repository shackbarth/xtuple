// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */


sc_require('packages/xtuple/customer/mixins/_customer');

/**
  @class

  @extends XM.AccountDocument
  @extends XM.CoreDocuments
*/
XM.Customer = XM.AccountDocument.extend(XM.CoreDocuments, XM._Customer,
  /** @scope XM.Customer.prototype */ {

  numberPolicySetting: 'CRMAccountNumberGeneration',

  /**
  @type XM.Customer
  */
  customerType: SC.Record.toOne('XM.Customer', {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultCustType');
    }
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultSalesRep');
    }
  }),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String, {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultShipViaId');
    }
  }),

  /**
    @type XM.Customer
  */
  terms: SC.Record.toOne('XM.Customer', {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultTerms');
    }
  }),

  /**
    @type String
  */
  balanceMethod: SC.Record.attr(String, {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultBalanceMethod');
    }
  }),

  /**
    @type Boolean
  */
  isAcceptsPartialShip: SC.Record.attr(Boolean, {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultPartialShip');
    }
  }),

  /**
    @type Boolean
  */
  isAcceptsBackorders: SC.Record.attr(Boolean, {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultBackOrders');
    }
  }),

  /**
    @type Boolean
  */
  isFreeFormShipto: SC.Record.attr(Boolean, {
    defaultValue: function() {
      return XM.session.getPath('settings.DefaultFreeFormShiptos');
    }
  }),

  /**
    @type Number
  */
  creditLimit: SC.Record.attr(Number, {
    defaultValue: function() {
      return XM.session.getPath('settings.SOCreditLimit');
    }
  }),

  /**
    @type String
  */
  creditRating: SC.Record.attr(String, {
    defaultValue: function() {
      return XM.session.getPath('settings.SOCreditRate');
    }
  }),

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Boolean value determining whether alternate grace days are to be used.
    
    @type Boolean
  */
  isAlternateLateGraceDays: function(key, value) {
    if(value !== undefined) {
      var defaultGraceDays = XM.session.getPath('settings.DefaultAutoCreditWarnGraceDays');
      this.setIfChanged('graceDays', value ? defaultGraceDays : null);
    }
    return this.get('graceDays') ? true : false;
  }.property('graceDays').cacheable(),
  
  /**
    Late grace days used for this customer. Bind views to this value NOT the graceDays attribute.
    Setting this value will only have an effect if isAlternateGraceDays is set to true.
    
    @seealso XM.Customer.isAlternateGraceDays
    @type Number
  */
  lateGraceDays: function(key, value) {
    if(value !== undefined && 
       this.get('isAlternateLateGraceDays')) {
      this.setIfChanged('graceDays', value);
    }
    var graceDays = this.get('graceDays'),
        defaultGraceDays = XM.session.getPath('settings.DefaultAutoCreditWarnGraceDays');
    return graceDays ? graceDays : defaultGraceDays ? defaultGraceDays : 0;
  }.property('graceDays').cacheable(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});

/**
  Return the price for an item for a customer.
  
  @param {Number} customer
  @param {Number} shipto (optional)
  @param {Number} item
  @param {Number} quantity
  @param {Number} quantity unit
  @param {Number} currency
  @param {Date} effective date
  @returns Number
*/
XM.Customer.price = function(customer, shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback) {  
  var that = this, dispatch;
  dispatch = XM.Dispatch.create({
    className: 'XM.Customer',
    functionName: 'price',
    parameters: [
      customer.get('id'),
      shipto ? shipto.get('id') : null,
      item.get('id'),
      quantity,
      quantityUnit.get('id'),
      priceUnit.get('id'),
      currency.get('id'),
      effective.toFormattedString('%Y-%m-%d')
    ],
    target: that,
    action: callback
  });
  customer.get('store').dispatch(dispatch);
  return this;
}

XM.Customer.mixin( /** @scope XM.Customer */ {

/**
  Good Standing status.
  
  @static
  @constant
  @type String
  @default G
*/
  GOOD_STANDING: 'G',

/**
  Credit Warning status.
  
  @static
  @constant
  @type String
  @default W
*/
  CREDIT_WARNING: 'W',

/**
  Credit Hold status.

  @static
  @constant
  @type String
  @default H
*/
  CREDIT_HOLD: 'H'

});
