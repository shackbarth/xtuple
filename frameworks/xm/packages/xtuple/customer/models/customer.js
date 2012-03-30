// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */


sc_require('mixins/_customer');

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
      return XT.session.getPath('settings.DefaultCustType');
    }
  }),

  /**
    @type XM.SalesRep
  */
  salesRep: SC.Record.toOne('XM.SalesRep', {
    defaultValue: function() {
      return XT.session.getPath('settings.DefaultSalesRep');
    }
  }),

  /**
    @type String
  */
  shipVia: SC.Record.attr(String, {
    defaultValue: function() {
      return XT.session.getPath('settings.DefaultShipViaId');
    }
  }),

  /**
    @type XM.Customer
  */
  terms: SC.Record.toOne('XM.Customer', {
    defaultValue: function() {
      return XT.session.getPath('settings.DefaultTerms');
    }
  }),

  /**
    @type String
  */
  balanceMethod: SC.Record.attr(String, {
    defaultValue: function() {
      return XT.session.getPath('settings.DefaultBalanceMethod');
    }
  }),

  /**
    @type Boolean
  */
  isAcceptsPartialShip: SC.Record.attr(Boolean, {
    defaultValue: function() {
      return XT.session.getPath('settings.DefaultPartialShip');
    }
  }),

  /**
    @type Boolean
  */
  isAcceptsBackorders: SC.Record.attr(Boolean, {
    defaultValue: function() {
      return XT.session.getPath('settings.DefaultBackOrders');
    }
  }),

  /**
    @type Boolean
  */
  isFreeFormShipto: SC.Record.attr(Boolean, {
    defaultValue: function() {
      return XT.session.getPath('settings.DefaultFreeFormShiptos');
    }
  }),

  /**
    @type Number
  */
  creditLimit: SC.Record.attr(Number, {
    defaultValue: function() {
      return XT.session.getPath('settings.SOCreditLimit');
    }
  }),

  /**
    @type String
  */
  creditRating: SC.Record.attr(String, {
    defaultValue: function() {
      return XT.session.getPath('settings.SOCreditRate');
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
      var defaultGraceDays = XT.session.getPath('settings.DefaultAutoCreditWarnGraceDays');
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
        defaultGraceDays = XT.session.getPath('settings.DefaultAutoCreditWarnGraceDays');
    return graceDays ? graceDays : defaultGraceDays ? defaultGraceDays : 0;
  }.property('graceDays').cacheable(),

  //..................................................
  // METHODS
  //

  /**
    Retrieve the price for an item for this customer. Must be used with a callback.
    
    @param {Number} shipto (optional)
    @param {Number} item
    @param {Number} quantity
    @param {Number} quantity unit
    @param {Number} currency
    @param {Date} effective date
    @param {Function} callback
    @returns Receiver
  */
  price: function(shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback) {  
    XM.Customer.price(this, shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback);
    return this;
  }

  //..................................................
  // OBSERVERS
  //

});

/**
  Retrieve the outstanding credit for a customer. Must be used with a callback.
  
  @param {XM.Customer|XM.CustomerInfo|XM.CustomerBrowse} customer
  @param {XM.Currency} currency
  @param {Date} effective date
  @param {Function} callback
  @returns Receiver
*/
XM.Customer.outstandingCredit = function(customer, currency, effective, callback) {
  var that = this, dispatch;
  dispatch = XT.Dispatch.create({
    className: 'XM.Customer',
    functionName: 'outstandingCredit',
    parameters: [
      customer.get('id'),
      currency.get('id'),
      effective.toFormattedString('%Y-%m-%d')
    ],
    target: that,
    action: callback
  });
  console.log("XM.Customer.outstandingCredit for: %@".fmt(customer.get('id')));
  customer.get('store').dispatch(dispatch);
  return this;
}

/**
  Retrieve the price for an item for a customer. Must be used with a callback.
  
  @param {XM.Customer|XM.CustomerInfo|XM.CustomerBrowse} customer
  @param {XM.CustomerShipto} shipto (optional)
  @param {XM.Item|XM.ItemInfo|XM.ItemBrowse} item
  @param {Number} quantity
  @param {Number} quantity unit
  @param {XM.Currency} currency
  @param {Date} effective date
  @param {Function} callback
  @returns Receiver
*/
XM.Customer.price = function(customer, shipto, item, quantity, quantityUnit, priceUnit, currency, effective, callback) {  
  var that = this, dispatch;
  dispatch = XT.Dispatch.create({
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
  console.log("XM.Customer.price for: %@".fmt(customer.get('id')));
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
