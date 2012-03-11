// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_invoice');
sc_require('mixins/document');

/**
  @class

  @extends XM._Invoice
  @extends XM.Document
*/
XM.Invoice = XM._Invoice.extend(XM.Document,
  /** @scope XM.Invoice.prototype */ {
  
  numberPolicySetting: 'InvcNumberGeneration',
  
  invoiceDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),
  
  orderDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),
  
  shipDate: SC.Record.attr(SC.DateTime, {
    format: '%Y-%m-%d',
    
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),

  freeFormBillto: false,
  
  freeFormShipto: false,
  
  subTotal: 0,
    
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /* @private */
  linesLength: 0,
  
  /* @private */
  linesLengthBinding: '.lines.length',
  
  taxes: function() {
    return 0;
  }.property('taxZone').cacheable(),
  
  total: function() {
    return 0;
  }.property('linesLength').cacheable(),
  
  //..................................................
  // METHODS
  //
  
  post: function() {
  },

  //..................................................
  // OBSERVERS
  //
  
  validate: function() {
    var errors = this.get('validateErrors'), val, err;

    // Validate Number
    val = this.get('number') ? this.get('number').length : 0;
    err = XM.errors.findProperty('code', 'xt1001');
    this.updateErrors(err, !val);

    // Validate Invoice Date
    val = this.get('invoiceDate');
    err = XM.errors.findProperty('code', 'xt1012');
    this.updateErrors(err, !val);
    
    // Validate Customer
    val = this.get('customer');
    err = XM.errors.findProperty('code', 'xt1011');
    this.updateErrors(err, !val);

    // Validate Currency
    val = this.get('currency');
    err = XM.errors.findProperty('code', 'xt1014');
    this.updateErrors(err, !val);

    // Validate Terms
    val = this.get('terms');
    err = XM.errors.findProperty('code', 'xt1013');
    this.updateErrors(err, !val);

    // Validate Commission
    val = this.get('commission');
    err = XM.errors.findProperty('code', 'xt1016');
    this.updateErrors(err, isNan(val));

    // Validate Lines
    val = this.get('linesLength');
    err = XM.errors.findProperty('code', 'xt1010');
    this.updateErrors(err, !val);

    // Validate Freight
    val = this.get('freight');
    err = XM.errors.findProperty('code', 'xt1015');
    this.updateErrors(err, isNan(val));

    // Validate Total
    val = this.get('total');
    err = XM.errors.findProperty('code', 'xt1009');
    this.updateErrors(err, val < 0);

    return errors;
  }.observes('number', 'customer', 'linesLength', 'total'),
  
  
  /**
    Populates customer defaults when customer changes.
  */
  customerDidChange: function() {
    var customer = this.get('customer'),
        status = this.get('status');
    
    this.set('freeFormBillto', customer.get('freeFormBillto'));
    this.set('freeFormShipto', customer.get('freeFormShipto'));
    
    // pass defaults in
    if(status === SC.Record.READY_NEW) {
      this.set('salesRep', customer.get('salesRep'));
      this.set('commission', customer.get('commission') * 100);
      this.set('terms', customer.get('terms'));
      this.set('taxZone', customer.get('taxZone'));
      this.set('currency', customer.get('currency'));
      this.set('shipCharge', customer.get('shipCharge'));
      this.set('shipto', customer.get('shipto'));
      
      this.set('billtoName', customer.get('name'));
      this.set('billtoAddress1', customer.getPath('billingContact.address.line1'));
      this.set('billtoAddress2', customer.getPath('billingContact.address.line2'));
      this.set('billtoCity', customer.getPath('billingContact.address.city')); 
      this.set('billtoState', customer.getPath('billingContact.address.state'));
      this.set('billtoPostalCode', customer.getPath('billingContact.address.postalCode'));
      this.set('billtoCountry', customer.getPath('billingContact.address.country'));
      this.set('billtoPhone', customer.getPath('billingContact.phone'));
      
    // can not change customer after committing
    } else if (status & SC.Record.READY)
      this.set('customer', this._attrCache.get('customer'));
    }
  }.observes('customer'),
  
  /**
    Populates shipto defaults when shipto changes.
  */
  shiptoDidChange: function() {
    var shipto = this.get('shipto');
    
    if(status & READY) {
      this.set('salesRep', shipto.get('salesRep'));
      this.set('commission', shipto.get('commission') * 100);
      this.set('taxZone', shipto.get('taxZone'));
      this.set('shipCharge', shipto.get('shipCharge'));
    }    
  }.observes('shipto'),

});

