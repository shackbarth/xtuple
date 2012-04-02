// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */


sc_require('mixins/_customer');

/**
  @class

  @extends XM.AccountDocument
  @extends XM.Documents
*/
XM.Customer = XM.AccountDocument.extend(XM.Documents, XM._Customer,
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

  //..................................................
  // OBSERVERS
  //

});

/**
  Retrieve the outstanding credit for a customer. Must be used with a callback.
  
  @param {XM.Customer|XM.CustomerInfo} customer
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
